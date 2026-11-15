//! # bass-hal
//!
//! HAL 硬件抽象层与定长二进制 UDP 现场总线驱动。
//!
//! 提供 `FieldbusTransport` Trait，将控制器内核与实际物理/仿真通信解耦，
//! 并提供生产环境 UDP 驱动 `UdpFieldbusDriver` 及跨 crate 测试用的 `MockFieldbusTransport`。

use bass_types::{PdoError, RxPdo, TxPdo, RX_PDO_BYTES, TX_PDO_BYTES};
use std::collections::VecDeque;
use std::net::{SocketAddr, ToSocketAddrs, UdpSocket};
use thiserror::Error;

/// 默认控制器本地监听地址与端口（接收来自物理进程的 TxPDO）
pub const DEFAULT_LOCAL_ADDR: &str = "127.0.0.1:25001";
/// 默认物理仿真端监听地址与端口（向其下发 RxPDO）
pub const DEFAULT_REMOTE_ADDR: &str = "127.0.0.1:25000";

/// HAL 层硬件与总线通信错误类型
#[derive(Debug, Error)]
pub enum HalError {
    /// 底层网络 I/O 错误
    #[error("I/O 错误: {0}")]
    Io(#[from] std::io::Error),

    /// PDO 定长二进制数据编解码错误
    #[error("PDO 编解码错误: {0}")]
    Pdo(#[from] PdoError),

    /// UDP 发送数据长度不足或异常
    #[error("发送字节数不匹配: 期望 {expected} 字节, 实际发送 {actual} 字节")]
    SendPartial {
        /// 期望发送字节数
        expected: usize,
        /// 实际发送字节数
        actual: usize,
    },
}

/// 现场总线传输抽象 Trait
pub trait FieldbusTransport: Send {
    /// 向物理进程/硬件驱动器下发 80 字节 RxPDO 控制指令
    fn send_rx_pdo(&mut self, cmd: &RxPdo) -> Result<(), HalError>;

    /// 非阻塞抽空套接字/总线缓冲区，返回最新到达且校验通过的一帧有效 TxPDO。
    ///
    /// 若当前周期内无新帧到达，返回 `Ok(None)`。
    fn poll_tx_pdo(&mut self) -> Result<Option<TxPdo>, HalError>;
}

/// 基于定长二进制 UDP 报文的硬件总线驱动
pub struct UdpFieldbusDriver {
    socket: UdpSocket,
    remote_addr: SocketAddr,
}

impl UdpFieldbusDriver {
    /// 通过指定本地绑定地址和目标远端地址创建 UDP 总线驱动。
    ///
    /// 套接字初始化时将自动设置为非阻塞模式 (`set_nonblocking(true)`)。
    pub fn new(bind_addr: SocketAddr, remote_addr: SocketAddr) -> Result<Self, HalError> {
        let socket = UdpSocket::bind(bind_addr)?;
        socket.set_nonblocking(true)?;
        Ok(Self {
            socket,
            remote_addr,
        })
    }

    /// 通过地址字符串创建 UDP 总线驱动。
    pub fn open(bind_addr: &str, remote_addr: &str) -> Result<Self, HalError> {
        let local = bind_addr.to_socket_addrs()?.next().ok_or_else(|| {
            std::io::Error::new(std::io::ErrorKind::InvalidInput, "无效的 bind_addr")
        })?;
        let remote = remote_addr.to_socket_addrs()?.next().ok_or_else(|| {
            std::io::Error::new(std::io::ErrorKind::InvalidInput, "无效的 remote_addr")
        })?;
        Self::new(local, remote)
    }

    /// 使用默认地址 (`127.0.0.1:25001` 本地接收, `127.0.0.1:25000` 远端下发) 创建驱动。
    pub fn default_driver() -> Result<Self, HalError> {
        Self::open(DEFAULT_LOCAL_ADDR, DEFAULT_REMOTE_ADDR)
    }

    /// 获取本地套接字实际绑定地址（便于使用 `127.0.0.1:0` 动态端口测试）
    pub fn local_addr(&self) -> Result<SocketAddr, HalError> {
        Ok(self.socket.local_addr()?)
    }

    /// 获取当前配置的远端物理进程地址
    pub fn remote_addr(&self) -> SocketAddr {
        self.remote_addr
    }

    /// 动态修改远端物理进程地址
    pub fn set_remote_addr(&mut self, remote_addr: SocketAddr) {
        self.remote_addr = remote_addr;
    }
}

impl FieldbusTransport for UdpFieldbusDriver {
    fn send_rx_pdo(&mut self, cmd: &RxPdo) -> Result<(), HalError> {
        let bytes = cmd.to_bytes();
        let sent = self.socket.send_to(&bytes, self.remote_addr)?;
        if sent != RX_PDO_BYTES {
            return Err(HalError::SendPartial {
                expected: RX_PDO_BYTES,
                actual: sent,
            });
        }
        Ok(())
    }

    fn poll_tx_pdo(&mut self) -> Result<Option<TxPdo>, HalError> {
        let mut latest_valid: Option<TxPdo> = None;
        let mut buf = [0u8; 2048];

        loop {
            match self.socket.recv_from(&mut buf) {
                Ok((n, _src_addr)) => {
                    // 只有长度严格等于 176 字节且魔数/版本校验通过的才是合法 TxPDO
                    if n == TX_PDO_BYTES {
                        if let Ok(tx) = TxPdo::from_bytes(&buf[..TX_PDO_BYTES]) {
                            // 保鲜与防乱序机制：
                            // 在同一次 poll 抽空过程中，若后续到达的包 sim_tick 领先或相同时 echo_seq 递进，则更新保鲜帧；
                            // 丢弃网络抖动导致的乱序旧帧。
                            let is_fresher = match &latest_valid {
                                Some(prev) => {
                                    if tx.sim_tick > prev.sim_tick {
                                        true
                                    } else if tx.sim_tick == prev.sim_tick {
                                        tx.echo_seq >= prev.echo_seq
                                    } else {
                                        false
                                    }
                                }
                                None => true,
                            };
                            if is_fresher {
                                latest_valid = Some(tx);
                            }
                        }
                        // 魔数或版本错误的杂包静默丢弃，继续循环抽空
                    }
                    // 长度不匹配的杂包静默丢弃，继续循环抽空
                }
                Err(e) => {
                    match e.kind() {
                        // 套接字队列已抽空，或 Windows ICMP 端口不可达触发的 ConnectionReset
                        std::io::ErrorKind::WouldBlock
                        | std::io::ErrorKind::TimedOut
                        | std::io::ErrorKind::ConnectionReset => {
                            break;
                        }
                        std::io::ErrorKind::Interrupted => {
                            continue;
                        }
                        _ => {
                            // Windows 平台特殊错误码容错
                            if e.raw_os_error() == Some(10054) {
                                // WSAECONNRESET: 远端进程未启动或重启时 ICMP Port Unreachable 反馈，视作无新帧
                                break;
                            }
                            if e.raw_os_error() == Some(10040) {
                                // WSAEMSGSIZE: 收到超过接收缓冲区大小的超大杂包，丢弃并继续抽空
                                continue;
                            }
                            return Err(HalError::Io(e));
                        }
                    }
                }
            }
        }

        Ok(latest_valid)
    }
}

/// 供跨 crate 测试与单元测试复用的内存 Mock 传输实现
#[derive(Debug, Default, Clone)]
pub struct MockFieldbusTransport {
    /// 模拟待接收的 TxPDO 队列
    pub incoming_tx: VecDeque<TxPdo>,
    /// 已下发的 RxPDO 历史列表
    pub sent_rx: Vec<RxPdo>,
    /// 是否在 poll 时清空队列直接返回最新帧（默认 false 为按序消费 pop_front）
    pub drain_to_latest: bool,
}

impl MockFieldbusTransport {
    /// 创建空的 Mock 传输实例
    pub fn new() -> Self {
        Self::default()
    }

    /// 设置是否在 poll 时抽空并只返回最新一帧
    pub fn with_drain_to_latest(mut self, drain: bool) -> Self {
        self.drain_to_latest = drain;
        self
    }

    /// 向 Mock 传输队列压入一帧待接收的 TxPDO
    pub fn push_tx_pdo(&mut self, tx: TxPdo) {
        self.incoming_tx.push_back(tx);
    }

    /// 获取最近一次下发的 RxPDO 控制指令
    pub fn last_sent_rx(&self) -> Option<&RxPdo> {
        self.sent_rx.last()
    }

    /// 清空所有发送历史与接收队列
    pub fn clear(&mut self) {
        self.incoming_tx.clear();
        self.sent_rx.clear();
    }
}

impl FieldbusTransport for MockFieldbusTransport {
    fn send_rx_pdo(&mut self, cmd: &RxPdo) -> Result<(), HalError> {
        self.sent_rx.push(cmd.clone());
        Ok(())
    }

    fn poll_tx_pdo(&mut self) -> Result<Option<TxPdo>, HalError> {
        if self.drain_to_latest {
            let last = self.incoming_tx.pop_back();
            self.incoming_tx.clear();
            Ok(last)
        } else {
            Ok(self.incoming_tx.pop_front())
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use bass_types::{CTRL_ENABLE, CTRL_ESTOP_OK, STAT_DRIVES_ENABLED, STAT_PLANT_READY};

    fn make_test_tx_pdo(sim_tick: u64, echo_seq: u64) -> TxPdo {
        TxPdo {
            status_word: STAT_PLANT_READY | STAT_DRIVES_ENABLED,
            echo_seq,
            sim_tick,
            q_act_deg: [0.0, -90.0, 90.0, 0.0, 45.0, 0.0],
            qd_act_deg_s: [0.0; 6],
            tau_act_nm: [1.0, 2.0, 3.0, 0.5, 0.2, 0.1],
            digital_in: 0x01,
            fault_code: 0,
        }
    }

    #[test]
    fn test_udp_drain_latest_frame() {
        let plant_sock = UdpSocket::bind("127.0.0.1:0").unwrap();
        let plant_addr = plant_sock.local_addr().unwrap();

        let mut driver =
            UdpFieldbusDriver::new("127.0.0.1:0".parse().unwrap(), plant_addr).unwrap();
        let driver_addr = driver.local_addr().unwrap();

        // Plant 发送 3 帧：sim_tick = 1, 2, 3
        for tick in 1..=3 {
            let tx = make_test_tx_pdo(tick, tick);
            plant_sock.send_to(&tx.to_bytes(), driver_addr).unwrap();
        }

        // 等待操作系统 UDP 环回栈将 3 帧完全投递至接收端套接字缓冲区
        std::thread::sleep(std::time::Duration::from_millis(20));

        // poll_tx_pdo 必须抽空缓冲区并只保留最新一帧 sim_tick = 3
        let received = driver.poll_tx_pdo().unwrap();
        assert!(received.is_some());
        assert_eq!(received.unwrap().sim_tick, 3);

        // 再次 poll 应返回 None（队列已清空）
        let second_poll = driver.poll_tx_pdo().unwrap();
        assert!(second_poll.is_none());
    }

    #[test]
    fn test_udp_send_rx_pdo_roundtrip() {
        let plant_sock = UdpSocket::bind("127.0.0.1:0").unwrap();
        let plant_addr = plant_sock.local_addr().unwrap();

        let mut driver =
            UdpFieldbusDriver::new("127.0.0.1:0".parse().unwrap(), plant_addr).unwrap();

        let rx_cmd = RxPdo {
            control_word: CTRL_ENABLE | CTRL_ESTOP_OK,
            seq: 42,
            timestamp_ns: 999_888_777,
            q_cmd_deg: [10.0, -80.0, 85.0, 5.0, 40.0, 1.0],
            digital_out: 0b1011,
        };

        driver.send_rx_pdo(&rx_cmd).unwrap();

        let mut buf = [0u8; 128];
        let (n, _) = plant_sock.recv_from(&mut buf).unwrap();
        assert_eq!(n, RX_PDO_BYTES);

        let decoded = RxPdo::from_bytes(&buf[..n]).unwrap();
        assert_eq!(decoded, rx_cmd);
    }

    #[test]
    fn test_udp_garbage_packet_discard() {
        let plant_sock = UdpSocket::bind("127.0.0.1:0").unwrap();
        let plant_addr = plant_sock.local_addr().unwrap();

        let mut driver =
            UdpFieldbusDriver::new("127.0.0.1:0".parse().unwrap(), plant_addr).unwrap();
        let driver_addr = driver.local_addr().unwrap();

        // 1. 发送过短杂包 (4 字节)
        plant_sock
            .send_to(&[0x01, 0x02, 0x03, 0x04], driver_addr)
            .unwrap();

        // 2. 发送魔数错误的 176 字节包
        let mut corrupted = [0u8; TX_PDO_BYTES];
        corrupted[0..4].copy_from_slice(&0xDEAD_BEEFu32.to_le_bytes());
        plant_sock.send_to(&corrupted, driver_addr).unwrap();

        // 3. 发送有效 TxPDO (sim_tick = 42)
        let valid_tx = make_test_tx_pdo(42, 100);
        plant_sock
            .send_to(&valid_tx.to_bytes(), driver_addr)
            .unwrap();

        // 4. 发送超长杂包 (200 字节)
        plant_sock.send_to(&[0xAA; 200], driver_addr).unwrap();

        // 等待操作系统 UDP 环回栈完成数据包投递
        std::thread::sleep(std::time::Duration::from_millis(20));

        // poll_tx_pdo 丢弃杂包，抽空队列，成功提取有效帧 sim_tick = 42
        let received = driver.poll_tx_pdo().unwrap();
        assert!(received.is_some());
        assert_eq!(received.unwrap().sim_tick, 42);
    }

    #[test]
    fn test_udp_out_of_order_protection() {
        let plant_sock = UdpSocket::bind("127.0.0.1:0").unwrap();
        let plant_addr = plant_sock.local_addr().unwrap();

        let mut driver =
            UdpFieldbusDriver::new("127.0.0.1:0".parse().unwrap(), plant_addr).unwrap();
        let driver_addr = driver.local_addr().unwrap();

        // 先发送新包 sim_tick = 10，后紧随乱序延迟旧包 sim_tick = 5
        let tx_new = make_test_tx_pdo(10, 10);
        let tx_old = make_test_tx_pdo(5, 5);
        plant_sock.send_to(&tx_new.to_bytes(), driver_addr).unwrap();
        plant_sock.send_to(&tx_old.to_bytes(), driver_addr).unwrap();

        // 等待操作系统 UDP 环回栈完成数据包投递
        std::thread::sleep(std::time::Duration::from_millis(20));

        let received = driver.poll_tx_pdo().unwrap();
        assert!(received.is_some());
        assert_eq!(received.unwrap().sim_tick, 10);
    }

    #[test]
    fn test_udp_connection_reset_tolerance() {
        // 绑定未监听的本地 UDP 端口模拟 Windows WSAECONNRESET (10054) 场景
        let unopened_sock = UdpSocket::bind("127.0.0.1:0").unwrap();
        let unopened_addr = unopened_sock.local_addr().unwrap();
        drop(unopened_sock);

        let mut driver =
            UdpFieldbusDriver::new("127.0.0.1:0".parse().unwrap(), unopened_addr).unwrap();

        let rx_cmd = RxPdo {
            control_word: CTRL_ENABLE,
            seq: 1,
            timestamp_ns: 100,
            q_cmd_deg: [0.0; 6],
            digital_out: 0,
        };

        // 向关闭的端口发送 UDP 包，随后 poll 不得抛出致命错误，应安全返回 Ok(None)
        let _ = driver.send_rx_pdo(&rx_cmd);
        let poll_res = driver.poll_tx_pdo();
        assert!(poll_res.is_ok());
        assert_eq!(poll_res.unwrap(), None);
    }

    #[test]
    fn test_mock_fieldbus_transport() {
        let mut mock = MockFieldbusTransport::new();

        let rx_cmd = RxPdo {
            control_word: CTRL_ENABLE,
            seq: 1,
            timestamp_ns: 100,
            q_cmd_deg: [0.0; 6],
            digital_out: 0,
        };
        mock.send_rx_pdo(&rx_cmd).unwrap();
        assert_eq!(mock.sent_rx.len(), 1);
        assert_eq!(mock.last_sent_rx(), Some(&rx_cmd));

        let tx1 = make_test_tx_pdo(1, 1);
        let tx2 = make_test_tx_pdo(2, 2);
        mock.push_tx_pdo(tx1.clone());
        mock.push_tx_pdo(tx2.clone());

        let polled1 = mock.poll_tx_pdo().unwrap();
        assert_eq!(polled1, Some(tx1));

        let polled2 = mock.poll_tx_pdo().unwrap();
        assert_eq!(polled2, Some(tx2));

        let empty_poll = mock.poll_tx_pdo().unwrap();
        assert!(empty_poll.is_none());

        // 测试 with_drain_to_latest
        let mut mock_drain = MockFieldbusTransport::new().with_drain_to_latest(true);
        mock_drain.push_tx_pdo(make_test_tx_pdo(1, 1));
        mock_drain.push_tx_pdo(make_test_tx_pdo(3, 3));
        let polled_latest = mock_drain.poll_tx_pdo().unwrap();
        assert_eq!(polled_latest.unwrap().sim_tick, 3);
        assert!(mock_drain.poll_tx_pdo().unwrap().is_none());

        mock.clear();
        assert_eq!(mock.sent_rx.len(), 0);
        assert_eq!(mock.incoming_tx.len(), 0);
    }

    #[test]
    fn test_udp_driver_open_and_set_remote_addr() {
        let sock = UdpSocket::bind("127.0.0.1:0").unwrap();
        let target_addr = sock.local_addr().unwrap();

        let mut driver = UdpFieldbusDriver::open("127.0.0.1:0", &target_addr.to_string()).unwrap();
        assert_eq!(driver.remote_addr(), target_addr);

        let new_target: SocketAddr = "127.0.0.1:25000".parse().unwrap();
        driver.set_remote_addr(new_target);
        assert_eq!(driver.remote_addr(), new_target);
    }
}
