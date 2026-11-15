use crate::api::{
    MotionEvent, MotionKernelClient, MotionKernelCommand, MotionTelemetry, MOTION_CYCLE_DT_S,
    MOTION_CYCLE_MS, MOTION_CYCLE_NS,
};
use bass_hal::{FieldbusTransport, UdpFieldbusDriver};
use bass_logger::{LogCategory, LogManager};
use bass_motion::kinematics::KinematicsEngine;
use bass_motion::planner::{LinearTrapezoidPlanner, MotionPlanner};
use bass_motion::Serial6DofKinematics;
use bass_types::{
    JogCommand, Joints6D, MotionState, MotionTarget, Pose6D, RxPdo, CTRL_ENABLE, CTRL_ESTOP_OK,
    CTRL_FAULT_RESET, STAT_FAULT,
};
use std::collections::VecDeque;
use std::thread::JoinHandle;
use std::time::{Duration, Instant};
use tokio::sync::{broadcast, mpsc, watch};

/// 独立运动内核：负责 2ms 确定性实时周期、轨迹规划与插补、底层硬件安全联锁以及 UDP 现场总线闭环
pub struct MotionKernel<T: FieldbusTransport> {
    pub planner: Box<dyn MotionPlanner>,
    pub kinematics: Serial6DofKinematics,
    pub transport: T,
    pub logger: LogManager,

    pub drives_enabled: bool,
    pub estop_active: bool,
    pub speed_override: u8,
    pub digital_out: [bool; 8],
    pub paused: bool,

    pub q_cmd: Joints6D,
    pub q_act: Joints6D,
    pub qd_act: [f64; 6],
    pub tau_act: [f64; 6],
    pub sim_tick: u64,
    pub digital_in: u32,
    pub cycle_count: u64,
    pub seq: u64,

    pub plant_online: bool,
    pub received_first_tx: bool,
    pub last_tx_time: Option<Instant>,
    pub rtt_ms: f64,
    recent_rx_sent: VecDeque<(u64, Instant)>,

    pub hold_jog_active: bool,
    pub last_jog_hold_at: Option<Instant>,
    pub active_jog_cmd: Option<JogCommand>,

    pub plant_fault_active: bool,
    pub last_fault_code: u32,
    pub fault_reset_pulses: u8,

    next_motion_id: u64,
    active_motion_id: Option<u64>,
    active_is_jog: bool,

    cmd_rx: Option<mpsc::UnboundedReceiver<MotionKernelCommand>>,
    telemetry_tx: watch::Sender<MotionTelemetry>,
    event_tx: broadcast::Sender<MotionEvent>,
}

impl<T: FieldbusTransport> MotionKernel<T> {
    pub fn new(
        kinematics: Serial6DofKinematics,
        transport: T,
        logger: LogManager,
    ) -> (Self, MotionKernelClient) {
        let initial_q = kinematics.home_joints();
        let initial_cart = kinematics.forward_kinematics(&initial_q);
        let planner = Box::new(LinearTrapezoidPlanner::new(kinematics.clone()));

        let initial_telemetry = MotionTelemetry {
            drives_enabled: false,
            estop_active: false,
            speed_override: 100,
            motion_state: planner.motion_state(),
            paused: false,
            active_motion_id: None,
            joint_actual: initial_q.values,
            joint_cmd: initial_q.values,
            joint_velocity: [0.0; 6],
            joint_torque: [0.0; 6],
            cart_actual: initial_cart,
            digital_out: [false; 8],
            digital_in: 0,
            plant_online: false,
            plant_fault_active: false,
            last_fault_code: 0,
            rtt_ms: 0.0,
            cycle_count: 0,
            sim_tick: 0,
        };

        let (cmd_tx, cmd_rx) = mpsc::unbounded_channel();
        let (telemetry_tx, telemetry_rx) = watch::channel(initial_telemetry);
        let (event_tx, _) = broadcast::channel(256);

        let client = MotionKernelClient::new(cmd_tx, telemetry_rx, event_tx.clone());

        let kernel = Self {
            planner,
            kinematics,
            transport,
            logger: logger.clone(),
            drives_enabled: false,
            estop_active: false,
            speed_override: 100,
            digital_out: [false; 8],
            paused: false,
            q_cmd: initial_q,
            q_act: initial_q,
            qd_act: [0.0; 6],
            tau_act: [0.0; 6],
            sim_tick: 0,
            digital_in: 0,
            cycle_count: 0,
            seq: 0,
            plant_online: false,
            received_first_tx: false,
            last_tx_time: None,
            rtt_ms: 0.0,
            recent_rx_sent: VecDeque::with_capacity(512),
            hold_jog_active: false,
            last_jog_hold_at: None,
            active_jog_cmd: None,
            plant_fault_active: false,
            last_fault_code: 0,
            fault_reset_pulses: 0,
            next_motion_id: 1,
            active_motion_id: None,
            active_is_jog: false,
            cmd_rx: Some(cmd_rx),
            telemetry_tx,
            event_tx,
        };

        logger.info(
            LogCategory::Motion,
            "motion-kernel",
            "独立运动内核已初始化 (2ms 实时闭环 API)",
        );

        (kernel, client)
    }

    #[inline]
    pub fn can_move(&self) -> bool {
        self.drives_enabled && !self.estop_active && self.plant_online
    }

    pub fn current_telemetry(&self) -> MotionTelemetry {
        let cart_actual = self.kinematics.forward_kinematics(&self.q_act);
        MotionTelemetry {
            drives_enabled: self.drives_enabled,
            estop_active: self.estop_active,
            speed_override: self.speed_override,
            motion_state: self.planner.motion_state(),
            paused: self.paused,
            active_motion_id: self.active_motion_id,
            joint_actual: self.q_act.values,
            joint_cmd: self.q_cmd.values,
            joint_velocity: self.qd_act,
            joint_torque: self.tau_act,
            cart_actual,
            digital_out: self.digital_out,
            digital_in: self.digital_in,
            plant_online: self.plant_online,
            plant_fault_active: self.plant_fault_active,
            last_fault_code: self.last_fault_code,
            rtt_ms: self.rtt_ms,
            cycle_count: self.cycle_count,
            sim_tick: self.sim_tick,
        }
    }

    fn alloc_motion_id(&mut self) -> u64 {
        let id = self.next_motion_id;
        self.next_motion_id += 1;
        id
    }

    fn stop_active_motion_internal(&mut self) {
        self.planner.stop();
        self.hold_jog_active = false;
        self.last_jog_hold_at = None;
        self.active_jog_cmd = None;
        self.active_motion_id = None;
        self.active_is_jog = false;
        self.paused = false;
    }

    fn trigger_safety_trip(&mut self, reason: String, fault_code: u32) {
        let was_moving = self.active_motion_id.is_some() && !self.active_is_jog;
        self.drives_enabled = false;
        self.stop_active_motion_internal();
        if self.received_first_tx {
            self.q_cmd = self.q_act;
        }
        let _ = self.event_tx.send(MotionEvent::SafetyTripped {
            reason,
            fault_code,
            was_moving,
        });
    }

    fn handle_set_drives_power(&mut self, enable: bool) -> Result<bool, String> {
        if enable {
            if self.plant_fault_active {
                self.fault_reset_pulses = self.fault_reset_pulses.max(5);
                let msg = format!(
                    "物理端存在未清除故障 (0x{:08X})，已发送 CTRL_FAULT_RESET 复位脉冲，请确认清除后再上电",
                    self.last_fault_code
                );
                self.logger.warn(LogCategory::Safety, "motion-kernel", &msg);
                return Err(msg);
            }
            if self.estop_active {
                return Err("处于急停状态，请先复位 E-STOP 后再使能伺服".to_string());
            }
            if !self.plant_online {
                return Err("物理仿真端离线，无法使能伺服".to_string());
            }
            self.drives_enabled = true;
            self.logger
                .info(LogCategory::Safety, "motion-kernel", "伺服驱动已使能 (DRIVES ON)");
        } else if self.drives_enabled {
            self.drives_enabled = false;
            self.stop_active_motion_internal();
            if self.received_first_tx {
                self.q_cmd = self.q_act;
            }
            self.logger
                .info(LogCategory::Safety, "motion-kernel", "伺服已下电");
        } else {
            self.drives_enabled = false;
        }
        Ok(self.drives_enabled)
    }

    fn handle_set_estop(&mut self, active: bool) -> Result<bool, String> {
        self.estop_active = active;
        if active {
            self.trigger_safety_trip("急停已触发".to_string(), 0);
        } else {
            self.fault_reset_pulses = self.fault_reset_pulses.max(5);
            self.logger.info(
                LogCategory::Safety,
                "motion-kernel",
                "急停已复位，已发送故障复位脉冲 (CTRL_FAULT_RESET)",
            );
        }
        Ok(self.estop_active)
    }

    fn handle_move_l(&mut self, target: Pose6D, vel_mm_s: f64) -> Result<u64, String> {
        if !self.can_move() {
            return Err("无法执行 MoveL: 伺服未使能、处于急停或物理端离线".to_string());
        }
        self.hold_jog_active = false;
        self.active_jog_cmd = None;
        self.paused = false;
        self.planner
            .plan_movel(&self.q_cmd, &target, vel_mm_s)
            .map_err(|e| format!("轨迹规划错误: {}", e))?;
        let mid = self.alloc_motion_id();
        self.active_motion_id = Some(mid);
        self.active_is_jog = false;
        Ok(mid)
    }

    fn handle_move_j(&mut self, target: MotionTarget, vel_deg_s: f64) -> Result<u64, String> {
        if !self.can_move() {
            return Err("无法执行 MoveJ: 伺服未使能、处于急停或物理端离线".to_string());
        }
        self.hold_jog_active = false;
        self.active_jog_cmd = None;
        self.paused = false;
        self.planner
            .plan_movej(&self.q_cmd, target, vel_deg_s)
            .map_err(|e| format!("轨迹规划错误: {}", e))?;
        let mid = self.alloc_motion_id();
        self.active_motion_id = Some(mid);
        self.active_is_jog = false;
        Ok(mid)
    }

    fn handle_jog_step(&mut self, cmd: JogCommand) -> Result<u64, String> {
        if !self.can_move() {
            return Err("无法点动: 伺服未使能、处于急停或物理端离线".to_string());
        }
        if self.active_motion_id.is_some() && !self.active_is_jog {
            return Err("自动运动轨迹尚在执行中，禁止点动".to_string());
        }
        self.hold_jog_active = false;
        self.active_jog_cmd = None;
        self.paused = false;
        self.planner
            .start_jog(&self.q_cmd, &cmd)
            .map_err(|e| format!("点动规划失败: {}", e))?;
        let mid = self.alloc_motion_id();
        self.active_motion_id = Some(mid);
        self.active_is_jog = true;
        Ok(mid)
    }

    fn handle_jog_hold(&mut self, cmd: JogCommand, now: Instant) -> Result<(), String> {
        if !self.can_move() {
            return Err("无法点动: 伺服未使能、处于急停或物理端离线".to_string());
        }
        if self.active_motion_id.is_some() && !self.active_is_jog {
            return Err("自动运动轨迹尚在执行中，禁止点动".to_string());
        }
        self.last_jog_hold_at = Some(now);
        self.hold_jog_active = true;
        self.active_jog_cmd = Some(cmd.clone());
        self.paused = false;
        if !self.planner.is_busy() {
            self.planner
                .start_jog(&self.q_cmd, &cmd)
                .map_err(|e| format!("点动规划失败: {}", e))?;
            let mid = self.alloc_motion_id();
            self.active_motion_id = Some(mid);
            self.active_is_jog = true;
        }
        Ok(())
    }

    /// 执行单次 2ms 确定性实时运动控制周期
    pub fn step_once(&mut self, now: Instant) {
        // 1. 接收现场总线最新 TxPdo，更新物理在线状态与故障检测
        let prev_online_before_poll = self.plant_online;
        if let Ok(Some(tx)) = self.transport.poll_tx_pdo() {
            self.received_first_tx = true;
            self.last_tx_time = Some(now);
            self.plant_online = true;
            if !prev_online_before_poll {
                self.logger.info(
                    LogCategory::Fieldbus,
                    "fieldbus",
                    format!("仿真物理端已连接 (sim_tick={})", tx.sim_tick),
                );
                let _ = self.event_tx.send(MotionEvent::PlantOnlineChanged {
                    online: true,
                    sim_tick: tx.sim_tick,
                });
            }

            self.q_act = Joints6D {
                values: tx.q_act_deg,
            };
            self.qd_act = tx.qd_act_deg_s;
            self.tau_act = tx.tau_act_nm;
            self.sim_tick = tx.sim_tick;
            self.digital_in = tx.digital_in;

            let has_fault = (tx.status_word & STAT_FAULT) != 0 || tx.fault_code != 0;
            if has_fault {
                let is_new_fault =
                    !self.plant_fault_active || tx.fault_code != self.last_fault_code;
                self.plant_fault_active = true;
                self.last_fault_code = tx.fault_code;
                if is_new_fault {
                    let msg = format!(
                        "物理端/驱动故障触发 (fault_code=0x{:08X}, status=0x{:04X})",
                        tx.fault_code, tx.status_word
                    );
                    self.logger.error(LogCategory::Safety, "fieldbus", &msg);
                    self.trigger_safety_trip(msg, tx.fault_code);
                } else {
                    self.drives_enabled = false;
                }
            } else if self.plant_fault_active {
                self.plant_fault_active = false;
                self.last_fault_code = 0;
                self.logger.info(
                    LogCategory::Safety,
                    "fieldbus",
                    "物理端/驱动故障状态已清除",
                );
                let _ = self.event_tx.send(MotionEvent::FaultCleared);
            }

            if tx.echo_seq > 0 {
                if let Some(pos) = self
                    .recent_rx_sent
                    .iter()
                    .position(|(s, _)| *s == tx.echo_seq)
                {
                    let (_, sent_time) = self.recent_rx_sent[pos];
                    self.rtt_ms = (now - sent_time).as_secs_f64() * 1000.0;
                    self.recent_rx_sent.drain(..=pos);
                }
            }
        }

        let prev_online = self.plant_online;
        if let Some(last_tx) = self.last_tx_time {
            if now.duration_since(last_tx) > Duration::from_millis(150) {
                self.plant_online = false;
            }
        } else {
            self.plant_online = false;
        }

        if prev_online && !self.plant_online {
            let _ = self.event_tx.send(MotionEvent::PlantOnlineChanged {
                online: false,
                sim_tick: self.sim_tick,
            });
            self.trigger_safety_trip("仿真物理端通信超时，驱动已安全断开".to_string(), 0);
        }

        // 2. 消费控制器管理系统发来的异步 MotionKernelCommand
        const MAX_CMDS_PER_CYCLE: usize = 32;
        if let Some(mut rx) = self.cmd_rx.take() {
            let mut processed = 0;
            while processed < MAX_CMDS_PER_CYCLE {
                match rx.try_recv() {
                    Ok(cmd) => {
                        processed += 1;
                        match cmd {
                            MotionKernelCommand::SetDrivesPower { enable, resp } => {
                                let res = self.handle_set_drives_power(enable);
                                let _ = resp.send(res);
                            }
                            MotionKernelCommand::SetEmergencyStop { active, resp } => {
                                let res = self.handle_set_estop(active);
                                let _ = resp.send(res);
                            }
                            MotionKernelCommand::SetSpeedOverride { value, resp } => {
                                self.speed_override = value.clamp(5, 100);
                                let _ = resp.send(self.speed_override);
                            }
                            MotionKernelCommand::SetDigitalOut { pin, value, resp } => {
                                if (1..=8).contains(&pin) {
                                    self.digital_out[pin - 1] = value;
                                    let _ = resp.send(Ok(self.digital_out));
                                } else {
                                    let _ = resp.send(Err("DOUT 引脚号必须在 1..=8 范围内".to_string()));
                                }
                            }
                            MotionKernelCommand::ClearFault { resp } => {
                                self.fault_reset_pulses = self.fault_reset_pulses.max(5);
                                let _ = resp.send(());
                            }
                            MotionKernelCommand::MoveL {
                                target,
                                vel_mm_s,
                                resp,
                            } => {
                                let res = self.handle_move_l(target, vel_mm_s);
                                let _ = resp.send(res);
                            }
                            MotionKernelCommand::MoveJ {
                                target,
                                vel_deg_s,
                                resp,
                            } => {
                                let res = self.handle_move_j(target, vel_deg_s);
                                let _ = resp.send(res);
                            }
                            MotionKernelCommand::JogStep { cmd, resp } => {
                                let res = self.handle_jog_step(cmd);
                                let _ = resp.send(res);
                            }
                            MotionKernelCommand::JogHold { cmd, resp } => {
                                let res = self.handle_jog_hold(cmd, now);
                                let _ = resp.send(res);
                            }
                            MotionKernelCommand::JogStop { resp } => {
                                if self.hold_jog_active || self.active_is_jog {
                                    self.stop_active_motion_internal();
                                }
                                let _ = resp.send(());
                            }
                            MotionKernelCommand::SetMotionPaused { paused, resp } => {
                                self.paused = paused;
                                let _ = resp.send(());
                            }
                            MotionKernelCommand::StopMotion { resp } => {
                                self.stop_active_motion_internal();
                                let _ = resp.send(());
                            }
                        }
                    }
                    Err(_) => break,
                }
            }
            self.cmd_rx = Some(rx);
        }

        // 3. 无扰上电跟踪与未使能拦截
        if !self.can_move() {
            if self.received_first_tx {
                self.q_cmd = self.q_act;
            }
            if self.planner.is_busy() || self.hold_jog_active {
                self.stop_active_motion_internal();
            }
        }

        // 4. Hold-to-Jog 150ms 心跳看门狗
        if self.hold_jog_active {
            if let Some(last_hold) = self.last_jog_hold_at {
                if now.duration_since(last_hold) > Duration::from_millis(150) {
                    self.stop_active_motion_internal();
                }
            }
        }

        // 5. 推进插补器（点动或非暂停程序轨迹）
        if self.can_move() && self.planner.is_busy() {
            let is_jog = self.active_is_jog
                || self.hold_jog_active
                || self.planner.motion_state() == MotionState::Jog;

            if is_jog || !self.paused {
                match self
                    .planner
                    .step(MOTION_CYCLE_DT_S, self.speed_override, &self.q_cmd)
                {
                    Ok(out) => {
                        self.q_cmd = out.q_cmd;
                        if out.done {
                            if self.hold_jog_active {
                                if let Some(ref cmd) = self.active_jog_cmd.clone() {
                                    let _ = self.planner.start_jog(&self.q_cmd, cmd);
                                }
                            } else {
                                let finished_id = self.active_motion_id.take();
                                let was_jog = self.active_is_jog;
                                self.active_is_jog = false;
                                if !was_jog {
                                    if let Some(mid) = finished_id {
                                        let _ = self
                                            .event_tx
                                            .send(MotionEvent::MotionCompleted { motion_id: mid });
                                    }
                                }
                            }
                        }
                    }
                    Err(e) => {
                        let msg = format!("运动规划错误: {}", e);
                        let failed_id = self.active_motion_id.take();
                        self.stop_active_motion_internal();
                        self.logger.error(LogCategory::Motion, "motion-kernel", &msg);
                        if let Some(mid) = failed_id {
                            let _ = self.event_tx.send(MotionEvent::MotionFailed {
                                motion_id: mid,
                                error: msg,
                            });
                        }
                    }
                }
            }
        }

        // 6. 下发 RxPdo 并广播遥测快照
        let mut control_word = 0u16;
        if self.drives_enabled && !self.estop_active {
            control_word |= CTRL_ENABLE;
        }
        if !self.estop_active {
            control_word |= CTRL_ESTOP_OK;
        }
        if self.fault_reset_pulses > 0 {
            control_word |= CTRL_FAULT_RESET;
            self.fault_reset_pulses -= 1;
        }

        self.seq += 1;
        self.recent_rx_sent.push_back((self.seq, now));
        if self.recent_rx_sent.len() > 500 {
            self.recent_rx_sent.pop_front();
        }

        let mut digital_out_mask = 0u32;
        for (i, &bit) in self.digital_out.iter().enumerate() {
            if bit {
                digital_out_mask |= 1 << i;
            }
        }

        let rx = RxPdo {
            control_word,
            seq: self.seq,
            timestamp_ns: self.cycle_count * MOTION_CYCLE_NS,
            q_cmd_deg: self.q_cmd.values,
            digital_out: digital_out_mask,
        };
        let _ = self.transport.send_rx_pdo(&rx);

        let _ = self.telemetry_tx.send(self.current_telemetry());
        self.cycle_count += 1;
    }
}

/// 打开基于定长二进制 UDP 现场总线的运动内核实例并返回控制句柄
pub fn open_udp_motion_kernel(
    kinematics: Serial6DofKinematics,
    udp_bind: &str,
    udp_remote: &str,
    logger: LogManager,
) -> Result<(MotionKernel<UdpFieldbusDriver>, MotionKernelClient), String> {
    let transport = UdpFieldbusDriver::open(udp_bind, udp_remote)
        .map_err(|e| format!("打开 UDP 驱动失败: {}", e))?;
    Ok(MotionKernel::new(kinematics, transport, logger))
}

#[cfg(target_os = "windows")]
struct HighResWaitTimer(*mut std::ffi::c_void);

#[cfg(target_os = "windows")]
impl HighResWaitTimer {
    fn new() -> Option<Self> {
        const CREATE_WAITABLE_TIMER_HIGH_RESOLUTION: u32 = 0x0000_0002;
        const TIMER_ALL_ACCESS: u32 = 0x001F_0003;
        #[link(name = "kernel32")]
        extern "system" {
            fn CreateWaitableTimerExW(
                lp_timer_attributes: *const std::ffi::c_void,
                lp_timer_name: *const u16,
                dw_flags: u32,
                dw_desired_access: u32,
            ) -> *mut std::ffi::c_void;
        }
        let handle = unsafe {
            CreateWaitableTimerExW(
                std::ptr::null(),
                std::ptr::null(),
                CREATE_WAITABLE_TIMER_HIGH_RESOLUTION,
                TIMER_ALL_ACCESS,
            )
        };
        if handle.is_null() {
            None
        } else {
            Some(Self(handle))
        }
    }

    fn wait_for(&self, dur: Duration) -> bool {
        #[link(name = "kernel32")]
        extern "system" {
            fn SetWaitableTimer(
                h_timer: *mut std::ffi::c_void,
                lp_due_time: *const i64,
                l_period: i32,
                pfn_completion_routine: *const std::ffi::c_void,
                lp_arg_to_completion_routine: *const std::ffi::c_void,
                f_resume: i32,
            ) -> i32;
            fn WaitForSingleObject(h_handle: *mut std::ffi::c_void, dw_milliseconds: u32) -> u32;
        }
        const INFINITE: u32 = 0xFFFF_FFFF;
        // 负值表示相对时间，单位为 100ns
        let hundred_ns = -((dur.as_nanos() / 100).clamp(1, i64::MAX as u128) as i64);
        unsafe {
            SetWaitableTimer(self.0, &hundred_ns, 0, std::ptr::null(), std::ptr::null(), 0) != 0
                && WaitForSingleObject(self.0, INFINITE) == 0
        }
    }
}

#[cfg(target_os = "windows")]
impl Drop for HighResWaitTimer {
    fn drop(&mut self) {
        #[link(name = "kernel32")]
        extern "system" {
            fn CloseHandle(h_object: *mut std::ffi::c_void) -> i32;
        }
        if !self.0.is_null() {
            unsafe {
                CloseHandle(self.0);
            }
        }
    }
}

fn maybe_warn_overrun(
    logger: &LogManager,
    last_warn: &mut Option<Instant>,
    now: Instant,
    message: impl FnOnce() -> String,
) {
    let should_warn = last_warn
        .map(|t| now.duration_since(t) >= Duration::from_secs(5))
        .unwrap_or(true);
    if should_warn {
        logger.warn(LogCategory::Motion, "motion-2ms", message());
        *last_warn = Some(now);
    }
}

/// 在专用 OS 线程中启动 2ms 确定性实时运动内核闭环（高精度定时器混合睡眠 + 自旋 + 超时日志告警）
pub fn spawn_realtime_loop<T: FieldbusTransport + 'static>(
    mut kernel: MotionKernel<T>,
    logger: LogManager,
) -> Result<JoinHandle<()>, String> {
    std::thread::Builder::new()
        .name("bass-motion-2ms".to_string())
        .spawn(move || {
            tracing::info!("⚡ 独立运动内核 2ms 确定性控制循环已启动 (500Hz)");
            let target_dt = Duration::from_millis(MOTION_CYCLE_MS);
            let spin_guard = Duration::from_micros(1000);
            let overrun_threshold = Duration::from_millis(MOTION_CYCLE_MS * 2);
            #[cfg(target_os = "windows")]
            let wait_timer = HighResWaitTimer::new();
            let mut next_tick = Instant::now();
            let mut last_overrun_warn: Option<Instant> = None;

            loop {
                let now = Instant::now();
                kernel.step_once(now);

                let work_elapsed = now.elapsed();
                if work_elapsed > overrun_threshold {
                    maybe_warn_overrun(&logger, &mut last_overrun_warn, now, || {
                        format!(
                            "2ms 运动周期执行超时 ({:.2}ms > {:.2}ms)",
                            work_elapsed.as_secs_f64() * 1000.0,
                            overrun_threshold.as_secs_f64() * 1000.0
                        )
                    });
                }

                next_tick += target_dt;
                let now_after = Instant::now();
                if next_tick > now_after {
                    let remaining = next_tick - now_after;
                    if remaining > spin_guard {
                        let sleep_dur = remaining - spin_guard;
                        #[cfg(target_os = "windows")]
                        let waited = wait_timer
                            .as_ref()
                            .map(|t| t.wait_for(sleep_dur))
                            .unwrap_or(false);
                        #[cfg(not(target_os = "windows"))]
                        let waited = false;
                        if !waited {
                            std::thread::sleep(sleep_dur);
                        }
                    }
                    while Instant::now() < next_tick {
                        std::hint::spin_loop();
                    }
                } else {
                    if now_after.duration_since(next_tick) > overrun_threshold {
                        maybe_warn_overrun(&logger, &mut last_overrun_warn, now_after, || {
                            format!(
                                "2ms 运动周期调度滞后 ({:.2}ms)",
                                (now_after.duration_since(next_tick) + target_dt)
                                    .as_secs_f64()
                                    * 1000.0
                            )
                        });
                    }
                    if next_tick + target_dt < now_after {
                        next_tick = now_after;
                    }
                }
            }
        })
        .map_err(|e| format!("启动运动内核线程失败: {}", e))
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::api::MotionKernelApi;
    use bass_hal::MockFieldbusTransport;
    use bass_types::{CoordSystem, TxPdo, STAT_DRIVES_ENABLED, STAT_PLANT_READY};
    use std::path::Path;

    fn test_kinematics() -> Serial6DofKinematics {
        let path = Path::new(env!("CARGO_MANIFEST_DIR"))
            .join("../../../../runtime/instances/default_cell/config/robot_model.json");
        Serial6DofKinematics::from_json_file(path).expect("加载 robot_model.json 失败")
    }

    fn push_tx(kernel: &mut MotionKernel<MockFieldbusTransport>, sim_tick: u64, echo_seq: u64, q: [f64; 6]) {
        kernel.transport.push_tx_pdo(TxPdo {
            status_word: STAT_PLANT_READY | STAT_DRIVES_ENABLED,
            echo_seq,
            sim_tick,
            q_act_deg: q,
            qd_act_deg_s: [0.0; 6],
            tau_act_nm: [0.0; 6],
            digital_in: 0,
            fault_code: 0,
        });
    }

    #[tokio::test]
    async fn test_api_move_j_and_completion_event_with_pause() {
        let kin = test_kinematics();
        let home = kin.home_joints().values;
        let mock = MockFieldbusTransport::new();
        let (mut kernel, client) = MotionKernel::new(kin, mock, LogManager::in_memory(100));
        let mut events = client.subscribe_events();

        let t0 = Instant::now();
        push_tx(&mut kernel, 1, 0, home);
        kernel.step_once(t0);

        let fut = client.set_drives_power(true);
        tokio::pin!(fut);
        let enabled = loop {
            tokio::select! {
                res = &mut fut => break res.unwrap(),
                _ = tokio::task::yield_now() => {
                    kernel.step_once(t0 + Duration::from_millis(MOTION_CYCLE_MS));
                }
            }
        };
        assert!(enabled);

        let mut target = home;
        target[0] += 6.0;
        let move_fut = client.move_j(MotionTarget::Joints(Joints6D { values: target }), 30.0);
        tokio::pin!(move_fut);
        let motion_id = loop {
            tokio::select! {
                res = &mut move_fut => break res.unwrap(),
                _ = tokio::task::yield_now() => {
                    kernel.step_once(t0 + Duration::from_millis(MOTION_CYCLE_MS * 2));
                }
            }
        };

        // 运行几拍后暂停，校验 q_cmd 冻结
        let mut now = t0 + Duration::from_millis(MOTION_CYCLE_MS * 3);
        for i in 0..10u64 {
            now += Duration::from_millis(MOTION_CYCLE_MS);
            let seq = kernel.seq;
            let q = kernel.q_cmd.values;
            push_tx(&mut kernel, i + 2, seq, q);
            kernel.step_once(now);
        }

        let pause_fut = client.set_motion_paused(true);
        tokio::pin!(pause_fut);
        loop {
            tokio::select! {
                res = &mut pause_fut => { res.unwrap(); break; }
                _ = tokio::task::yield_now() => {
                    now += Duration::from_millis(MOTION_CYCLE_MS);
                    let seq = kernel.seq;
                    let q = kernel.q_cmd.values;
                    push_tx(&mut kernel, 15, seq, q);
                    kernel.step_once(now);
                }
            }
        }
        let frozen_q = kernel.q_cmd.values[0];
        for i in 0..10u64 {
            now += Duration::from_millis(MOTION_CYCLE_MS);
            let seq = kernel.seq;
            let q = kernel.q_cmd.values;
            push_tx(&mut kernel, 20 + i, seq, q);
            kernel.step_once(now);
            assert!((kernel.q_cmd.values[0] - frozen_q).abs() < 1e-9);
        }

        // 恢复运行直到发出 MotionCompleted 事件
        let resume_fut = client.set_motion_paused(false);
        tokio::pin!(resume_fut);
        loop {
            tokio::select! {
                res = &mut resume_fut => { res.unwrap(); break; }
                _ = tokio::task::yield_now() => {
                    now += Duration::from_millis(MOTION_CYCLE_MS);
                    let seq = kernel.seq;
                    let q = kernel.q_cmd.values;
                    push_tx(&mut kernel, 35, seq, q);
                    kernel.step_once(now);
                }
            }
        }

        let mut completed = false;
        for step in 0..300u64 {
            now += Duration::from_millis(MOTION_CYCLE_MS);
            let seq = kernel.seq;
            let q = kernel.q_cmd.values;
            push_tx(&mut kernel, 40 + step, seq, q);
            kernel.step_once(now);
            while let Ok(ev) = events.try_recv() {
                if ev == (MotionEvent::MotionCompleted { motion_id }) {
                    completed = true;
                }
            }
            if completed {
                break;
            }
        }
        assert!(completed, "未收到 MotionCompleted 事件");
        assert!((kernel.q_cmd.values[0] - target[0]).abs() < 1e-3);
    }

    #[test]
    fn test_offline_and_stat_fault_safety_trip_and_watchdog() {
        let kin = test_kinematics();
        let mock = MockFieldbusTransport::new();
        let (mut kernel, client) = MotionKernel::new(kin, mock, LogManager::in_memory(100));
        let mut events = client.subscribe_events();
        let t0 = Instant::now();

        push_tx(&mut kernel, 1, 0, [-85.0, -90.0, 90.0, -90.0, -90.0, 0.0]);
        kernel.step_once(t0);
        kernel.drives_enabled = true;
        kernel
            .handle_move_j(
                MotionTarget::Joints(Joints6D {
                    values: [-70.0, -90.0, 90.0, -90.0, -90.0, 0.0],
                }),
                30.0,
            )
            .unwrap();

        // 超过 150ms 无 TxPdo -> 断线跳闸
        kernel.step_once(t0 + Duration::from_millis(200));
        assert!(!kernel.plant_online);
        assert!(!kernel.drives_enabled);
        assert!(!kernel.planner.is_busy());

        let mut saw_trip = false;
        while let Ok(ev) = events.try_recv() {
            if let MotionEvent::SafetyTripped { was_moving, .. } = ev {
                assert!(was_moving);
                saw_trip = true;
            }
        }
        assert!(saw_trip);

        // 重连并测试 Hold-to-Jog 150ms 看门狗 + STAT_FAULT
        let t1 = t0 + Duration::from_millis(250);
        let cur_q = kernel.q_act.values;
        push_tx(&mut kernel, 2, 0, cur_q);
        kernel.step_once(t1);
        kernel.drives_enabled = true;
        let jog = JogCommand {
            coord_system: CoordSystem::Joint,
            axis: "J1".to_string(),
            direction: 1.0,
            step_size: 2.0,
        };
        kernel.handle_jog_hold(jog, t1).unwrap();
        assert!(kernel.hold_jog_active);

        let cur_cmd = kernel.q_cmd.values;
        push_tx(&mut kernel, 3, 0, cur_cmd);
        kernel.step_once(t1 + Duration::from_millis(200));
        assert!(!kernel.hold_jog_active);
        assert!(!kernel.planner.is_busy());

        // 注入 STAT_FAULT 触发保护与复位脉冲
        let seq = kernel.seq;
        let q = kernel.q_act.values;
        kernel.transport.push_tx_pdo(TxPdo {
            status_word: STAT_PLANT_READY | STAT_FAULT,
            echo_seq: seq,
            sim_tick: 4,
            q_act_deg: q,
            qd_act_deg_s: [0.0; 6],
            tau_act_nm: [0.0; 6],
            digital_in: 0,
            fault_code: 0x1002,
        });
        kernel.step_once(t1 + Duration::from_millis(210));
        assert!(kernel.plant_fault_active);
        assert!(!kernel.drives_enabled);
        assert!(kernel.handle_set_drives_power(true).is_err());
        assert!(kernel.fault_reset_pulses > 0);
        kernel.step_once(t1 + Duration::from_millis(210 + MOTION_CYCLE_MS));
        let last_rx = kernel.transport.last_sent_rx().unwrap();
        assert_ne!(last_rx.control_word & CTRL_FAULT_RESET, 0);
    }
}
