use serde::{Deserialize, Serialize};
use thiserror::Error;

pub const RX_PDO_MAGIC: u32 = 0x4253_5258; // "BSRX"
pub const TX_PDO_MAGIC: u32 = 0x4253_5458; // "BSTX"
pub const PDO_VERSION: u16 = 1;
pub const RX_PDO_BYTES: usize = 80;
pub const TX_PDO_BYTES: usize = 176;

pub const CTRL_ENABLE: u16 = 1 << 0;
pub const CTRL_ESTOP_OK: u16 = 1 << 1;
pub const CTRL_FAULT_RESET: u16 = 1 << 2;

pub const STAT_PLANT_READY: u16 = 1 << 0;
pub const STAT_DRIVES_ENABLED: u16 = 1 << 1;
pub const STAT_FAULT: u16 = 1 << 2;

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub struct Pose6D {
    pub x: f64,
    pub y: f64,
    pub z: f64,
    pub a: f64,
    pub b: f64,
    pub c: f64,
}

impl Default for Pose6D {
    fn default() -> Self {
        Self {
            x: 0.0,
            y: 0.0,
            z: 0.0,
            a: 0.0,
            b: 0.0,
            c: 180.0,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub struct Joints6D {
    pub values: [f64; 6],
}

impl Joints6D {
    /// 返回开源 UR5e 模型的默认安全 HOME 关节角 (度)。
    pub fn home() -> Self {
        Self {
            values: [-90.0, -90.0, 90.0, -90.0, -90.0, 0.0],
        }
    }
}

impl Default for Joints6D {
    fn default() -> Self {
        Self::home()
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "UPPERCASE")]
pub enum OpMode {
    Manual,
    Auto,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "UPPERCASE")]
pub enum InterpreterState {
    Idle,
    Ready,
    Running,
    Paused,
    Completed,
    Error,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "UPPERCASE")]
pub enum MotionState {
    Idle,
    MoveL,
    MoveJ,
    Jog,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "UPPERCASE")]
pub enum CoordSystem {
    Cartesian,
    Joint,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct JogCommand {
    pub coord_system: CoordSystem,
    pub axis: String,
    pub direction: f64,
    pub step_size: f64,
}

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum MotionTarget {
    Pose(Pose6D),
    Joints(Joints6D),
}

#[derive(Debug, Clone, PartialEq)]
pub struct RxPdo {
    pub control_word: u16,
    pub seq: u64,
    pub timestamp_ns: u64,
    pub q_cmd_deg: [f64; 6],
    pub digital_out: u32,
}

#[derive(Debug, Clone, PartialEq)]
pub struct TxPdo {
    pub status_word: u16,
    pub echo_seq: u64,
    pub sim_tick: u64,
    pub q_act_deg: [f64; 6],
    pub qd_act_deg_s: [f64; 6],
    pub tau_act_nm: [f64; 6],
    pub digital_in: u32,
    pub fault_code: u32,
}

#[derive(Debug, Error)]
pub enum PdoError {
    #[error("无效报文长度: 期望 {expected} 字节, 实际 {actual} 字节")]
    InvalidLength { expected: usize, actual: usize },
    #[error("无效魔数: 0x{0:08X}")]
    InvalidMagic(u32),
    #[error("不支持的协议版本: {0}")]
    UnsupportedVersion(u16),
}

impl RxPdo {
    pub fn to_bytes(&self) -> [u8; RX_PDO_BYTES] {
        let mut buf = [0u8; RX_PDO_BYTES];
        buf[0..4].copy_from_slice(&RX_PDO_MAGIC.to_le_bytes());
        buf[4..6].copy_from_slice(&PDO_VERSION.to_le_bytes());
        buf[6..8].copy_from_slice(&self.control_word.to_le_bytes());
        buf[8..16].copy_from_slice(&self.seq.to_le_bytes());
        buf[16..24].copy_from_slice(&self.timestamp_ns.to_le_bytes());
        for (i, val) in self.q_cmd_deg.iter().enumerate() {
            let off = 24 + i * 8;
            buf[off..off + 8].copy_from_slice(&val.to_le_bytes());
        }
        buf[72..76].copy_from_slice(&self.digital_out.to_le_bytes());
        buf[76..80].copy_from_slice(&0u32.to_le_bytes());
        buf
    }

    pub fn from_bytes(buf: &[u8]) -> Result<Self, PdoError> {
        if buf.len() != RX_PDO_BYTES {
            return Err(PdoError::InvalidLength {
                expected: RX_PDO_BYTES,
                actual: buf.len(),
            });
        }
        let magic = u32::from_le_bytes(buf[0..4].try_into().unwrap());
        if magic != RX_PDO_MAGIC {
            return Err(PdoError::InvalidMagic(magic));
        }
        let ver = u16::from_le_bytes(buf[4..6].try_into().unwrap());
        if ver != PDO_VERSION {
            return Err(PdoError::UnsupportedVersion(ver));
        }
        let control_word = u16::from_le_bytes(buf[6..8].try_into().unwrap());
        let seq = u64::from_le_bytes(buf[8..16].try_into().unwrap());
        let timestamp_ns = u64::from_le_bytes(buf[16..24].try_into().unwrap());
        let mut q_cmd_deg = [0.0f64; 6];
        for (i, val) in q_cmd_deg.iter_mut().enumerate() {
            let off = 24 + i * 8;
            *val = f64::from_le_bytes(buf[off..off + 8].try_into().unwrap());
        }
        let digital_out = u32::from_le_bytes(buf[72..76].try_into().unwrap());
        Ok(Self {
            control_word,
            seq,
            timestamp_ns,
            q_cmd_deg,
            digital_out,
        })
    }
}

impl TxPdo {
    pub fn to_bytes(&self) -> [u8; TX_PDO_BYTES] {
        let mut buf = [0u8; TX_PDO_BYTES];
        buf[0..4].copy_from_slice(&TX_PDO_MAGIC.to_le_bytes());
        buf[4..6].copy_from_slice(&PDO_VERSION.to_le_bytes());
        buf[6..8].copy_from_slice(&self.status_word.to_le_bytes());
        buf[8..16].copy_from_slice(&self.echo_seq.to_le_bytes());
        buf[16..24].copy_from_slice(&self.sim_tick.to_le_bytes());
        for i in 0..6 {
            buf[24 + i * 8..32 + i * 8].copy_from_slice(&self.q_act_deg[i].to_le_bytes());
            buf[72 + i * 8..80 + i * 8].copy_from_slice(&self.qd_act_deg_s[i].to_le_bytes());
            buf[120 + i * 8..128 + i * 8].copy_from_slice(&self.tau_act_nm[i].to_le_bytes());
        }
        buf[168..172].copy_from_slice(&self.digital_in.to_le_bytes());
        buf[172..176].copy_from_slice(&self.fault_code.to_le_bytes());
        buf
    }

    pub fn from_bytes(buf: &[u8]) -> Result<Self, PdoError> {
        if buf.len() != TX_PDO_BYTES {
            return Err(PdoError::InvalidLength {
                expected: TX_PDO_BYTES,
                actual: buf.len(),
            });
        }
        let magic = u32::from_le_bytes(buf[0..4].try_into().unwrap());
        if magic != TX_PDO_MAGIC {
            return Err(PdoError::InvalidMagic(magic));
        }
        let ver = u16::from_le_bytes(buf[4..6].try_into().unwrap());
        if ver != PDO_VERSION {
            return Err(PdoError::UnsupportedVersion(ver));
        }
        let status_word = u16::from_le_bytes(buf[6..8].try_into().unwrap());
        let echo_seq = u64::from_le_bytes(buf[8..16].try_into().unwrap());
        let sim_tick = u64::from_le_bytes(buf[16..24].try_into().unwrap());
        let mut q_act_deg = [0.0f64; 6];
        let mut qd_act_deg_s = [0.0f64; 6];
        let mut tau_act_nm = [0.0f64; 6];
        for i in 0..6 {
            q_act_deg[i] = f64::from_le_bytes(buf[24 + i * 8..32 + i * 8].try_into().unwrap());
            qd_act_deg_s[i] = f64::from_le_bytes(buf[72 + i * 8..80 + i * 8].try_into().unwrap());
            tau_act_nm[i] = f64::from_le_bytes(buf[120 + i * 8..128 + i * 8].try_into().unwrap());
        }
        let digital_in = u32::from_le_bytes(buf[168..172].try_into().unwrap());
        let fault_code = u32::from_le_bytes(buf[172..176].try_into().unwrap());
        Ok(Self {
            status_word,
            echo_seq,
            sim_tick,
            q_act_deg,
            qd_act_deg_s,
            tau_act_nm,
            digital_in,
            fault_code,
        })
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RobotStateSnapshot {
    pub op_mode: OpMode,
    pub drives_on: bool,
    pub emergency_stop: bool,
    pub speed_override: u8,
    pub interpreter_state: InterpreterState,
    pub motion_state: MotionState,
    pub active_program: String,
    pub current_line: usize,
    pub joint_actual: [f64; 6],
    pub joint_torque: [f64; 6],
    pub cart_actual: Pose6D,
    pub digital_out: [bool; 8],
    pub plant_online: bool,
    pub rtt_ms: f64,
    pub cycle_count: u64,
    pub sim_tick: u64,
    pub status_message: String,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_rx_tx_pdo_roundtrip() {
        let rx = RxPdo {
            control_word: CTRL_ENABLE | CTRL_ESTOP_OK,
            seq: 42,
            timestamp_ns: 123_456_789,
            q_cmd_deg: [0.0, -90.0, 90.0, 0.0, 45.0, 12.5],
            digital_out: 0b0000_0101,
        };
        let bytes = rx.to_bytes();
        assert_eq!(bytes.len(), 80);
        let decoded = RxPdo::from_bytes(&bytes).unwrap();
        assert_eq!(decoded, rx);

        let tx = TxPdo {
            status_word: STAT_PLANT_READY | STAT_DRIVES_ENABLED,
            echo_seq: 42,
            sim_tick: 1000,
            q_act_deg: [1.0, -89.5, 90.2, 0.0, 44.8, 12.5],
            qd_act_deg_s: [0.1; 6],
            tau_act_nm: [2.5, -18.3, 9.1, 0.4, 1.2, 0.05],
            digital_in: 3,
            fault_code: 0,
        };
        let tbytes = tx.to_bytes();
        assert_eq!(tbytes.len(), 176);
        assert_eq!(TxPdo::from_bytes(&tbytes).unwrap(), tx);
    }

    #[test]
    fn test_invalid_magic_rejected() {
        let mut bad = [0u8; 80];
        bad[0..4].copy_from_slice(&0xDEAD_BEEFu32.to_le_bytes());
        assert!(matches!(
            RxPdo::from_bytes(&bad),
            Err(PdoError::InvalidMagic(0xDEAD_BEEF))
        ));
    }

    #[test]
    fn test_invalid_length_rejected() {
        let bad = [0u8; 50];
        assert!(matches!(
            RxPdo::from_bytes(&bad),
            Err(PdoError::InvalidLength {
                expected: 80,
                actual: 50
            })
        ));
        assert!(matches!(
            TxPdo::from_bytes(&bad),
            Err(PdoError::InvalidLength {
                expected: 176,
                actual: 50
            })
        ));
    }

    #[test]
    fn test_invalid_version_rejected() {
        let mut bad_rx = RxPdo {
            control_word: 0,
            seq: 1,
            timestamp_ns: 0,
            q_cmd_deg: [0.0; 6],
            digital_out: 0,
        }
        .to_bytes();
        bad_rx[4..6].copy_from_slice(&99u16.to_le_bytes());
        assert!(matches!(
            RxPdo::from_bytes(&bad_rx),
            Err(PdoError::UnsupportedVersion(99))
        ));
    }

    #[test]
    fn test_joints_default_and_home() {
        let j = Joints6D::default();
        assert_eq!(j.values, [-90.0, -90.0, 90.0, -90.0, -90.0, 0.0]);
    }

    #[test]
    fn test_pose_default() {
        let p = Pose6D::default();
        assert_eq!(p.x, 0.0);
        assert_eq!(p.a, 0.0);
        assert_eq!(p.c, 180.0);
    }
}
