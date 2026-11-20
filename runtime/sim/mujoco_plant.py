"""MuJoCo 4.0.1 独立物理仿真进程与二进制 UDP 现场总线服务节点。"""

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
import numpy as np

try:
    from .chain_mjcf import RobotChainSpec, build_mujoco_spec, load_robot_model
except ImportError:
    from chain_mjcf import RobotChainSpec, build_mujoco_spec, load_robot_model  # type: ignore[no-redef]

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


VALID_VIEWER_MODES: tuple[str, ...] = ("none", "classic", "studio-web", "studio-native")
VIEWER_SYNC_INTERVAL_SEC: float = 1.0 / 60.0


class MuJoCoUdpPlant:
    """基于 MuJoCo 4.0.1 的机器人物理仿真被控对象与 UDP 伺服节点。"""

    def __init__(
        self,
        mjcf_xml: str | None = None,
        mj_spec: mujoco.MjSpec | None = None,
        model_path: str | Path | None = None,
        bind_host: str = "127.0.0.1",
        bind_port: int = 25000,
        controller_addr: tuple[str, int] | None = ("127.0.0.1", 25001),
        headless: bool = True,
        viewer_mode: str | None = None,
        viewer_port: int = 8090,
        viewer_open_browser: bool = False,
        timestep: float = 0.002,
        auto_reply: bool = True,
    ) -> None:
        """初始化 MuJoCo 4.0.1 模型、安全原点与 UDP 现场总线通信接口。

        Args:
            mjcf_xml: 直接指定的 MJCF XML 字符串（优先于 model_path）。
            mj_spec: 直接指定的 MuJoCo MjSpec 对象（最高优先级）。
            model_path: 机器人 robot_model.json 路径（未指定 mj_spec/mjcf_xml 时构建 MjSpec）。
            bind_host: UDP 本地绑定地址。
            bind_port: UDP 本地绑定端口（设为 0 时由操作系统分配临时端口）。
            controller_addr: 默认回传 TxPDO 的目标地址 (IP, 端口)。
            headless: 是否以无头模式运行（当 viewer_mode 为 None 时生效）。
            viewer_mode: 视窗模式（none / classic / studio-web / studio-native）。
            viewer_port: Studio WebViewer HTTP 端口（默认 8090，避免与控制网关 :8080 冲突）。
            viewer_open_browser: 启动 studio-web 时是否自动打开浏览器。
            timestep: MuJoCo 物理积分步长。
            auto_reply: 是否自动根据最新合法收包地址更新回传目标。
        """
        resolved_mode = viewer_mode.strip().lower() if viewer_mode is not None else ("none" if headless else "classic")
        if resolved_mode not in VALID_VIEWER_MODES:
            raise ValueError(f"不支持的 viewer_mode: {resolved_mode!r} (可选: {VALID_VIEWER_MODES})")

        home_joints_deg = HOME_JOINTS_DEG
        chain_spec: RobotChainSpec | None = None
        if mj_spec is not None:
            self.spec: mujoco.MjSpec | None = mj_spec
            self.model = mj_spec.compile()
        elif mjcf_xml is not None:
            self.spec = None
            self.model = mujoco.MjModel.from_xml_string(mjcf_xml)
        else:
            if model_path is None:
                model_path = (
                    Path(__file__).resolve().parent.parent
                    / "instances"
                    / "default_cell"
                    / "config"
                    / "robot_model.json"
                )
            chain_spec = load_robot_model(model_path)
            home_joints_deg = chain_spec.home_joints_deg
            self.spec = build_mujoco_spec(chain_spec, timestep=timestep)
            self.model = self.spec.compile()

        self.data = mujoco.MjData(self.model)
        self.viewer_mode = resolved_mode
        self.headless = resolved_mode == "none"
        self.viewer_port = viewer_port
        self.viewer_open_browser = viewer_open_browser
        self.bind_host = bind_host
        self.bind_port = bind_port
        self.controller_addr = controller_addr
        self.auto_reply = auto_reply
        self._viewer: Any = None
        self._last_viewer_sync: float = 0.0

        self._joint_names = self._resolve_joint_names(chain_spec)
        self._actuator_names = self._resolve_actuator_names(chain_spec)

        # 通过 keyframe / 命名访问初始化关节角度与伺服目标为模型默认 HOME 姿态
        home_rad = np.deg2rad(home_joints_deg)
        try:
            key_id = self.model.key("home").id
            mujoco.mj_resetDataKeyframe(self.model, self.data, key_id)
        except KeyError:
            self._write_joint_positions_rad(home_rad)
            self._write_actuator_ctrl_rad(home_rad)
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

    def _resolve_joint_names(self, chain_spec: RobotChainSpec | None) -> tuple[str, ...] | None:
        if chain_spec is not None and len(chain_spec.joints) == 6:
            return tuple(j.name for j in chain_spec.joints)
        if self.model.njnt >= 6:
            names = [self.model.joint(i).name for i in range(6)]
            if all(names):
                return tuple(names)
        return None

    def _resolve_actuator_names(self, chain_spec: RobotChainSpec | None) -> tuple[str, ...] | None:
        if chain_spec is not None and len(chain_spec.joints) == 6:
            return tuple(f"act_J{j.id}" for j in chain_spec.joints)
        if self.model.nu >= 6:
            names = [self.model.actuator(i).name for i in range(6)]
            if all(names):
                return tuple(names)
        return None

    def _write_joint_positions_rad(self, q_rad: np.ndarray) -> None:
        if self._joint_names is not None:
            for idx, name in enumerate(self._joint_names):
                self.data.joint(name).qpos[0] = float(q_rad[idx])
        else:
            self.data.qpos[:6] = q_rad

    def _zero_joint_velocities(self) -> None:
        if self._joint_names is not None:
            for name in self._joint_names:
                self.data.joint(name).qvel[0] = 0.0
        else:
            self.data.qvel[:6] = 0.0

    def _write_actuator_ctrl_rad(self, ctrl_rad: np.ndarray) -> None:
        if self._actuator_names is not None:
            for idx, name in enumerate(self._actuator_names):
                self.data.actuator(name).ctrl[0] = float(ctrl_rad[idx])
        elif self.model.nu >= 6:
            self.data.ctrl[:6] = ctrl_rad

    def _read_joint_positions_deg(self) -> tuple[float, float, float, float, float, float]:
        if self._joint_names is not None:
            vals = [math.degrees(float(self.data.joint(name).qpos[0])) for name in self._joint_names]
            return (vals[0], vals[1], vals[2], vals[3], vals[4], vals[5])
        q = np.rad2deg(self.data.qpos[:6])
        return (float(q[0]), float(q[1]), float(q[2]), float(q[3]), float(q[4]), float(q[5]))

    def _read_joint_velocities_deg_s(self) -> tuple[float, float, float, float, float, float]:
        if self._joint_names is not None:
            vals = [math.degrees(float(self.data.joint(name).qvel[0])) for name in self._joint_names]
            return (vals[0], vals[1], vals[2], vals[3], vals[4], vals[5])
        qd = np.rad2deg(self.data.qvel[:6])
        return (float(qd[0]), float(qd[1]), float(qd[2]), float(qd[3]), float(qd[4]), float(qd[5]))

    def _read_actuator_torques_nm(self) -> tuple[float, float, float, float, float, float]:
        if self._actuator_names is not None:
            vals = [float(self.data.actuator(name).force[0]) for name in self._actuator_names]
            return (vals[0], vals[1], vals[2], vals[3], vals[4], vals[5])
        tau = self.data.qfrc_actuator[:6]
        return (float(tau[0]), float(tau[1]), float(tau[2]), float(tau[3]), float(tau[4]), float(tau[5]))

    @property
    def local_port(self) -> int:
        """获取当前 UDP Socket 实际绑定的本地端口。"""
        return int(self.sock.getsockname()[1])

    def start_viewer(self) -> None:
        """按配置的模式打开 MuJoCo 4.0.1 3D 渲染视窗（classic / studio-web / studio-native）。"""
        if self._viewer is not None or self.viewer_mode == "none":
            return

        if self.viewer_mode == "classic":
            import mujoco.viewer

            self._viewer = mujoco.viewer.launch_passive(self.model, self.data)
            return

        from mujoco.studio import app as studio_app
        from mujoco.studio import launch_native, launch_web, viewer_protocol

        if self.viewer_mode == "studio-web":
            cfg = viewer_protocol.ViewerConfig(
                title="Bass 1.1 - UR5e (MuJoCo 4.0.1 Studio Web)",
                width=1280,
                height=800,
                gfx="web",
                http_port=self.viewer_port,
                open_browser=self.viewer_open_browser,
            )
            handle = launch_web.launch(cfg, plugins=[studio_app.App()])
        elif self.viewer_mode == "studio-native":
            cfg = viewer_protocol.ViewerConfig(
                title="Bass 1.1 - UR5e (MuJoCo 4.0.1 Studio)",
                width=1280,
                height=800,
                gfx="opengl",
            )
            handle = launch_native.launch(cfg, plugins=[studio_app.App()])
        else:
            return

        handle.set_model(self.model, data=self.data)
        self._viewer = handle

    def is_viewer_running(self) -> bool:
        """检查 3D 视窗是否处于打开状态。"""
        return bool(self._viewer is not None and self._viewer.is_running())

    def _sync_viewer(self, now: float) -> None:
        if self._viewer is None or not self._viewer.is_running():
            return
        if now - self._last_viewer_sync < VIEWER_SYNC_INTERVAL_SEC:
            return
        self._last_viewer_sync = now
        if self.viewer_mode == "classic":
            self._viewer.sync()
        else:
            synced_model, synced_data = self._viewer.sync(self.model, self.data)
            if synced_model is not None and synced_data is not None:
                self.model, self.data = synced_model, synced_data

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
            self._write_actuator_ctrl_rad(np.deg2rad(self.q_cmd_deg))

            # 推进 MuJoCo 物理积分
            substep_dt = float(self.model.opt.timestep)
            n_substeps = max(1, int(round(dt_seconds / substep_dt)))
            for _ in range(n_substeps):
                mujoco.mj_step(self.model, self.data)
        else:
            if self.drives_enabled:
                # 刚刚切入未使能/超时状态：抱闸动作，就地记录机械锁死位置
                self.q_hold_deg = np.array(self._read_joint_positions_deg(), dtype=np.float64)
            self.drives_enabled = False
            # 机械抱闸闭合保持：保持驻留角，速度清零并刷新几何运动学
            hold_rad = np.deg2rad(self.q_hold_deg)
            self._write_joint_positions_rad(hold_rad)
            self._zero_joint_velocities()
            self._write_actuator_ctrl_rad(hold_rad)
            mujoco.mj_forward(self.model, self.data)

        self.sim_tick += 1

        # 4. 采集当前实际状态（基于命名访问）
        q_act = self._read_joint_positions_deg()
        qd_act = self._read_joint_velocities_deg_s()
        tau_act = self._read_actuator_torques_nm()

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

        # 6. 按约 60Hz 节流刷新 3D 视窗
        self._sync_viewer(time.monotonic())

        return tx

    def run(self, cycle_time_s: float = 0.002) -> None:
        """启动主物理仿真伺服循环（直到收到退出信号或视窗关闭）。"""
        print(
            f"[bass-sim] MuJoCo {mujoco.__version__} 物理进程已启动，"
            f"绑定 UDP {self.bind_host}:{self.local_port} (视窗模式: {self.viewer_mode})"
        )
        if self.viewer_mode == "studio-web":
            print(f"[bass-sim] Studio WebViewer 地址: http://localhost:{self.viewer_port}/")
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
    """CLI 入口点，支持无头、经典桌面或 Studio WebViewer 模式启动独立的 MuJoCo 物理仿真节点。"""
    parser = argparse.ArgumentParser(description="Bass 1.1 MuJoCo 4.0.1 外部独立物理仿真服务")
    parser.add_argument("--headless", action="store_true", help="无头模式（覆盖 --viewer-mode 为 none）")
    parser.add_argument(
        "--viewer-mode",
        type=str,
        default="classic",
        choices=("classic", "studio-web", "studio-native", "none"),
        help="3D 视窗模式（默认 classic；studio-web 启动 MuJoCo 4.0.1 WebViewer）",
    )
    parser.add_argument("--viewer-port", type=int, default=8090, help="Studio WebViewer 监听端口")
    parser.add_argument("--viewer-open-browser", action="store_true", help="studio-web 模式下自动打开浏览器")
    parser.add_argument("--bind-host", type=str, default="127.0.0.1", help="UDP 监听地址")
    parser.add_argument("--bind-port", type=int, default=25000, help="UDP 监听端口")
    parser.add_argument("--controller-addr", type=str, default="127.0.0.1:25001", help="控制器回发地址 (IP:Port)")
    parser.add_argument("--model-path", type=str, default=None, help="robot_model.json 配置文件路径")
    parser.add_argument("--cycle-ms", type=float, default=2.0, help="仿真控制周期 (ms)")

    args = parser.parse_args()

    ctrl_host, ctrl_port_str = args.controller_addr.split(":")
    ctrl_addr = (ctrl_host, int(ctrl_port_str))
    viewer_mode = "none" if args.headless else args.viewer_mode

    plant = MuJoCoUdpPlant(
        model_path=args.model_path,
        bind_host=args.bind_host,
        bind_port=args.bind_port,
        controller_addr=ctrl_addr,
        headless=args.headless,
        viewer_mode=viewer_mode,
        viewer_port=args.viewer_port,
        viewer_open_browser=args.viewer_open_browser,
    )
    plant.run(cycle_time_s=args.cycle_ms / 1000.0)


if __name__ == "__main__":
    main()
