use async_trait::async_trait;
use bass_types::{JogCommand, MotionState, MotionTarget, Pose6D};
use serde::{Deserialize, Serialize};
use tokio::sync::{broadcast, mpsc, oneshot, watch};

/// 实时运动控制周期（毫秒，500Hz）
pub const MOTION_CYCLE_MS: u64 = 2;
/// 实时运动控制周期（秒，500Hz）
pub const MOTION_CYCLE_DT_S: f64 = 0.002;
/// 实时运动控制周期（纳秒）
pub const MOTION_CYCLE_NS: u64 = 2_000_000;

/// 实时运动引擎向外发布的实时物理与伺服遥测快照
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct MotionTelemetry {
    pub drives_enabled: bool,
    pub estop_active: bool,
    pub speed_override: u8,
    pub motion_state: MotionState,
    pub paused: bool,
    pub active_motion_id: Option<u64>,
    pub joint_actual: [f64; 6],
    pub joint_cmd: [f64; 6],
    pub joint_velocity: [f64; 6],
    pub joint_torque: [f64; 6],
    pub cart_actual: Pose6D,
    pub digital_out: [bool; 8],
    pub digital_in: u32,
    pub plant_online: bool,
    pub plant_fault_active: bool,
    pub last_fault_code: u32,
    pub rtt_ms: f64,
    pub cycle_count: u64,
    pub sim_tick: u64,
}

/// 实时运动引擎向控制器与任务管理器推送的异步事件
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum MotionEvent {
    MotionCompleted {
        motion_id: u64,
    },
    MotionFailed {
        motion_id: u64,
        error: String,
    },
    SafetyTripped {
        reason: String,
        fault_code: u32,
        was_moving: bool,
    },
    PlantOnlineChanged {
        online: bool,
        sim_tick: u64,
    },
    FaultCleared,
}

/// 发送给 2ms 实时运动引擎线程的指令
pub enum MotionEngineCommand {
    SetDrivesPower {
        enable: bool,
        resp: oneshot::Sender<Result<bool, String>>,
    },
    SetEmergencyStop {
        active: bool,
        resp: oneshot::Sender<Result<bool, String>>,
    },
    SetSpeedOverride {
        value: u8,
        resp: oneshot::Sender<u8>,
    },
    SetDigitalOut {
        pin: usize,
        value: bool,
        resp: oneshot::Sender<Result<[bool; 8], String>>,
    },
    ClearFault {
        resp: oneshot::Sender<()>,
    },
    MoveL {
        target: Pose6D,
        vel_mm_s: f64,
        resp: oneshot::Sender<Result<u64, String>>,
    },
    MoveJ {
        target: MotionTarget,
        vel_deg_s: f64,
        resp: oneshot::Sender<Result<u64, String>>,
    },
    JogStep {
        cmd: JogCommand,
        resp: oneshot::Sender<Result<u64, String>>,
    },
    JogHold {
        cmd: JogCommand,
        resp: oneshot::Sender<Result<(), String>>,
    },
    JogStop {
        resp: oneshot::Sender<()>,
    },
    SetMotionPaused {
        paused: bool,
        resp: oneshot::Sender<()>,
    },
    StopMotion {
        resp: oneshot::Sender<()>,
    },
}

/// 实时运动引擎标准异步控制 API（面向控制器管理与任务调度模块）
#[async_trait]
pub trait MotionEngineApi: Send + Sync {
    fn latest_telemetry(&self) -> MotionTelemetry;
    fn subscribe_telemetry(&self) -> watch::Receiver<MotionTelemetry>;
    fn subscribe_events(&self) -> broadcast::Receiver<MotionEvent>;

    async fn set_drives_power(&self, enable: bool) -> Result<bool, String>;
    async fn set_emergency_stop(&self, active: bool) -> Result<bool, String>;
    async fn set_speed_override(&self, value: u8) -> Result<u8, String>;
    async fn set_digital_out(&self, pin: usize, value: bool) -> Result<[bool; 8], String>;
    async fn clear_fault(&self) -> Result<(), String>;

    async fn move_l(&self, target: Pose6D, vel_mm_s: f64) -> Result<u64, String>;
    async fn move_j(&self, target: MotionTarget, vel_deg_s: f64) -> Result<u64, String>;
    async fn jog_step(&self, cmd: JogCommand) -> Result<u64, String>;
    async fn jog_hold(&self, cmd: JogCommand) -> Result<(), String>;
    async fn jog_stop(&self) -> Result<(), String>;

    async fn set_motion_paused(&self, paused: bool) -> Result<(), String>;
    async fn stop_motion(&self) -> Result<(), String>;
}

/// 同进程强类型实时运动引擎异步调用句柄
#[derive(Clone)]
pub struct MotionEngineClient {
    cmd_tx: mpsc::UnboundedSender<MotionEngineCommand>,
    telemetry_rx: watch::Receiver<MotionTelemetry>,
    event_tx: broadcast::Sender<MotionEvent>,
}

impl MotionEngineClient {
    pub fn new(
        cmd_tx: mpsc::UnboundedSender<MotionEngineCommand>,
        telemetry_rx: watch::Receiver<MotionTelemetry>,
        event_tx: broadcast::Sender<MotionEvent>,
    ) -> Self {
        Self {
            cmd_tx,
            telemetry_rx,
            event_tx,
        }
    }

    async fn send_cmd<R>(
        &self,
        build: impl FnOnce(oneshot::Sender<R>) -> MotionEngineCommand,
    ) -> Result<R, String> {
        let (tx, rx) = oneshot::channel();
        self.cmd_tx
            .send(build(tx))
            .map_err(|_| "实时运动引擎通信通道已断开".to_string())?;
        rx.await.map_err(|_| "实时运动引擎响应超时".to_string())
    }
}

#[async_trait]
impl MotionEngineApi for MotionEngineClient {
    fn latest_telemetry(&self) -> MotionTelemetry {
        self.telemetry_rx.borrow().clone()
    }

    fn subscribe_telemetry(&self) -> watch::Receiver<MotionTelemetry> {
        self.telemetry_rx.clone()
    }

    fn subscribe_events(&self) -> broadcast::Receiver<MotionEvent> {
        self.event_tx.subscribe()
    }

    async fn set_drives_power(&self, enable: bool) -> Result<bool, String> {
        self.send_cmd(|resp| MotionEngineCommand::SetDrivesPower { enable, resp })
            .await?
    }

    async fn set_emergency_stop(&self, active: bool) -> Result<bool, String> {
        self.send_cmd(|resp| MotionEngineCommand::SetEmergencyStop { active, resp })
            .await?
    }

    async fn set_speed_override(&self, value: u8) -> Result<u8, String> {
        self.send_cmd(|resp| MotionEngineCommand::SetSpeedOverride { value, resp })
            .await
    }

    async fn set_digital_out(&self, pin: usize, value: bool) -> Result<[bool; 8], String> {
        self.send_cmd(|resp| MotionEngineCommand::SetDigitalOut { pin, value, resp })
            .await?
    }

    async fn clear_fault(&self) -> Result<(), String> {
        self.send_cmd(|resp| MotionEngineCommand::ClearFault { resp })
            .await
    }

    async fn move_l(&self, target: Pose6D, vel_mm_s: f64) -> Result<u64, String> {
        self.send_cmd(|resp| MotionEngineCommand::MoveL {
            target,
            vel_mm_s,
            resp,
        })
        .await?
    }

    async fn move_j(&self, target: MotionTarget, vel_deg_s: f64) -> Result<u64, String> {
        self.send_cmd(|resp| MotionEngineCommand::MoveJ {
            target,
            vel_deg_s,
            resp,
        })
        .await?
    }

    async fn jog_step(&self, cmd: JogCommand) -> Result<u64, String> {
        self.send_cmd(|resp| MotionEngineCommand::JogStep { cmd, resp })
            .await?
    }

    async fn jog_hold(&self, cmd: JogCommand) -> Result<(), String> {
        self.send_cmd(|resp| MotionEngineCommand::JogHold { cmd, resp })
            .await?
    }

    async fn jog_stop(&self) -> Result<(), String> {
        self.send_cmd(|resp| MotionEngineCommand::JogStop { resp })
            .await
    }

    async fn set_motion_paused(&self, paused: bool) -> Result<(), String> {
        self.send_cmd(|resp| MotionEngineCommand::SetMotionPaused { paused, resp })
            .await
    }

    async fn stop_motion(&self) -> Result<(), String> {
        self.send_cmd(|resp| MotionEngineCommand::StopMotion { resp })
            .await
    }
}
