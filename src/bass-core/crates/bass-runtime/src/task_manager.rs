//! Bass 控制器管理与任务调度核心 (`TaskManager`)
//!
//! 负责操作模式与安全联锁策略、4 阶段语义编译器联动、Rhai 任务调度、
//! 单步/连续/暂停/复位行指针控制与状态快照发布，
//! 并通过 `MotionKernelApi` 异步接口调用解耦的 `bass-motion-kernel`。

use crate::state_machine::ControllerStateMachine;
use bass_compiler::RobotCompiler;
use bass_interpreter::{InterpreterEvent, MotionType, RhaiInterpreter, StepOutcome};
use bass_logger::{LogCategory, LogManager};
use bass_motion::Serial6DofKinematics;
use bass_motion_kernel::{
    MotionEvent, MotionKernelApi, MotionTelemetry, MOTION_CYCLE_DT_S, MOTION_CYCLE_MS,
};
use bass_types::{InterpreterState, JogCommand, MotionTarget, OpMode, RobotStateSnapshot};
use std::path::{Path, PathBuf};
use std::sync::Arc;
use std::time::Duration;
use tokio::sync::{broadcast, mpsc, oneshot, watch};

/// 程序执行控制指令
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum TaskControlCommand {
    Run,
    Step,
    Pause,
    Reset,
}

/// 从 gRPC 网关发往任务管理核心的异步指令
pub enum TaskCommand {
    SetMode {
        mode: OpMode,
        resp: oneshot::Sender<OpMode>,
    },
    SetDrivesPower {
        enable: bool,
        resp: oneshot::Sender<Result<bool, String>>,
    },
    SetEmergencyStop {
        estop: bool,
        resp: oneshot::Sender<bool>,
    },
    SetSpeedOverride {
        val: u8,
        resp: oneshot::Sender<u8>,
    },
    SetDigitalOut {
        pin: usize,
        value: bool,
        resp: oneshot::Sender<Result<[bool; 8], String>>,
    },
    ControlTask {
        command: TaskControlCommand,
        program_name: Option<String>,
        resp: oneshot::Sender<Result<(), String>>,
    },
    LoadProgram {
        name: String,
        code: String,
        resp: oneshot::Sender<Result<(), String>>,
    },
    LoadProgramFile {
        name: String,
        resp: oneshot::Sender<Result<(), String>>,
    },
    JogStep {
        cmd: JogCommand,
        resp: oneshot::Sender<Result<(), String>>,
    },
    JogHold {
        cmd: JogCommand,
        resp: oneshot::Sender<Result<(), String>>,
    },
    JogStop {
        resp: oneshot::Sender<()>,
    },
}

/// gRPC 服务端与控制器内部共享的轻量任务控制句柄
#[derive(Clone)]
pub struct TaskHandle {
    cmd_tx: mpsc::UnboundedSender<TaskCommand>,
    snapshot_rx: watch::Receiver<RobotStateSnapshot>,
}

impl TaskHandle {
    pub fn latest_snapshot(&self) -> RobotStateSnapshot {
        self.snapshot_rx.borrow().clone()
    }

    pub fn subscribe_snapshot(&self) -> watch::Receiver<RobotStateSnapshot> {
        self.snapshot_rx.clone()
    }

    async fn send_cmd<R>(&self, build: impl FnOnce(oneshot::Sender<R>) -> TaskCommand) -> Result<R, String> {
        let (tx, rx) = oneshot::channel();
        self.cmd_tx
            .send(build(tx))
            .map_err(|_| "控制器任务管理通道已断开".to_string())?;
        rx.await.map_err(|_| "控制器任务管理响应超时".to_string())
    }

    pub async fn set_mode(&self, mode: OpMode) -> Result<OpMode, String> {
        self.send_cmd(|resp| TaskCommand::SetMode { mode, resp })
            .await
    }

    pub async fn set_drives_power(&self, enable: bool) -> Result<bool, String> {
        self.send_cmd(|resp| TaskCommand::SetDrivesPower { enable, resp })
            .await?
    }

    pub async fn set_emergency_stop(&self, estop: bool) -> Result<bool, String> {
        self.send_cmd(|resp| TaskCommand::SetEmergencyStop { estop, resp })
            .await
    }

    pub async fn set_speed_override(&self, val: u8) -> Result<u8, String> {
        self.send_cmd(|resp| TaskCommand::SetSpeedOverride { val, resp })
            .await
    }

    pub async fn set_dout(&self, pin: usize, value: bool) -> Result<[bool; 8], String> {
        self.send_cmd(|resp| TaskCommand::SetDigitalOut { pin, value, resp })
            .await?
    }

    pub async fn control_task(
        &self,
        command: TaskControlCommand,
        program_name: Option<String>,
    ) -> Result<(), String> {
        self.send_cmd(|resp| TaskCommand::ControlTask {
            command,
            program_name,
            resp,
        })
        .await?
    }

    pub async fn load_program(&self, name: String, code: String) -> Result<(), String> {
        self.send_cmd(|resp| TaskCommand::LoadProgram { name, code, resp })
            .await?
    }

    pub async fn load_program_file(&self, name: String) -> Result<(), String> {
        self.send_cmd(|resp| TaskCommand::LoadProgramFile { name, resp })
            .await?
    }

    pub async fn jog_step(&self, cmd: JogCommand) -> Result<(), String> {
        self.send_cmd(|resp| TaskCommand::JogStep { cmd, resp })
            .await?
    }

    pub async fn jog_hold(&self, cmd: JogCommand) -> Result<(), String> {
        self.send_cmd(|resp| TaskCommand::JogHold { cmd, resp })
            .await?
    }

    pub async fn jog_stop(&self) -> Result<(), String> {
        self.send_cmd(|resp| TaskCommand::JogStop { resp }).await
    }
}

/// 校验程序文件名合法性（防止路径跳转并强制以 .rhai 结尾）
pub fn validate_program_name(name: &str) -> Result<(), &'static str> {
    if name.contains("..") || name.contains('/') || name.contains('\\') {
        return Err("非法的文件名 (包含路径跳转符)");
    }
    if !name.ends_with(".rhai") || name.len() <= 5 {
        return Err("程序文件名必须以 .rhai 结尾");
    }
    Ok(())
}

/// 控制器管理与任务调度核心
pub struct TaskManager {
    pub motion_api: Arc<dyn MotionKernelApi>,
    pub compiler: Arc<RobotCompiler>,
    pub interpreter: RhaiInterpreter,
    pub state_machine: ControllerStateMachine,
    pub logger: LogManager,
    pub programs_dir: PathBuf,
    pub current_program_name: String,
    pub wait_remaining: f64,
    pub pending_motion_id: Option<u64>,

    latest_telemetry: MotionTelemetry,
    motion_event_rx: broadcast::Receiver<MotionEvent>,
    cmd_rx: Option<mpsc::UnboundedReceiver<TaskCommand>>,
    snapshot_tx: watch::Sender<RobotStateSnapshot>,
}

impl TaskManager {
    pub fn new(
        motion_api: Arc<dyn MotionKernelApi>,
        kinematics: &Serial6DofKinematics,
        logger: LogManager,
        programs_dir: impl AsRef<Path>,
    ) -> Result<(Self, TaskHandle), String> {
        let compiler = Arc::new(RobotCompiler::new(kinematics.clone()));
        Self::with_compiler(motion_api, kinematics, compiler, logger, programs_dir)
    }

    pub fn with_compiler(
        motion_api: Arc<dyn MotionKernelApi>,
        kinematics: &Serial6DofKinematics,
        compiler: Arc<RobotCompiler>,
        logger: LogManager,
        programs_dir: impl AsRef<Path>,
    ) -> Result<(Self, TaskHandle), String> {
        let home_joints = kinematics.home_joints();
        let interpreter = RhaiInterpreter::with_home(home_joints)
            .map_err(|e| format!("初始化 Rhai 解释器失败: {}", e))?;

        let latest_telemetry = motion_api.latest_telemetry();
        let motion_event_rx = motion_api.subscribe_events();

        let mut state_machine = ControllerStateMachine::new();
        state_machine.drives_on = latest_telemetry.drives_enabled;
        state_machine.emergency_stop = latest_telemetry.estop_active;
        state_machine.speed_override = latest_telemetry.speed_override;
        state_machine.plant_online = latest_telemetry.plant_online;
        state_machine.digital_out = latest_telemetry.digital_out;

        let initial_snapshot = build_snapshot(
            &state_machine,
            &interpreter,
            &latest_telemetry,
            "",
        );

        let (cmd_tx, cmd_rx) = mpsc::unbounded_channel();
        let (snapshot_tx, snapshot_rx) = watch::channel(initial_snapshot);

        let handle = TaskHandle {
            cmd_tx,
            snapshot_rx,
        };

        let mgr = Self {
            motion_api,
            compiler,
            interpreter,
            state_machine,
            logger,
            programs_dir: programs_dir.as_ref().to_path_buf(),
            current_program_name: String::new(),
            wait_remaining: 0.0,
            pending_motion_id: None,
            latest_telemetry,
            motion_event_rx,
            cmd_rx: Some(cmd_rx),
            snapshot_tx,
        };

        Ok((mgr, handle))
    }

    pub fn current_snapshot(&self) -> RobotStateSnapshot {
        build_snapshot(
            &self.state_machine,
            &self.interpreter,
            &self.latest_telemetry,
            &self.current_program_name,
        )
    }

    fn publish_snapshot(&self) {
        let _ = self.snapshot_tx.send(self.current_snapshot());
    }

    fn sync_from_telemetry(&mut self) {
        let telem = self.motion_api.latest_telemetry();
        self.state_machine.drives_on = telem.drives_enabled;
        self.state_machine.emergency_stop = telem.estop_active;
        self.state_machine.speed_override = telem.speed_override;
        self.state_machine.plant_online = telem.plant_online;
        self.interpreter.set_digital_inputs(telem.digital_in);
        self.latest_telemetry = telem;
    }

    pub async fn load_program_source(&mut self, name: &str, code: &str) -> Result<(), String> {
        let compiled = self.compiler.compile(name, code).map_err(|e| {
            let msg = format!("程序编译失败: {}", e);
            self.logger.error(LogCategory::Compiler, "compiler", &msg);
            msg
        })?;
        let ir_count = compiled.ir.stats.total_instructions;
        self.interpreter.load_program(compiled).map_err(|e| {
            let msg = format!("程序加载失败: {}", e);
            self.logger.error(LogCategory::Script, "interpreter", &msg);
            msg
        })?;
        self.current_program_name = name.to_string();
        let _ = self.motion_api.stop_motion().await;
        self.pending_motion_id = None;
        self.wait_remaining = 0.0;
        self.state_machine.status_message = format!("已载入程序: {}", name);
        self.publish_snapshot();
        self.logger.info(
            LogCategory::Compiler,
            "compiler",
            format!("编译并加载程序: {} (IR {} 条指令)", name, ir_count),
        );
        Ok(())
    }

    pub async fn load_program_file(&mut self, name: &str) -> Result<(), String> {
        validate_program_name(name).map_err(|e| e.to_string())?;
        let file_path = self.programs_dir.join(name);
        let code = std::fs::read_to_string(&file_path)
            .map_err(|e| format!("无法读取程序文件 {:?}: {}", file_path, e))?;
        self.load_program_source(name, &code).await
    }

    fn abort_program_on_safety_trip(&mut self, reason: &str, motion_was_active: bool) {
        let had_program_motion =
            motion_was_active || self.pending_motion_id.is_some() || self.wait_remaining > 0.0;

        self.pending_motion_id = None;
        self.wait_remaining = 0.0;

        if had_program_motion
            && matches!(
                self.interpreter.state(),
                InterpreterState::Running | InterpreterState::Paused
            )
        {
            self.interpreter.set_state(InterpreterState::Error);
            self.state_machine.status_message =
                "通信掉线/安全跳闸导致在途轨迹中断，请 RESET 重置程序".to_string();
            self.logger.warn(
                LogCategory::Safety,
                "safety",
                format!("{}: 在途轨迹中断，解释器已锁定为 Error", reason),
            );
        } else if self.interpreter.state() == InterpreterState::Running {
            self.interpreter.set_state(InterpreterState::Paused);
            self.state_machine.status_message = format!("{}: 程序已安全暂停", reason);
            self.logger.warn(
                LogCategory::Safety,
                "safety",
                format!("{}: 程序已安全暂停", reason),
            );
        } else if !reason.is_empty() && self.interpreter.state() != InterpreterState::Error {
            self.state_machine.status_message = reason.to_string();
            self.logger.warn(LogCategory::Safety, "safety", reason);
        }
    }

    fn handle_motion_event(&mut self, ev: MotionEvent) {
        match ev {
            MotionEvent::MotionCompleted { motion_id } => {
                if self.pending_motion_id == Some(motion_id) {
                    self.pending_motion_id = None;
                    if self.interpreter.is_single_step()
                        && self.interpreter.state() == InterpreterState::Running
                    {
                        self.interpreter.set_state(InterpreterState::Paused);
                    }
                }
            }
            MotionEvent::MotionFailed { motion_id, error } => {
                if self.pending_motion_id == Some(motion_id) {
                    self.pending_motion_id = None;
                    self.wait_remaining = 0.0;
                    self.interpreter.set_state(InterpreterState::Error);
                    self.state_machine.status_message = error.clone();
                    self.logger
                        .error(LogCategory::Motion, "motion-kernel", error);
                }
            }
            MotionEvent::SafetyTripped {
                reason,
                fault_code: _,
                was_moving,
            } => {
                self.sync_from_telemetry();
                self.abort_program_on_safety_trip(&reason, was_moving);
            }
            MotionEvent::PlantOnlineChanged {
                online,
                sim_tick: _,
            } => {
                self.sync_from_telemetry();
                if online && self.state_machine.status_message.contains("超时") {
                    self.state_machine.status_message =
                        "仿真物理端已上线 (电机保持下电，请手动上电)".to_string();
                }
            }
            MotionEvent::FaultCleared => {
                self.sync_from_telemetry();
                if self.state_machine.status_message.contains("故障") {
                    self.state_machine.status_message =
                        "物理端故障已清除 (请确认 RESET 后再上电)".to_string();
                }
            }
        }
    }

    fn drain_motion_events(&mut self) {
        loop {
            match self.motion_event_rx.try_recv() {
                Ok(ev) => self.handle_motion_event(ev),
                Err(broadcast::error::TryRecvError::Lagged(skipped)) => {
                    self.logger.warn(
                        LogCategory::System,
                        "task-manager",
                        format!("运动事件通道消费滞后，跳过 {} 条事件", skipped),
                    );
                    let telem = self.motion_api.latest_telemetry();
                    if let Some(pid) = self.pending_motion_id {
                        if telem.active_motion_id != Some(pid)
                            && !matches!(
                                telem.motion_state,
                                bass_types::MotionState::MoveL | bass_types::MotionState::MoveJ
                            )
                        {
                            self.pending_motion_id = None;
                            if self.interpreter.is_single_step()
                                && self.interpreter.state() == InterpreterState::Running
                            {
                                self.interpreter.set_state(InterpreterState::Paused);
                            }
                        }
                    }
                }
                Err(_) => break,
            }
        }
    }

    pub async fn set_mode(&mut self, mode: OpMode) -> OpMode {
        if self.state_machine.set_mode(mode) {
            let _ = self.motion_api.jog_stop().await;
            if self.interpreter.state() == InterpreterState::Running {
                self.interpreter.set_state(InterpreterState::Paused);
                let _ = self.motion_api.set_motion_paused(true).await;
            }
            self.logger.info(
                LogCategory::System,
                "task-manager",
                format!("操作模式切换为 {:?}", mode),
            );
        }
        self.state_machine.op_mode
    }

    pub async fn set_drives_power(&mut self, enable: bool) -> Result<bool, String> {
        let had_motion = self.pending_motion_id.is_some() || self.wait_remaining > 0.0;
        if enable {
            if self.state_machine.emergency_stop {
                self.state_machine.status_message = "急停被触发，无法使能电机".to_string();
                return Err("急停被触发，无法使能电机".to_string());
            }
            match self.motion_api.set_drives_power(true).await {
                Ok(on) => {
                    self.sync_from_telemetry();
                    self.state_machine.status_message = if on {
                        "伺服使能已开启".to_string()
                    } else {
                        "伺服使能已关闭".to_string()
                    };
                    Ok(on)
                }
                Err(err) => {
                    self.sync_from_telemetry();
                    self.state_machine.status_message = err.clone();
                    Err(err)
                }
            }
        } else {
            let res = self.motion_api.set_drives_power(false).await;
            self.sync_from_telemetry();
            if had_motion || self.interpreter.state() == InterpreterState::Running {
                self.abort_program_on_safety_trip("伺服驱动已手动断开", had_motion);
            } else {
                self.state_machine.status_message = "伺服使能已关闭".to_string();
            }
            res
        }
    }

    pub async fn set_emergency_stop(&mut self, estop: bool) -> bool {
        let res = self
            .motion_api
            .set_emergency_stop(estop)
            .await
            .unwrap_or(estop);
        self.drain_motion_events();
        self.sync_from_telemetry();
        if estop {
            if self.interpreter.state() != InterpreterState::Error {
                self.state_machine.status_message = "急停被触发".to_string();
            }
        } else {
            self.state_machine.status_message =
                "急停已复位 (电机保持下电，请手动重新使能)".to_string();
        }
        res
    }

    pub async fn set_speed_override(&mut self, val: u8) -> u8 {
        let clamped = val.clamp(5, 100);
        let applied = self
            .motion_api
            .set_speed_override(clamped)
            .await
            .unwrap_or(clamped);
        self.state_machine.set_speed_override(applied);
        applied
    }

    pub async fn set_dout(&mut self, pin: usize, value: bool) -> Result<[bool; 8], String> {
        self.state_machine
            .set_dout(pin, value)
            .map_err(|e| e.to_string())?;
        self.motion_api.set_digital_out(pin, value).await
    }

    pub async fn execute_task_control(
        &mut self,
        command: TaskControlCommand,
        program_name: Option<String>,
    ) -> Result<(), String> {
        self.sync_from_telemetry();

        if let Some(prog) = program_name {
            if !prog.is_empty()
                && (self.current_program_name != prog
                    || self.interpreter.loaded_program_name() != Some(&prog))
            {
                self.load_program_file(&prog).await?;
            }
        }

        match command {
            TaskControlCommand::Run => {
                if !self.state_machine.can_move() {
                    return Err("无法运行: 伺服未使能、处于急停或物理端离线".to_string());
                }
                match self.interpreter.state() {
                    InterpreterState::Paused => {
                        let _ = self.motion_api.jog_stop().await;
                        let _ = self.motion_api.set_motion_paused(false).await;
                        self.interpreter.set_single_step(false);
                        self.interpreter.set_state(InterpreterState::Running);
                    }
                    InterpreterState::Ready | InterpreterState::Completed => {
                        let _ = self.motion_api.stop_motion().await;
                        self.pending_motion_id = None;
                        self.wait_remaining = 0.0;
                        self.interpreter.reset();
                        self.interpreter.set_single_step(false);
                        self.interpreter.set_state(InterpreterState::Running);
                    }
                    InterpreterState::Running => {
                        let _ = self.motion_api.set_motion_paused(false).await;
                        self.interpreter.set_single_step(false);
                    }
                    InterpreterState::Error => {
                        return Err("解释器处于错误状态，请先执行 RESET 重置".to_string());
                    }
                    InterpreterState::Idle => {
                        return Err("尚未加载程序，无法执行 RUN".to_string());
                    }
                }
                self.state_machine.status_message = "程序正在运行".to_string();
                let prog_label = self
                    .interpreter
                    .loaded_program_name()
                    .unwrap_or("<未命名>")
                    .to_string();
                self.logger.info(
                    LogCategory::Script,
                    "task-manager",
                    format!("开始运行程序: {}", prog_label),
                );
                Ok(())
            }
            TaskControlCommand::Step => {
                if !self.state_machine.can_move() {
                    return Err("无法单步: 伺服未使能、处于急停或物理端离线".to_string());
                }
                self.interpreter.set_single_step(true);
                match self.interpreter.state() {
                    InterpreterState::Ready | InterpreterState::Completed => {
                        let _ = self.motion_api.stop_motion().await;
                        self.pending_motion_id = None;
                        self.wait_remaining = 0.0;
                        self.interpreter.reset();
                        self.interpreter.set_state(InterpreterState::Running);
                    }
                    InterpreterState::Paused => {
                        let _ = self.motion_api.jog_stop().await;
                        let _ = self.motion_api.set_motion_paused(false).await;
                        self.interpreter.set_state(InterpreterState::Running);
                    }
                    InterpreterState::Running => {
                        let _ = self.motion_api.set_motion_paused(false).await;
                    }
                    InterpreterState::Error => {
                        return Err("解释器处于错误状态，请先执行 RESET 重置".to_string());
                    }
                    InterpreterState::Idle => {
                        return Err("尚未加载程序，无法执行 STEP".to_string());
                    }
                }
                self.state_machine.status_message = "单步步进中".to_string();
                self.logger
                    .info(LogCategory::Script, "task-manager", "执行程序单步 (STEP)");
                Ok(())
            }
            TaskControlCommand::Pause => {
                if self.interpreter.state() == InterpreterState::Running {
                    self.interpreter.set_state(InterpreterState::Paused);
                }
                let _ = self.motion_api.set_motion_paused(true).await;
                self.state_machine.status_message = "程序已暂停".to_string();
                self.logger
                    .info(LogCategory::Script, "task-manager", "程序已暂停 (PAUSE)");
                Ok(())
            }
            TaskControlCommand::Reset => {
                self.interpreter.reset();
                if self.interpreter.loaded_program_name().is_some() {
                    self.interpreter.set_state(InterpreterState::Ready);
                } else {
                    self.interpreter.set_state(InterpreterState::Idle);
                }
                let _ = self.motion_api.stop_motion().await;
                let _ = self.motion_api.clear_fault().await;
                self.pending_motion_id = None;
                self.wait_remaining = 0.0;
                self.state_machine.status_message = "程序已重置".to_string();
                self.logger.info(
                    LogCategory::System,
                    "task-manager",
                    "程序与控制器状态已复位 (RESET)",
                );
                Ok(())
            }
        }
    }

    pub async fn execute_jog_step(&mut self, cmd: JogCommand) -> Result<(), String> {
        self.sync_from_telemetry();
        if !self.state_machine.can_move() {
            return Err("无法点动: 伺服未使能、处于急停或物理端离线".to_string());
        }
        if self.state_machine.op_mode != OpMode::Manual {
            return Err("仅在 MANUAL 手动模式下允许点动".to_string());
        }
        if matches!(
            self.interpreter.state(),
            InterpreterState::Running | InterpreterState::Paused
        ) {
            return Err("程序运行或暂停中，请先 RESET 再手动点动".to_string());
        }
        self.motion_api.jog_step(cmd).await.map(|_| ())
    }

    pub async fn execute_jog_hold(&mut self, cmd: JogCommand) -> Result<(), String> {
        self.sync_from_telemetry();
        if !self.state_machine.can_move() {
            return Err("无法点动: 伺服未使能、处于急停或物理端离线".to_string());
        }
        if self.state_machine.op_mode != OpMode::Manual {
            return Err("仅在 MANUAL 手动模式下允许点动".to_string());
        }
        if matches!(
            self.interpreter.state(),
            InterpreterState::Running | InterpreterState::Paused
        ) {
            return Err("程序运行或暂停中，请先 RESET 再手动点动".to_string());
        }
        self.motion_api.jog_hold(cmd).await
    }

    fn finish_command<R>(&mut self, resp: oneshot::Sender<R>, res: R) {
        self.publish_snapshot();
        let _ = resp.send(res);
    }

    async fn handle_task_command(&mut self, cmd: TaskCommand) {
        match cmd {
            TaskCommand::SetMode { mode, resp } => {
                let res = self.set_mode(mode).await;
                self.finish_command(resp, res);
            }
            TaskCommand::SetDrivesPower { enable, resp } => {
                let res = self.set_drives_power(enable).await;
                self.finish_command(resp, res);
            }
            TaskCommand::SetEmergencyStop { estop, resp } => {
                let res = self.set_emergency_stop(estop).await;
                self.finish_command(resp, res);
            }
            TaskCommand::SetSpeedOverride { val, resp } => {
                let res = self.set_speed_override(val).await;
                self.finish_command(resp, res);
            }
            TaskCommand::SetDigitalOut { pin, value, resp } => {
                let res = self.set_dout(pin, value).await;
                self.finish_command(resp, res);
            }
            TaskCommand::ControlTask {
                command,
                program_name,
                resp,
            } => {
                let res = self.execute_task_control(command, program_name).await;
                self.finish_command(resp, res);
            }
            TaskCommand::LoadProgram { name, code, resp } => {
                let res = self.load_program_source(&name, &code).await;
                self.finish_command(resp, res);
            }
            TaskCommand::LoadProgramFile { name, resp } => {
                let res = self.load_program_file(&name).await;
                self.finish_command(resp, res);
            }
            TaskCommand::JogStep { cmd, resp } => {
                let res = self.execute_jog_step(cmd).await;
                self.finish_command(resp, res);
            }
            TaskCommand::JogHold { cmd, resp } => {
                let res = self.execute_jog_hold(cmd).await;
                self.finish_command(resp, res);
            }
            TaskCommand::JogStop { resp } => {
                let _ = self.motion_api.jog_stop().await;
                self.finish_command(resp, ());
            }
        }
    }

    async fn advance_execution(&mut self, dt_s: f64) {
        let can_advance_program =
            self.state_machine.can_move() && self.interpreter.state() == InterpreterState::Running;

        if self.pending_motion_id.is_some() {
            return;
        }

        if self.wait_remaining > 0.0 {
            if can_advance_program && dt_s > 0.0 {
                let effective_dt = dt_s * (self.state_machine.speed_override as f64 / 100.0);
                self.wait_remaining -= effective_dt;
                if self.wait_remaining <= 0.0 {
                    self.wait_remaining = 0.0;
                    if self.interpreter.is_single_step()
                        && self.interpreter.state() == InterpreterState::Running
                    {
                        self.interpreter.set_state(InterpreterState::Paused);
                    }
                }
            }
            return;
        }

        if !can_advance_program {
            return;
        }

        match self.interpreter.step_instruction() {
            Ok(StepOutcome::YieldedMotion {
                target,
                vel,
                motion_type,
            }) => {
                let call_res = match motion_type {
                    MotionType::Linear => match target {
                        MotionTarget::Pose(p) => self.motion_api.move_l(p, vel).await,
                        MotionTarget::Joints(_) => self.motion_api.move_j(target, vel).await,
                    },
                    MotionType::Joint => self.motion_api.move_j(target, vel).await,
                };
                match call_res {
                    Ok(motion_id) => {
                        self.pending_motion_id = Some(motion_id);
                    }
                    Err(e) => {
                        self.interpreter.set_state(InterpreterState::Error);
                        let msg = format!("轨迹规划/运动下发错误: {}", e);
                        self.state_machine.status_message = msg.clone();
                        self.logger.error(LogCategory::Motion, "task-manager", msg);
                    }
                }
            }
            Ok(StepOutcome::YieldedWait { duration_secs }) => {
                let dur = if duration_secs.is_finite() {
                    duration_secs.max(0.0)
                } else {
                    0.0
                };
                if dur <= 0.0 {
                    self.wait_remaining = 0.0;
                    if self.interpreter.is_single_step() {
                        self.interpreter.set_state(InterpreterState::Paused);
                    }
                } else {
                    self.wait_remaining = dur;
                }
            }
            Ok(StepOutcome::YieldedStep { line: _ }) => {
                // 由解释器内部置为 Paused
            }
            Ok(StepOutcome::Completed) => {
                self.state_machine.status_message = "程序执行完毕".to_string();
                self.logger.info(
                    LogCategory::Script,
                    "interpreter",
                    format!(
                        "程序执行完毕: {}",
                        self.interpreter.loaded_program_name().unwrap_or("")
                    ),
                );
            }
            Ok(StepOutcome::Error { line, message }) => {
                let msg = format!("运行时错误 (第 {:?} 行): {}", line, message);
                self.state_machine.status_message = msg.clone();
                self.logger.error(LogCategory::Script, "interpreter", msg);
            }
            Err(e) => {
                self.interpreter.set_state(InterpreterState::Error);
                let msg = format!("解释器错误: {}", e);
                self.state_machine.status_message = msg.clone();
                self.logger.error(LogCategory::Script, "interpreter", msg);
            }
        }

        // 处理 DO 与 Log 事件；Log 不得覆盖 Error 状态栏
        for ev in self.interpreter.drain_events() {
            match ev {
                InterpreterEvent::SetDigitalOut { pin, state } => {
                    if self.state_machine.set_dout_internal(pin, state).is_ok() {
                        let _ = self.motion_api.set_digital_out(pin, state).await;
                    }
                }
                InterpreterEvent::Log(msg) => {
                    tracing::info!("Script Log: {}", msg);
                    self.logger.info(LogCategory::Script, "script", msg.clone());
                    if self.interpreter.state() != InterpreterState::Error {
                        self.state_machine.status_message = msg;
                    }
                }
            }
        }
    }

    /// 执行单个协调周期（用于确定性单元测试）
    pub async fn step_once(&mut self, dt_s: f64) {
        if let Some(mut rx) = self.cmd_rx.take() {
            let mut count = 0;
            while count < 32 {
                match rx.try_recv() {
                    Ok(cmd) => {
                        count += 1;
                        self.handle_task_command(cmd).await;
                    }
                    Err(_) => break,
                }
            }
            self.cmd_rx = Some(rx);
        }

        self.drain_motion_events();
        self.sync_from_telemetry();
        self.advance_execution(dt_s).await;
        self.publish_snapshot();
    }

    /// 启动长期异步任务与状态协调主循环
    pub async fn run_loop(mut self) {
        let mut cmd_rx = self
            .cmd_rx
            .take()
            .expect("TaskManager command receiver already taken");
        let mut telemetry_rx = self.motion_api.subscribe_telemetry();
        let mut tick = tokio::time::interval(Duration::from_millis(MOTION_CYCLE_MS));
        tick.set_missed_tick_behavior(tokio::time::MissedTickBehavior::Skip);

        self.sync_from_telemetry();
        self.publish_snapshot();

        loop {
            tokio::select! {
                cmd = cmd_rx.recv() => {
                    match cmd {
                        Some(c) => {
                            self.handle_task_command(c).await;
                            self.drain_motion_events();
                            self.sync_from_telemetry();
                            self.advance_execution(0.0).await;
                            self.publish_snapshot();
                        }
                        None => break,
                    }
                }
                ev = self.motion_event_rx.recv() => {
                    match ev {
                        Ok(event) => {
                            self.handle_motion_event(event);
                            self.drain_motion_events();
                            self.sync_from_telemetry();
                            self.advance_execution(0.0).await;
                            self.publish_snapshot();
                        }
                        Err(broadcast::error::RecvError::Lagged(skipped)) => {
                            self.logger.warn(
                                LogCategory::System,
                                "task-manager",
                                format!("运动事件接收滞后 ({} 条)", skipped),
                            );
                            let telem = self.motion_api.latest_telemetry();
                            if let Some(pid) = self.pending_motion_id {
                                if telem.active_motion_id != Some(pid)
                                    && !matches!(
                                        telem.motion_state,
                                        bass_types::MotionState::MoveL | bass_types::MotionState::MoveJ
                                    )
                                {
                                    self.pending_motion_id = None;
                                }
                            }
                            self.sync_from_telemetry();
                            self.advance_execution(0.0).await;
                            self.publish_snapshot();
                        }
                        Err(broadcast::error::RecvError::Closed) => break,
                    }
                }
                changed = telemetry_rx.changed() => {
                    if changed.is_err() {
                        break;
                    }
                    self.sync_from_telemetry();
                    self.publish_snapshot();
                }
                _ = tick.tick() => {
                    self.drain_motion_events();
                    self.sync_from_telemetry();
                    self.advance_execution(MOTION_CYCLE_DT_S).await;
                    self.publish_snapshot();
                }
            }
        }
    }
}

fn build_snapshot(
    sm: &ControllerStateMachine,
    interpreter: &RhaiInterpreter,
    telem: &MotionTelemetry,
    current_program_name: &str,
) -> RobotStateSnapshot {
    RobotStateSnapshot {
        op_mode: sm.op_mode,
        drives_on: sm.drives_on,
        emergency_stop: sm.emergency_stop,
        speed_override: sm.speed_override,
        interpreter_state: interpreter.state(),
        motion_state: telem.motion_state,
        active_program: interpreter
            .loaded_program_name()
            .unwrap_or(current_program_name)
            .to_string(),
        current_line: interpreter.current_line(),
        joint_actual: telem.joint_actual,
        joint_torque: telem.joint_torque,
        cart_actual: telem.cart_actual,
        digital_out: sm.digital_out,
        plant_online: sm.plant_online,
        rtt_ms: telem.rtt_ms,
        cycle_count: telem.cycle_count,
        sim_tick: telem.sim_tick,
        status_message: sm.status_message.clone(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use bass_hal::MockFieldbusTransport;
    use bass_motion_kernel::MotionKernel;
    use bass_types::{
        CoordSystem, Joints6D, MotionState, TxPdo, CTRL_FAULT_RESET, STAT_DRIVES_ENABLED,
        STAT_FAULT, STAT_PLANT_READY,
    };
    use std::future::Future;
    use std::time::Instant;

    fn test_instance_dir() -> PathBuf {
        Path::new(env!("CARGO_MANIFEST_DIR")).join("../../../../runtime/instances/default_cell")
    }

    fn make_test_kinematics() -> Serial6DofKinematics {
        Serial6DofKinematics::from_json_file(test_instance_dir().join("config/robot_model.json"))
            .unwrap()
    }

    fn test_programs_dir() -> PathBuf {
        test_instance_dir().join("programs")
    }

    fn make_test_tx(sim_tick: u64, echo_seq: u64, q: [f64; 6]) -> TxPdo {
        TxPdo {
            status_word: STAT_PLANT_READY | STAT_DRIVES_ENABLED,
            echo_seq,
            sim_tick,
            q_act_deg: q,
            qd_act_deg_s: [0.0; 6],
            tau_act_nm: [1.0; 6],
            digital_in: 0,
            fault_code: 0,
        }
    }

    async fn drive_with_motion<F, R>(
        mk: &mut MotionKernel<MockFieldbusTransport>,
        now: Instant,
        fut: F,
    ) -> R
    where
        F: Future<Output = R>,
    {
        tokio::pin!(fut);
        loop {
            tokio::select! {
                res = &mut fut => return res,
                _ = tokio::task::yield_now() => {
                    mk.step_once(now);
                }
            }
        }
    }

    async fn setup_pair() -> (
        MotionKernel<MockFieldbusTransport>,
        bass_motion_kernel::MotionKernelClient,
        TaskManager,
        TaskHandle,
    ) {
        let kin = make_test_kinematics();
        let mock = MockFieldbusTransport::new();
        let logger = LogManager::in_memory(500);
        let (mk, mk_client) = MotionKernel::new(kin.clone(), mock, logger.clone());
        let api: Arc<dyn MotionKernelApi> = Arc::new(mk_client.clone());
        let (tm, handle) = TaskManager::new(api, &kin, logger, test_programs_dir()).unwrap();
        (mk, mk_client, tm, handle)
    }

    async fn step_pair(
        mk: &mut MotionKernel<MockFieldbusTransport>,
        tm: &mut TaskManager,
        now: Instant,
    ) {
        mk.step_once(now);
        drive_with_motion(mk, now, tm.step_once(MOTION_CYCLE_DT_S)).await;
    }

    #[tokio::test]
    async fn test_bumpless_transfer_on_enable_disable_estop() {
        let (mut mk, _mkc, mut tm, _th) = setup_pair().await;
        let mut now = Instant::now();

        assert!(!tm.state_machine.drives_on);

        let custom_q = [12.0, -80.0, 75.0, 10.0, 35.0, -5.0];
        mk.transport.push_tx_pdo(make_test_tx(1, 0, custom_q));
        step_pair(&mut mk, &mut tm, now).await;

        assert_eq!(mk.q_cmd.values, custom_q);
        assert_eq!(mk.q_act.values, custom_q);

        drive_with_motion(&mut mk, now, tm.set_drives_power(true))
            .await
            .unwrap();
        assert!(tm.state_machine.drives_on);
        assert!(tm.state_machine.can_move());
        assert_eq!(mk.q_cmd.values, custom_q);

        drive_with_motion(&mut mk, now, tm.set_emergency_stop(true)).await;
        assert!(!tm.state_machine.drives_on);
        assert!(!tm.state_machine.can_move());

        let slipped_q = [12.5, -80.2, 75.1, 10.0, 35.0, -5.0];
        mk.transport.push_tx_pdo(make_test_tx(2, 1, slipped_q));
        now += Duration::from_millis(MOTION_CYCLE_MS);
        step_pair(&mut mk, &mut tm, now).await;

        assert_eq!(mk.q_cmd.values, slipped_q);
    }

    #[tokio::test]
    async fn test_hold_to_jog_150ms_watchdog_auto_stop() {
        let (mut mk, _mkc, mut tm, _th) = setup_pair().await;
        let mut now = Instant::now();

        mk.transport
            .push_tx_pdo(make_test_tx(1, 0, Joints6D::home().values));
        step_pair(&mut mk, &mut tm, now).await;
        drive_with_motion(&mut mk, now, tm.set_drives_power(true))
            .await
            .unwrap();

        let jog_cmd = JogCommand {
            coord_system: CoordSystem::Cartesian,
            axis: "X".to_string(),
            direction: 1.0,
            step_size: 10.0,
        };

        drive_with_motion(&mut mk, now, tm.execute_jog_hold(jog_cmd.clone()))
            .await
            .unwrap();
        assert!(mk.hold_jog_active);
        assert!(mk.planner.is_busy());

        for _ in 0..12 {
            now += Duration::from_millis(MOTION_CYCLE_MS);
            let rx = mk.transport.last_sent_rx().cloned().unwrap();
            mk.transport
                .push_tx_pdo(make_test_tx(mk.sim_tick + 1, rx.seq, rx.q_cmd_deg));
            step_pair(&mut mk, &mut tm, now).await;
        }
        assert!(mk.hold_jog_active);

        now += Duration::from_millis(160);
        for _ in 0..10 {
            now += Duration::from_millis(MOTION_CYCLE_MS);
            let rx = mk.transport.last_sent_rx().cloned().unwrap();
            mk.transport
                .push_tx_pdo(make_test_tx(mk.sim_tick + 1, rx.seq, rx.q_cmd_deg));
            step_pair(&mut mk, &mut tm, now).await;
        }

        assert!(!mk.hold_jog_active);
        assert!(!mk.planner.is_busy());
        assert_eq!(mk.planner.motion_state(), MotionState::Idle);
    }

    #[tokio::test]
    async fn test_step_single_line_pause_and_resume() {
        let (mut mk, _mkc, mut tm, _th) = setup_pair().await;
        let mut now = Instant::now();

        mk.transport
            .push_tx_pdo(make_test_tx(1, 0, Joints6D::home().values));
        step_pair(&mut mk, &mut tm, now).await;
        drive_with_motion(&mut mk, now, tm.set_drives_power(true))
            .await
            .unwrap();

        let script = r#"
            DO(1, true);
            DO(2, true);
            DO(3, true);
        "#;
        drive_with_motion(&mut mk, now, tm.load_program_source("test_step.rhai", script))
            .await
            .unwrap();
        assert_eq!(tm.interpreter.state(), InterpreterState::Ready);

        drive_with_motion(
            &mut mk,
            now,
            tm.execute_task_control(TaskControlCommand::Step, None),
        )
        .await
        .unwrap();
        now += Duration::from_millis(MOTION_CYCLE_MS);
        step_pair(&mut mk, &mut tm, now).await;

        assert!(tm.state_machine.digital_out[0]);
        assert!(!tm.state_machine.digital_out[1]);
        assert_eq!(tm.interpreter.state(), InterpreterState::Paused);

        drive_with_motion(
            &mut mk,
            now,
            tm.execute_task_control(TaskControlCommand::Step, None),
        )
        .await
        .unwrap();
        now += Duration::from_millis(MOTION_CYCLE_MS);
        step_pair(&mut mk, &mut tm, now).await;

        assert!(tm.state_machine.digital_out[1]);
        assert!(!tm.state_machine.digital_out[2]);
        assert_eq!(tm.interpreter.state(), InterpreterState::Paused);

        drive_with_motion(
            &mut mk,
            now,
            tm.execute_task_control(TaskControlCommand::Run, None),
        )
        .await
        .unwrap();
        now += Duration::from_millis(MOTION_CYCLE_MS);
        step_pair(&mut mk, &mut tm, now).await;

        assert!(tm.state_machine.digital_out[2]);
        assert_eq!(tm.interpreter.state(), InterpreterState::Completed);
    }

    #[tokio::test]
    async fn test_full_6dof_rhai_move_square_and_pick_and_place_trajectory() {
        let (mut mk, _mkc, mut tm, _th) = setup_pair().await;
        let mut now = Instant::now();

        mk.transport
            .push_tx_pdo(make_test_tx(1, 0, Joints6D::home().values));
        step_pair(&mut mk, &mut tm, now).await;
        drive_with_motion(&mut mk, now, tm.set_mode(OpMode::Auto)).await;
        drive_with_motion(&mut mk, now, tm.set_drives_power(true))
            .await
            .unwrap();

        drive_with_motion(&mut mk, now, tm.load_program_file("MoveSquare.rhai"))
            .await
            .unwrap();
        assert_eq!(tm.interpreter.state(), InterpreterState::Ready);

        drive_with_motion(
            &mut mk,
            now,
            tm.execute_task_control(TaskControlCommand::Run, None),
        )
        .await
        .unwrap();

        let p1_target = [-220.0, 420.0, 340.0];
        let p2_target = [-220.0, 560.0, 340.0];
        let p3_target = [-80.0, 560.0, 340.0];
        let p4_target = [-80.0, 420.0, 340.0];

        let mut visited = [false; 4];
        let mut max_steps = 30000;
        while tm.interpreter.state() != InterpreterState::Completed && max_steps > 0 {
            now += Duration::from_millis(MOTION_CYCLE_MS);
            let rx = mk.transport.last_sent_rx().cloned().unwrap();
            mk.transport
                .push_tx_pdo(make_test_tx(mk.sim_tick + 1, rx.seq, rx.q_cmd_deg));
            step_pair(&mut mk, &mut tm, now).await;

            let tcp = tm.current_snapshot().cart_actual;
            for (idx, tgt) in [p1_target, p2_target, p3_target, p4_target]
                .iter()
                .enumerate()
            {
                let dist = ((tcp.x - tgt[0]).powi(2)
                    + (tcp.y - tgt[1]).powi(2)
                    + (tcp.z - tgt[2]).powi(2))
                .sqrt();
                if dist < 0.2 {
                    visited[idx] = true;
                }
            }
            assert_ne!(
                tm.interpreter.state(),
                InterpreterState::Error,
                "MoveSquare error: {}",
                tm.state_machine.status_message
            );
            max_steps -= 1;
        }

        assert_eq!(tm.interpreter.state(), InterpreterState::Completed);
        assert!(visited.iter().all(|&v| v), "visited={:?}", visited);
        assert!(!tm.state_machine.digital_out[0]);

        drive_with_motion(&mut mk, now, tm.load_program_file("PickAndPlace.rhai"))
            .await
            .unwrap();
        drive_with_motion(
            &mut mk,
            now,
            tm.execute_task_control(TaskControlCommand::Run, None),
        )
        .await
        .unwrap();

        let mut pap_steps = 50000;
        while tm.interpreter.state() != InterpreterState::Completed && pap_steps > 0 {
            now += Duration::from_millis(MOTION_CYCLE_MS);
            let rx = mk.transport.last_sent_rx().cloned().unwrap();
            mk.transport
                .push_tx_pdo(make_test_tx(mk.sim_tick + 1, rx.seq, rx.q_cmd_deg));
            step_pair(&mut mk, &mut tm, now).await;
            assert_ne!(
                tm.interpreter.state(),
                InterpreterState::Error,
                "PickAndPlace error: {}",
                tm.state_machine.status_message
            );
            pap_steps -= 1;
        }
        assert_eq!(tm.interpreter.state(), InterpreterState::Completed);
    }

    #[tokio::test]
    async fn test_pause_freezes_active_motion_and_wait_and_resumes() {
        let (mut mk, _mkc, mut tm, _th) = setup_pair().await;
        let mut now = Instant::now();

        mk.transport
            .push_tx_pdo(make_test_tx(1, 0, Joints6D::home().values));
        step_pair(&mut mk, &mut tm, now).await;
        drive_with_motion(&mut mk, now, tm.set_mode(OpMode::Auto)).await;
        drive_with_motion(&mut mk, now, tm.set_drives_power(true))
            .await
            .unwrap();

        let script = r#"
            MoveL(Pose(-220, 420, 340, 0, 0, 180), #{ vel: 100 });
            Wait(0.4);
            MoveL(Pose(-220, 560, 340, 0, 0, 180), #{ vel: 100 });
        "#;
        drive_with_motion(&mut mk, now, tm.load_program_source("pause_test.rhai", script))
            .await
            .unwrap();
        drive_with_motion(
            &mut mk,
            now,
            tm.execute_task_control(TaskControlCommand::Run, None),
        )
        .await
        .unwrap();

        for _ in 0..10 {
            now += Duration::from_millis(MOTION_CYCLE_MS);
            let rx = mk.transport.last_sent_rx().cloned().unwrap();
            mk.transport
                .push_tx_pdo(make_test_tx(mk.sim_tick + 1, rx.seq, rx.q_cmd_deg));
            step_pair(&mut mk, &mut tm, now).await;
        }
        assert!(mk.planner.is_busy());

        drive_with_motion(
            &mut mk,
            now,
            tm.execute_task_control(TaskControlCommand::Pause, None),
        )
        .await
        .unwrap();
        assert_eq!(tm.interpreter.state(), InterpreterState::Paused);
        let frozen_q = mk.q_cmd;

        for _ in 0..30 {
            now += Duration::from_millis(MOTION_CYCLE_MS);
            let rx = mk.transport.last_sent_rx().cloned().unwrap();
            mk.transport
                .push_tx_pdo(make_test_tx(mk.sim_tick + 1, rx.seq, rx.q_cmd_deg));
            step_pair(&mut mk, &mut tm, now).await;
            assert_eq!(mk.q_cmd, frozen_q);
            assert!(mk.planner.is_busy());
        }

        drive_with_motion(
            &mut mk,
            now,
            tm.execute_task_control(TaskControlCommand::Run, None),
        )
        .await
        .unwrap();
        assert_eq!(tm.interpreter.state(), InterpreterState::Running);

        while mk.planner.is_busy() {
            now += Duration::from_millis(MOTION_CYCLE_MS);
            let rx = mk.transport.last_sent_rx().cloned().unwrap();
            mk.transport
                .push_tx_pdo(make_test_tx(mk.sim_tick + 1, rx.seq, rx.q_cmd_deg));
            step_pair(&mut mk, &mut tm, now).await;
        }

        while tm.wait_remaining == 0.0 && tm.interpreter.state() == InterpreterState::Running {
            now += Duration::from_millis(MOTION_CYCLE_MS);
            let rx = mk.transport.last_sent_rx().cloned().unwrap();
            mk.transport
                .push_tx_pdo(make_test_tx(mk.sim_tick + 1, rx.seq, rx.q_cmd_deg));
            step_pair(&mut mk, &mut tm, now).await;
        }
        assert!(tm.wait_remaining > 0.0);

        for _ in 0..5 {
            now += Duration::from_millis(MOTION_CYCLE_MS);
            let rx = mk.transport.last_sent_rx().cloned().unwrap();
            mk.transport
                .push_tx_pdo(make_test_tx(mk.sim_tick + 1, rx.seq, rx.q_cmd_deg));
            step_pair(&mut mk, &mut tm, now).await;
        }

        drive_with_motion(
            &mut mk,
            now,
            tm.execute_task_control(TaskControlCommand::Pause, None),
        )
        .await
        .unwrap();
        let frozen_wait = tm.wait_remaining;
        assert!(frozen_wait > 0.0);

        for _ in 0..25 {
            now += Duration::from_millis(MOTION_CYCLE_MS);
            let rx = mk.transport.last_sent_rx().cloned().unwrap();
            mk.transport
                .push_tx_pdo(make_test_tx(mk.sim_tick + 1, rx.seq, rx.q_cmd_deg));
            step_pair(&mut mk, &mut tm, now).await;
            assert_eq!(tm.wait_remaining, frozen_wait);
        }

        drive_with_motion(
            &mut mk,
            now,
            tm.execute_task_control(TaskControlCommand::Run, None),
        )
        .await
        .unwrap();
        let mut max_steps = 10000;
        while tm.interpreter.state() != InterpreterState::Completed && max_steps > 0 {
            now += Duration::from_millis(MOTION_CYCLE_MS);
            let rx = mk.transport.last_sent_rx().cloned().unwrap();
            mk.transport
                .push_tx_pdo(make_test_tx(mk.sim_tick + 1, rx.seq, rx.q_cmd_deg));
            step_pair(&mut mk, &mut tm, now).await;
            max_steps -= 1;
        }
        assert_eq!(tm.interpreter.state(), InterpreterState::Completed);
    }

    #[tokio::test]
    async fn test_plant_offline_trips_drives_and_reconnect_bumpless() {
        let (mut mk, _mkc, mut tm, _th) = setup_pair().await;
        let mut now = Instant::now();

        mk.transport
            .push_tx_pdo(make_test_tx(1, 0, Joints6D::home().values));
        step_pair(&mut mk, &mut tm, now).await;
        drive_with_motion(&mut mk, now, tm.set_drives_power(true))
            .await
            .unwrap();

        assert!(tm.state_machine.plant_online);
        assert!(tm.state_machine.drives_on);

        now += Duration::from_millis(200);
        step_pair(&mut mk, &mut tm, now).await;

        assert!(!tm.state_machine.plant_online);
        assert!(!tm.state_machine.drives_on);
        assert!(tm
            .state_machine
            .status_message
            .contains("仿真物理端通信超时，驱动已安全断开"));

        let shifted_q = [18.0, -75.0, 65.0, 10.0, 40.0, -10.0];
        mk.transport.push_tx_pdo(make_test_tx(100, mk.seq, shifted_q));
        now += Duration::from_millis(MOTION_CYCLE_MS);
        step_pair(&mut mk, &mut tm, now).await;

        assert!(tm.state_machine.plant_online);
        assert!(!tm.state_machine.drives_on);
        assert_eq!(mk.q_cmd.values, shifted_q);

        drive_with_motion(&mut mk, now, tm.set_drives_power(true))
            .await
            .unwrap();
        assert!(tm.state_machine.drives_on);
        assert_eq!(mk.q_cmd.values, shifted_q);
    }

    #[tokio::test]
    async fn test_wait_zero_in_step_mode_pauses() {
        let (mut mk, _mkc, mut tm, _th) = setup_pair().await;
        let mut now = Instant::now();

        mk.transport
            .push_tx_pdo(make_test_tx(1, 0, Joints6D::home().values));
        step_pair(&mut mk, &mut tm, now).await;
        drive_with_motion(&mut mk, now, tm.set_drives_power(true))
            .await
            .unwrap();

        let script = r#"
            DO(1, true);
            Wait(0);
            DO(2, true);
        "#;
        drive_with_motion(
            &mut mk,
            now,
            tm.load_program_source("test_wait_zero.rhai", script),
        )
        .await
        .unwrap();

        drive_with_motion(
            &mut mk,
            now,
            tm.execute_task_control(TaskControlCommand::Step, None),
        )
        .await
        .unwrap();
        now += Duration::from_millis(MOTION_CYCLE_MS);
        step_pair(&mut mk, &mut tm, now).await;
        assert!(tm.state_machine.digital_out[0]);
        assert_eq!(tm.interpreter.state(), InterpreterState::Paused);

        drive_with_motion(
            &mut mk,
            now,
            tm.execute_task_control(TaskControlCommand::Step, None),
        )
        .await
        .unwrap();
        now += Duration::from_millis(MOTION_CYCLE_MS);
        step_pair(&mut mk, &mut tm, now).await;
        assert!(!tm.state_machine.digital_out[1]);
        assert_eq!(tm.interpreter.state(), InterpreterState::Paused);

        drive_with_motion(
            &mut mk,
            now,
            tm.execute_task_control(TaskControlCommand::Step, None),
        )
        .await
        .unwrap();
        now += Duration::from_millis(MOTION_CYCLE_MS);
        step_pair(&mut mk, &mut tm, now).await;
        assert_eq!(tm.interpreter.state(), InterpreterState::Paused);

        drive_with_motion(
            &mut mk,
            now,
            tm.execute_task_control(TaskControlCommand::Step, None),
        )
        .await
        .unwrap();
        now += Duration::from_millis(MOTION_CYCLE_MS);
        step_pair(&mut mk, &mut tm, now).await;
        assert!(tm.state_machine.digital_out[1]);
        assert_eq!(tm.interpreter.state(), InterpreterState::Completed);
    }

    #[tokio::test]
    async fn test_log_does_not_overwrite_error_status() {
        let (mut mk, _mkc, mut tm, _th) = setup_pair().await;
        let mut now = Instant::now();

        mk.transport
            .push_tx_pdo(make_test_tx(1, 0, Joints6D::home().values));
        step_pair(&mut mk, &mut tm, now).await;
        drive_with_motion(&mut mk, now, tm.set_drives_power(true))
            .await
            .unwrap();

        let script = r#"
            Log("Normal Step 1");
            let divisor = 0;
            let broken = 10 / divisor;
            Log("Should not appear");
        "#;
        drive_with_motion(&mut mk, now, tm.load_program_source("test_err.rhai", script))
            .await
            .unwrap();
        drive_with_motion(
            &mut mk,
            now,
            tm.execute_task_control(TaskControlCommand::Run, None),
        )
        .await
        .unwrap();

        now += Duration::from_millis(MOTION_CYCLE_MS);
        step_pair(&mut mk, &mut tm, now).await;

        assert_eq!(tm.interpreter.state(), InterpreterState::Error);
        assert!(tm.state_machine.status_message.contains("运行时错误"));
    }

    #[tokio::test]
    async fn test_jog_forbidden_when_paused() {
        let (mut mk, _mkc, mut tm, _th) = setup_pair().await;
        let mut now = Instant::now();

        mk.transport
            .push_tx_pdo(make_test_tx(1, 0, Joints6D::home().values));
        step_pair(&mut mk, &mut tm, now).await;
        drive_with_motion(&mut mk, now, tm.set_drives_power(true))
            .await
            .unwrap();

        drive_with_motion(
            &mut mk,
            now,
            tm.load_program_source("pause_jog.rhai", "Wait(10.0);"),
        )
        .await
        .unwrap();
        drive_with_motion(
            &mut mk,
            now,
            tm.execute_task_control(TaskControlCommand::Run, None),
        )
        .await
        .unwrap();

        now += Duration::from_millis(MOTION_CYCLE_MS);
        step_pair(&mut mk, &mut tm, now).await;

        drive_with_motion(
            &mut mk,
            now,
            tm.execute_task_control(TaskControlCommand::Pause, None),
        )
        .await
        .unwrap();
        assert_eq!(tm.interpreter.state(), InterpreterState::Paused);

        let jog_cmd = JogCommand {
            coord_system: CoordSystem::Cartesian,
            axis: "X".to_string(),
            direction: 1.0,
            step_size: 5.0,
        };

        let res_step = drive_with_motion(&mut mk, now, tm.execute_jog_step(jog_cmd.clone())).await;
        assert!(res_step.is_err());
        assert!(res_step
            .unwrap_err()
            .contains("程序运行或暂停中，请先 RESET 再手动点动"));

        let res_hold = drive_with_motion(&mut mk, now, tm.execute_jog_hold(jog_cmd)).await;
        assert!(res_hold.is_err());
        assert!(res_hold
            .unwrap_err()
            .contains("程序运行或暂停中，请先 RESET 再手动点动"));
    }

    #[tokio::test]
    async fn test_hard_trip_mid_motion_requires_reset_no_skip() {
        let (mut mk, _mkc, mut tm, _th) = setup_pair().await;
        let mut now = Instant::now();

        mk.transport
            .push_tx_pdo(make_test_tx(1, 0, Joints6D::home().values));
        step_pair(&mut mk, &mut tm, now).await;
        drive_with_motion(&mut mk, now, tm.set_mode(OpMode::Auto)).await;
        drive_with_motion(&mut mk, now, tm.set_drives_power(true))
            .await
            .unwrap();

        let script = r#"
            DO(1, true);
            MoveL(Pose(-220, 420, 340, 0, 0, 180), #{ vel: 100 });
            DO(2, true);
            MoveL(Pose(-220, 560, 340, 0, 0, 180), #{ vel: 100 });
        "#;
        drive_with_motion(&mut mk, now, tm.load_program_source("trip_test.rhai", script))
            .await
            .unwrap();
        drive_with_motion(
            &mut mk,
            now,
            tm.execute_task_control(TaskControlCommand::Run, None),
        )
        .await
        .unwrap();

        for _ in 0..5 {
            now += Duration::from_millis(MOTION_CYCLE_MS);
            let rx = mk.transport.last_sent_rx().cloned().unwrap();
            mk.transport
                .push_tx_pdo(make_test_tx(mk.sim_tick + 1, rx.seq, rx.q_cmd_deg));
            step_pair(&mut mk, &mut tm, now).await;
        }

        assert!(tm.state_machine.digital_out[0]);
        assert!(!tm.state_machine.digital_out[1]);
        assert!(mk.planner.is_busy());
        assert_eq!(tm.interpreter.state(), InterpreterState::Running);

        drive_with_motion(&mut mk, now, tm.set_emergency_stop(true)).await;
        now += Duration::from_millis(MOTION_CYCLE_MS);
        step_pair(&mut mk, &mut tm, now).await;

        assert_eq!(tm.interpreter.state(), InterpreterState::Error);
        assert!(!mk.planner.is_busy());
        assert!(tm
            .state_machine
            .status_message
            .contains("在途轨迹中断，请 RESET 重置程序"));

        drive_with_motion(&mut mk, now, tm.set_emergency_stop(false)).await;
        drive_with_motion(&mut mk, now, tm.set_drives_power(true))
            .await
            .unwrap();
        assert!(tm.state_machine.can_move());
        assert_eq!(tm.interpreter.state(), InterpreterState::Error);

        let run_res = drive_with_motion(
            &mut mk,
            now,
            tm.execute_task_control(TaskControlCommand::Run, None),
        )
        .await;
        assert!(run_res.is_err());
        assert!(!tm.state_machine.digital_out[1]);

        let step_res = drive_with_motion(
            &mut mk,
            now,
            tm.execute_task_control(TaskControlCommand::Step, None),
        )
        .await;
        assert!(step_res.is_err());

        drive_with_motion(
            &mut mk,
            now,
            tm.execute_task_control(TaskControlCommand::Reset, None),
        )
        .await
        .unwrap();
        assert_eq!(tm.interpreter.state(), InterpreterState::Ready);
        assert_eq!(tm.state_machine.status_message, "程序已重置");

        drive_with_motion(
            &mut mk,
            now,
            tm.execute_task_control(TaskControlCommand::Run, None),
        )
        .await
        .unwrap();
        assert_eq!(tm.interpreter.state(), InterpreterState::Running);

        for _ in 0..5 {
            now += Duration::from_millis(MOTION_CYCLE_MS);
            let rx = mk.transport.last_sent_rx().cloned().unwrap();
            mk.transport
                .push_tx_pdo(make_test_tx(mk.sim_tick + 1, rx.seq, rx.q_cmd_deg));
            step_pair(&mut mk, &mut tm, now).await;
        }
        assert!(mk.planner.is_busy());

        now += Duration::from_millis(200);
        step_pair(&mut mk, &mut tm, now).await;

        assert!(!tm.state_machine.plant_online);
        assert!(!tm.state_machine.drives_on);
        assert_eq!(tm.interpreter.state(), InterpreterState::Error);
        assert!(tm
            .state_machine
            .status_message
            .contains("在途轨迹中断，请 RESET 重置程序"));
    }

    #[tokio::test]
    async fn test_plant_stat_fault_trips_drives_and_resets_via_ctrl_pulse() {
        use bass_logger::{LogCategory, LogLevel, LogQuery};

        let (mut mk, _mkc, mut tm, _th) = setup_pair().await;
        let mut now = Instant::now();

        mk.transport
            .push_tx_pdo(make_test_tx(1, 0, Joints6D::home().values));
        step_pair(&mut mk, &mut tm, now).await;
        drive_with_motion(&mut mk, now, tm.set_mode(OpMode::Auto)).await;
        drive_with_motion(&mut mk, now, tm.set_drives_power(true))
            .await
            .unwrap();

        let script = r#"
            MoveL(Pose(-220, 420, 340, 0, 0, 180), #{ vel: 100 });
        "#;
        drive_with_motion(&mut mk, now, tm.load_program_source("fault_test.rhai", script))
            .await
            .unwrap();
        drive_with_motion(
            &mut mk,
            now,
            tm.execute_task_control(TaskControlCommand::Run, None),
        )
        .await
        .unwrap();

        for _ in 0..4 {
            now += Duration::from_millis(MOTION_CYCLE_MS);
            let rx = mk.transport.last_sent_rx().cloned().unwrap();
            mk.transport
                .push_tx_pdo(make_test_tx(mk.sim_tick + 1, rx.seq, rx.q_cmd_deg));
            step_pair(&mut mk, &mut tm, now).await;
        }
        assert!(mk.planner.is_busy());

        now += Duration::from_millis(MOTION_CYCLE_MS);
        let mut fault_tx = make_test_tx(mk.sim_tick + 1, mk.seq, mk.q_cmd.values);
        fault_tx.status_word = STAT_PLANT_READY | STAT_FAULT;
        fault_tx.fault_code = 0xDEAD_0001;
        mk.transport.push_tx_pdo(fault_tx);
        step_pair(&mut mk, &mut tm, now).await;

        assert!(!tm.state_machine.drives_on);
        assert!(mk.plant_fault_active);
        assert_eq!(mk.last_fault_code, 0xDEAD_0001);
        assert_eq!(tm.interpreter.state(), InterpreterState::Error);

        let (entries, _) = tm.logger.query(&LogQuery {
            level: Some(LogLevel::Error),
            category: Some(LogCategory::Safety),
            ..Default::default()
        });
        assert!(entries.iter().any(|e| e.message.contains("0xDEAD0001")));

        let power_err = drive_with_motion(&mut mk, now, tm.set_drives_power(true)).await;
        assert!(power_err.is_err());
        now += Duration::from_millis(MOTION_CYCLE_MS);
        step_pair(&mut mk, &mut tm, now).await;
        let rx_after = mk.transport.last_sent_rx().unwrap();
        assert_ne!(rx_after.control_word & CTRL_FAULT_RESET, 0);

        now += Duration::from_millis(MOTION_CYCLE_MS);
        let mut clear_tx = make_test_tx(mk.sim_tick + 1, rx_after.seq, mk.q_act.values);
        clear_tx.status_word = STAT_PLANT_READY;
        clear_tx.fault_code = 0;
        mk.transport.push_tx_pdo(clear_tx);
        step_pair(&mut mk, &mut tm, now).await;

        assert!(!mk.plant_fault_active);
        drive_with_motion(
            &mut mk,
            now,
            tm.execute_task_control(TaskControlCommand::Reset, None),
        )
        .await
        .unwrap();
        drive_with_motion(&mut mk, now, tm.set_drives_power(true))
            .await
            .unwrap();
        assert!(tm.state_machine.drives_on);
    }
}
