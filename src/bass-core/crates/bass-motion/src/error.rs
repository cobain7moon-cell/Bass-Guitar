use bass_types::CoordSystem;
use thiserror::Error;

#[derive(Debug, Error, Clone, PartialEq)]
pub enum MotionError {
    #[error("机器人模型 JSON 解析失败: {0}")]
    ModelConfig(String),
    #[error("关节 {axis} 角度 {value:.2}° 超出限位 [{min:.2}°, {max:.2}°]")]
    JointLimitExceeded {
        axis: usize,
        value: f64,
        min: f64,
        max: f64,
    },
    #[error("逆运动学求解未收敛 (目标: x={x:.2}, y={y:.2}, z={z:.2})")]
    IkConvergenceFailed { x: f64, y: f64, z: f64 },
    #[error("规划错误: {0}")]
    PlanningError(String),
    #[error("未知轴: {0}")]
    UnknownAxis(String),
    #[error("不支持的坐标系: {0:?}")]
    UnsupportedCoordSystem(CoordSystem),
    #[error("无效参数: {0}")]
    InvalidParameter(String),
}
