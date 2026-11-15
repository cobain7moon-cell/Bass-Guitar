"""MuJoCo 4.0 独立物理仿真进程与二进制 UDP 现场总线服务节点。"""

from __future__ import annotations

import argparse
from dataclasses import dataclass
import math
from pathlib import Path
import socket
import struct
import sys
import time
from typing import Any
import mujoco
import mujoco.viewer
import numpy as np

try:
    from .chain_mjcf import RobotChainSpec, build_mujoco_xml, load_robot_model
except ImportError:
    from chain_mjcf import RobotChainSpec, build_mujoco_xml, load_robot_model  # type: ignore[no-redef]

RX_PDO_MAGIC: int = 0x42535258  # "BSRX"
TX_PDO_MAGIC: int = 0x42535458  # "BSTX"
PDO_VERSION: int = 1
RX_PDO_BYTES: int = 80
TX_PDO_BYTES: int = 176

CTRL_ENABLE: int = 1 << 0
CTRL_ESTOP_OK: int = 1 << 1
CTRL_FAULT_RESET: int = 1 << 2

STAT_PLANT_READY: int = 1 << 0
STAT_DRIVES_ENABLED: int = 1 << 1
STAT_FAULT: int = 1 << 2

HOME_JOINTS_DEG: tuple[float, float, float, float, float, float] = (-90.0, -90.0, 90.0, -90.0, -90.0, 0.0)
WATCHDOG_TIMEOUT_SEC: float = 0.120


class PdoError(Exception):
    """PDO 二进制报文校验或编解码异常。"""


@dataclass(frozen=True)
class RxPdo:
    """来自控制器的控制命令报文 (80 字节小端对齐)。"""

    control_word: int
    seq: int
    timestamp_ns: int
    q_cmd_deg: tuple[float, float, float, float, float, float]
    digital_out: int

    def to_bytes(self) -> bytes:
        """编码为 80 字节小端二进制字节流。"""
        return struct.pack(
            "<IHHQQ6dII",
            RX_PDO_MAGIC,
            PDO_VERSION,
            self.control_word,
            self.seq,
            self.timestamp_ns,
            *self.q_cmd_deg,
            self.digital_out,
            0,
        )

    @classmethod
    def from_bytes(cls, buf: bytes) -> RxPdo:
        """从二进制字节流中解码 RxPdo。"""
        return decode_rx_pdo(buf)


@dataclass(frozen=True)
class TxPdo:
    """物理仿真被控对象回传的状态反馈报文 (176 字节小端对齐)。"""

    status_word: int
    echo_seq: int
    sim_tick: int
    q_act_deg: tuple[float, float, float, float, float, float]
    qd_act_deg_s: tuple[float, float, float, float, float, float]
    tau_act_nm: tuple[float, float, float, float, float, float]
    digital_in: int
    fault_code: int

    def to_bytes(self) -> bytes:
        """编码为 176 字节小端二进制字节流。"""
        return encode_tx_pdo(self)

    @classmethod
    def from_bytes(cls, buf: bytes) -> TxPdo:
        """从二进制字节流中解码 TxPdo。"""
        if len(buf) != TX_PDO_BYTES:
            raise PdoError(f"无效 TxPDO 报文长度: 期望 {TX_PDO_BYTES} 字节，实际 {len(buf)} 字节")

        magic, ver, status_word, echo_seq, sim_tick = struct.unpack_from("<IHHQQ", buf, 0)
        if magic != TX_PDO_MAGIC:
            raise PdoError(f"无效 TxPDO 魔数: 0x{magic:08X} (期望 0x{TX_PDO_MAGIC:08X})")
        if ver != PDO_VERSION:
            raise PdoError(f"不支持的 TxPDO 版本: {ver} (期望 {PDO_VERSION})")

        q_act = struct.unpack_from("<6d", buf, 24)
        qd_act = struct.unpack_from("<6d", buf, 72)
        tau_act = struct.unpack_from("<6d", buf, 120)
        digital_in, fault_code = struct.unpack_from("<II", buf, 168)

        return cls(
            status_word=status_word,
            echo_seq=echo_seq,
            sim_tick=sim_tick,
            q_act_deg=q_act,
            qd_act_deg_s=qd_act,
            tau_act_nm=tau_act,
            digital_in=digital_in,
            fault_code=fault_code,
        )


def decode_rx_pdo(buf: bytes) -> RxPdo:
    """校验并解码 80 字节 RxPDO 报文。

    Args:
        buf: 原始网络接收字节流。

    Returns:
        解析后的 RxPdo 对象。

    Raises:
        PdoError: 报文长度不符、魔数错误、协议版本不匹配或关节目标包含非有限浮点数。
    """
    if len(buf) != RX_PDO_BYTES:
        raise PdoError(f"无效 RxPDO 报文长度: 期望 {RX_PDO_BYTES} 字节，实际 {len(buf)} 字节")

    magic, ver, control_word, seq, timestamp_ns = struct.unpack_from("<IHHQQ", buf, 0)
    if magic != RX_PDO_MAGIC:
        raise PdoError(f"无效 RxPDO 魔数: 0x{magic:08X} (期望 0x{RX_PDO_MAGIC:08X})")
    if ver != PDO_VERSION:
        raise PdoError(f"不支持的 RxPDO 版本: {ver} (期望 {PDO_VERSION})")

    q_cmd = struct.unpack_from("<6d", buf, 24)
    for i, v in enumerate(q_cmd):
        if not math.isfinite(v):
            raise PdoError(f"RxPDO 关节目标 J{i + 1} 包含非有限浮点数: {v}")

    digital_out, _reserved = struct.unpack_from("<II", buf, 72)

    return RxPdo(
        control_word=control_word,
        seq=seq,
        timestamp_ns=timestamp_ns,
        q_cmd_deg=q_cmd,
        digital_out=digital_out,
    )


def encode_tx_pdo(tx: TxPdo) -> bytes:
    """将 TxPdo 状态反馈打包为 176 字节小端对齐二进制报文。

    Args:
        tx: 待打包的 TxPdo 对象。

    Returns:
        176 字节固定长度二进制串。
    """
    return struct.pack(
        "<IHHQQ6d6d6dII",
        TX_PDO_MAGIC,
        PDO_VERSION,
        tx.status_word,
        tx.echo_seq,
        tx.sim_tick,
        *tx.q_act_deg,
        *tx.qd_act_deg_s,
        *tx.tau_act_nm,
        tx.digital_in,
        tx.fault_code,
    )


class MuJoCoUdpPlant:
    """基于 MuJoCo 4.0 的机器人物理仿真被控对象与 UDP 伺服节点。"""

    def __init__(
        self,
        mjcf_xml: str | None = None,
        model_path: str | Path | None = None,
        bind_host: str = "127.0.0.1",
        bind_port: int = 25000,
        controller_addr: tuple[str, int] | None = ("127.0.0.1", 25001),
        headless: bool = True,
        timestep: float = 0.002,
        auto_reply: bool = True,
    ) -> None:
        """初始化 MuJoCo 模型、安全原点与 UDP 现场总线通信接口。

        Args:
            mjcf_xml: 直接指定的 MJCF XML 字符串（若提供则优先使用）。
            model_path: 机器人 robot_model.json 路径（未指定 mjcf_xml 时自动生成）。
            bind_host: UDP 本地绑定地址。
            bind_port: UDP 本地绑定端口（设为 0 时由操作系统分配临时端口）。
            controller_addr: 默认回传 TxPDO 的目标地址 (IP, 端口)。
            headless: 是否以无头模式运行（不创建 3D 渲染视窗）。
            timestep: MuJoCo 物理积分步长。
            auto_reply: 是否自动根据最新合法收包地址更新回传目标。
        """
        home_joints_deg = HOME_JOINTS_DEG
        if mjcf_xml is not None:
            raw_xml = mjcf_xml
        else:
            if model_path is None:
                model_path = (
                    Path(__file__).resolve().parent.parent
                    / "instances"
                    / "default_cell"
                    / "config"
                    / "robot_model.json"
                )
            spec = load_robot_model(model_path)
            home_joints_deg = spec.home_joints_deg
            raw_xml = build_mujoco_xml(spec, timestep=timestep)

        self.model = mujoco.MjModel.from_xml_string(raw_xml)
        self.data = mujoco.MjData(self.model)
        self.headless = headless
        self.bind_host = bind_host
        self.bind_port = bind_port
        self.controller_addr = controller_addr
        self.auto_reply = auto_reply
        self._viewer: Any = None

        # 初始化关节角度与伺服目标为模型默认 HOME 姿态
        home_rad = np.deg2rad(home_joints_deg)
        self.data.qpos[:6] = home_rad
        if self.model.nu >= 6:
            self.data.ctrl[:6] = home_rad
        mujoco.mj_forward(self.model, self.data)

        # 状态机与看门狗变量
        self.sim_tick: int = 0
        self.last_rx_time: float = 0.0
        self.echo_seq: int = 0
        self._last_accepted_seq: int = 0
        self.control_word: int = 0
        self.q_cmd_deg = np.array(home_joints_deg, dtype=np.float64)
        self.q_hold_deg = np.array(home_joints_deg, dtype=np.float64)
        self.drives_enabled: bool = False
        self.digital_out: int = 0
        self.digital_in: int = 0
        self.fault_code: int = 0
        self.fault_active: bool = False

        # 初始化非阻塞 UDP Socket
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.sock.setblocking(False)

        # 在 Windows 平台禁用 ICMP Port Unreachable 导致的 WSAECONNRESET (10054)
        if sys.platform == "win32":
            try:
                sio_connreset = getattr(socket, "SIO_UDP_CONNRESET", 0x9800000C)
                self.sock.ioctl(sio_connreset, False)
            except (AttributeError, OSError, ValueError):
                pass

            try:
                import ctypes

                b = ctypes.c_ulong(0)
                cb = ctypes.c_ulong(0)
                ctypes.windll.ws2_32.WSAIoctl(
                    self.sock.fileno(),
                    ctypes.c_ulong(0x9800000C),
                    ctypes.byref(b),
                    ctypes.c_ulong(ctypes.sizeof(b)),
                    None,
                    ctypes.c_ulong(0),
                    ctypes.byref(cb),
                    None,
                    None,
                )
            except Exception:
                pass

        self.sock.bind((self.bind_host, self.bind_port))

        if not self.headless:
            self.start_viewer()

    @property
    def local_port(self) -> int:
        """获取当前 UDP Socket 实际绑定的本地端口。"""
        return int(self.sock.getsockname()[1])

    def start_viewer(self) -> None:
        """在被动模式下打开 MuJoCo 4.0 3D 渲染视窗。"""
        if self._viewer is None:
            self._viewer = mujoco.viewer.launch_passive(self.model, self.data)

    def is_viewer_running(self) -> bool:
        """检查 3D 视窗是否处于打开状态。"""
        return bool(self._viewer is not None and self._viewer.is_running())

    def _drain_udp_socket(self) -> None:
        """清空 UDP 接收缓冲区并提取最新合法的控制指令。"""
        latest_rx: RxPdo | None = None
        latest_addr: tuple[str, int] | None = None
        now = time.monotonic()
        is_reconnect_or_idle = (self.last_rx_time == 0.0) or (now - self.last_rx_time > WATCHDOG_TIMEOUT_SEC)

        drain_count = 0
        max_drain_packets = 128

        while drain_count < max_drain_packets:
            drain_count += 1
            try:
                data, addr = self.sock.recvfrom(512)
            except BlockingIOError:
                break
            except ConnectionResetError:
                # Windows UDP WSAECONNRESET (10054): 对端尚未监听回传端口，继续排空
                continue
            except OSError as e:
                if getattr(e, "winerror", None) == 10054:
                    continue
                if e.errno in (getattr(socket, "EAGAIN", 11), getattr(socket, "EWOULDBLOCK", 10035)):
                    break
                break

            try:
                rx = decode_rx_pdo(data)
            except PdoError:
                # 丢弃畸变损坏报文
                continue

            # 跨周期乱序报文防护与控制器重启容错：
            # 1. 连接空闲/超时重连：允许任意合法新序号 (例如控制器重启后从 1 开始)
            # 2. 序号大幅回绕：检测到从大数回跳至微小数 (如 rx.seq <= 10 且 _last_accepted_seq > 100)，判定为热重启
            # 3. 正常通信中：拒绝小于上一周期已确认序号的迟到乱序包
            is_restart = rx.seq <= 10 and self._last_accepted_seq > 100
            if not is_reconnect_or_idle and not is_restart and rx.seq < self._last_accepted_seq:
                continue

            # 本周期内仅保留最新或递增序号的数据帧
            if latest_rx is None or rx.seq >= latest_rx.seq:
                latest_rx = rx
                latest_addr = addr

        if latest_rx is not None:
            self.last_rx_time = time.monotonic()
            self._last_accepted_seq = latest_rx.seq
            self.echo_seq = latest_rx.seq
            self.control_word = latest_rx.control_word
            self.q_cmd_deg = np.array(latest_rx.q_cmd_deg, dtype=np.float64)
            self.digital_out = latest_rx.digital_out
            self.digital_in = self.digital_out  # 模拟反馈环回

            if (latest_rx.control_word & CTRL_FAULT_RESET) != 0:
                self.fault_active = False
                self.fault_code = 0

            if self.auto_reply and latest_addr is not None:
                self.controller_addr = latest_addr

    def step(self, dt_seconds: float = 0.002) -> TxPdo:
        """执行单次现场总线控制周期：抽包、看门狗逻辑、物理推进与 TxPDO 回传。

        Args:
            dt_seconds: 当前周期时长（默认 0.002s，即 500Hz）。

        Returns:
            本次周期结算后的 TxPdo 状态反馈报文。
        """
        # 1. 抽空 UDP 接收队列
        self._drain_udp_socket()

        # 2. 检查 120ms 看门狗与使能状态
        now = time.monotonic()
        age = now - self.last_rx_time
        has_recent_packet = self.last_rx_time > 0 and age <= WATCHDOG_TIMEOUT_SEC
        is_ctrl_enable = (self.control_word & CTRL_ENABLE) != 0
        is_estop_ok = (self.control_word & CTRL_ESTOP_OK) != 0

        can_drive = has_recent_packet and is_ctrl_enable and is_estop_ok and not self.fault_active

        if can_drive:
            self.drives_enabled = True
            self.q_hold_deg = np.copy(self.q_cmd_deg)
            self.data.ctrl[:6] = np.deg2rad(self.q_cmd_deg)

            # 推进 MuJoCo 物理积分
            substep_dt = float(self.model.opt.timestep)
            n_substeps = max(1, int(round(dt_seconds / substep_dt)))
            for _ in range(n_substeps):
                mujoco.mj_step(self.model, self.data)
        else:
            if self.drives_enabled:
                # 刚刚切入未使能/超时状态：抱闸动作，就地记录机械锁死位置
                self.q_hold_deg = np.rad2deg(self.data.qpos[:6])
            self.drives_enabled = False
            # 机械抱闸闭合保持：保持驻留角，速度清零并刷新几何运动学
            self.data.qpos[:6] = np.deg2rad(self.q_hold_deg)
            self.data.qvel[:6] = 0.0
            self.data.ctrl[:6] = np.deg2rad(self.q_hold_deg)
            mujoco.mj_forward(self.model, self.data)

        self.sim_tick += 1

        # 4. 采集当前实际状态
        q_act = tuple(float(x) for x in np.rad2deg(self.data.qpos[:6]))
        qd_act = tuple(float(x) for x in np.rad2deg(self.data.qvel[:6]))
        tau_act = tuple(float(x) for x in self.data.qfrc_actuator[:6])

        status_word = STAT_PLANT_READY
        if self.drives_enabled:
            status_word |= STAT_DRIVES_ENABLED
        if self.fault_active:
            status_word |= STAT_FAULT

        tx = TxPdo(
            status_word=status_word,
            echo_seq=self.echo_seq,
            sim_tick=self.sim_tick,
            q_act_deg=q_act,
            qd_act_deg_s=qd_act,
            tau_act_nm=tau_act,
            digital_in=self.digital_in,
            fault_code=self.fault_code,
        )

        # 5. 通过 UDP 向控制器回发 TxPDO
        if self.controller_addr is not None:
            try:
                self.sock.sendto(encode_tx_pdo(tx), self.controller_addr)
            except socket.error:
                pass

        # 6. 刷新 3D 视窗
        if self._viewer is not None and self._viewer.is_running():
            self._viewer.sync()

        return tx

    def run(self, cycle_time_s: float = 0.002) -> None:
        """启动主物理仿真伺服循环（直到收到退出信号或视窗关闭）。"""
        print(f"[bass-sim] MuJoCo 4.0 物理进程已启动，绑定 UDP {self.bind_host}:{self.local_port}")
        if self.controller_addr is not None:
            print(f"[bass-sim] 默认反馈目标控制器: {self.controller_addr[0]}:{self.controller_addr[1]}")
        print(f"[bass-sim] 仿真循环频率: {1.0 / cycle_time_s:.0f} Hz (周期 {cycle_time_s * 1000.0:.1f} ms)")

        try:
            next_tick = time.perf_counter()
            while True:
                if not self.headless and self._viewer is not None and not self._viewer.is_running():
                    print("[bass-sim] 3D 视窗已关闭，准备退出物理进程...")
                    break

                self.step(dt_seconds=cycle_time_s)

                next_tick += cycle_time_s
                sleep_s = next_tick - time.perf_counter()
                if sleep_s > 0:
                    time.sleep(sleep_s)
                else:
                    # 追赶节拍，避免漂移累积
                    next_tick = time.perf_counter()

        except KeyboardInterrupt:
            print("\n[bass-sim] 收到中断信号，正常终止...")
        finally:
            self.close()

    def close(self) -> None:
        """释放 3D 视窗与网络 Socket 资源。"""
        if self._viewer is not None:
            try:
                self._viewer.close()
            except Exception:
                pass
            self._viewer = None

        try:
            self.sock.close()
        except Exception:
            pass


def main() -> None:
    """CLI 入口点，支持无头或图形模式启动独立的 MuJoCo 物理仿真节点。"""
    parser = argparse.ArgumentParser(description="Bass 1.0 MuJoCo 4.0 独立物理仿真服务")
    parser.add_argument("--headless", action="store_true", help="无头模式（不启动 3D 视窗）")
    parser.add_argument("--bind-host", type=str, default="127.0.0.1", help="UDP 监听地址")
    parser.add_argument("--bind-port", type=int, default=25000, help="UDP 监听端口")
    parser.add_argument("--controller-addr", type=str, default="127.0.0.1:25001", help="控制器回发地址 (IP:Port)")
    parser.add_argument("--model-path", type=str, default=None, help="robot_model.json 配置文件路径")
    parser.add_argument("--cycle-ms", type=float, default=2.0, help="仿真控制周期 (ms)")

    args = parser.parse_args()

    ctrl_host, ctrl_port_str = args.controller_addr.split(":")
    ctrl_addr = (ctrl_host, int(ctrl_port_str))

    plant = MuJoCoUdpPlant(
        model_path=args.model_path,
        bind_host=args.bind_host,
        bind_port=args.bind_port,
        controller_addr=ctrl_addr,
        headless=args.headless,
    )
    plant.run(cycle_time_s=args.cycle_ms / 1000.0)


if __name__ == "__main__":
    main()
