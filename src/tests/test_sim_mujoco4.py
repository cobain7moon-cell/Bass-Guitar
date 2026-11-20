"""MuJoCo 4.0.1 MjSpec 建模、Studio 视窗与 UDP 闭环物理仿真单元测试。"""

from __future__ import annotations

import math
from pathlib import Path
import socket
import time

import mujoco
import numpy as np
import pytest

from sim.chain_mjcf import build_mujoco_spec, build_mujoco_xml, load_robot_model
from sim.mujoco_plant import (
    CTRL_ENABLE,
    CTRL_ESTOP_OK,
    CTRL_FAULT_RESET,
    HOME_JOINTS_DEG,
    STAT_DRIVES_ENABLED,
    STAT_PLANT_READY,
    MuJoCoUdpPlant,
    RxPdo,
    TxPdo,
)

MODEL_JSON = (
    Path(__file__).resolve().parents[2]
    / "runtime"
    / "instances"
    / "default_cell"
    / "config"
    / "robot_model.json"
)


def _find_free_tcp_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("127.0.0.1", 0))
        return int(s.getsockname()[1])


def test_mujoco_version_is_4_0_1_or_newer() -> None:
    """确认运行环境已升级至 MuJoCo 4.0.1+。"""
    parts = tuple(int(x) for x in mujoco.__version__.split(".")[:3])
    assert parts >= (4, 0, 1), f"期望 mujoco>=4.0.1，实际为 {mujoco.__version__}"


def test_build_mujoco_spec_si_units_groups_and_home_keyframe() -> None:
    """校验 MjSpec 使用 SI 弧度、视觉/碰撞分层、正确执行器限位以及 HOME 关键帧。"""
    chain = load_robot_model(MODEL_JSON)
    mj_spec = build_mujoco_spec(chain, timestep=0.002)

    assert mj_spec.compiler.degree is False
    model = mj_spec.compile()
    data = mujoco.MjData(model)

    assert model.nq == 6
    assert model.nu == 6
    assert np.isclose(model.opt.timestep, 0.002)

    # 校验关节与执行器 ctrlrange 均为 SI 弧度（修复此前 degree 下 ctrlrange=-360..360 rad 问题）
    for idx, joint in enumerate(chain.joints):
        expected_min = math.radians(joint.limits_deg[0])
        expected_max = math.radians(joint.limits_deg[1])
        assert np.allclose(model.joint(joint.name).range, [expected_min, expected_max], atol=1e-6)
        assert np.allclose(model.actuator(f"act_J{joint.id}").ctrlrange, [expected_min, expected_max], atol=1e-6)

    # 校验 visual 零质量，table 与 flange 不额外掺入静态水密度质量
    assert math.isclose(float(model.body("worktable").mass[0]), 0.0, abs_tol=1e-9)
    assert math.isclose(float(model.body("flange").mass[0]), 0.0, abs_tol=1e-9)

    # 校验工作台与机械臂碰撞分层已开启真实接触过滤位
    table_col = model.geom("table_top_col")
    assert int(table_col.group[0]) == 3
    assert int(table_col.contype[0]) == 1
    assert int(table_col.conaffinity[0]) == 1

    # 校验 HOME 关键帧与 TCP 世界坐标 (-134, 492, 423) mm，无初始自碰撞
    mujoco.mj_resetDataKeyframe(model, data, model.key("home").id)
    mujoco.mj_forward(model, data)
    assert data.ncon == 0
    tcp_mm = data.site("tcp_site").xpos * 1000.0
    assert np.allclose(tcp_mm, [-134.0, 492.0, 423.0], atol=0.5)

    # 步进 0.5 秒确认数值稳定且无非预期接触
    for _ in range(250):
        mujoco.mj_step(model, data)
    assert data.ncon == 0


def test_build_mujoco_xml_roundtrip() -> None:
    """校验 build_mujoco_xml 向后兼容导出可被 MjModel 直接编译。"""
    chain = load_robot_model(MODEL_JSON)
    xml = build_mujoco_xml(chain, timestep=0.002)
    assert "<mujoco" in xml
    model = mujoco.MjModel.from_xml_string(xml)
    assert model.nq == 6
    assert model.nu == 6


def test_udp_plant_closed_loop_with_named_access() -> None:
    """校验 MuJoCoUdpPlant 基于命名访问的抱闸保持、使能运动与故障清除闭环。"""
    ctrl_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    ctrl_sock.bind(("127.0.0.1", 0))
    ctrl_sock.settimeout(1.0)
    ctrl_port = int(ctrl_sock.getsockname()[1])

    plant = MuJoCoUdpPlant(
        model_path=MODEL_JSON,
        bind_port=0,
        controller_addr=("127.0.0.1", ctrl_port),
        headless=True,
    )

    try:
        # 1. 未收包时处于抱闸保持，drives_enabled=False
        tx0 = plant.step(dt_seconds=0.002)
        assert (tx0.status_word & STAT_PLANT_READY) != 0
        assert (tx0.status_word & STAT_DRIVES_ENABLED) == 0
        assert np.allclose(tx0.q_act_deg, HOME_JOINTS_DEG, atol=1e-3)

        pkt, _ = ctrl_sock.recvfrom(512)
        decoded = TxPdo.from_bytes(pkt)
        assert decoded.sim_tick == 1

        # 2. 发送使能指令与 J1 +5° 目标，持续推演应产生真实位移
        target = (
            HOME_JOINTS_DEG[0] + 5.0,
            HOME_JOINTS_DEG[1],
            HOME_JOINTS_DEG[2],
            HOME_JOINTS_DEG[3],
            HOME_JOINTS_DEG[4],
            HOME_JOINTS_DEG[5],
        )
        for seq in range(1, 60):
            rx = RxPdo(
                control_word=CTRL_ENABLE | CTRL_ESTOP_OK,
                seq=seq,
                timestamp_ns=seq * 2_000_000,
                q_cmd_deg=target,
                digital_out=0x05,
            )
            ctrl_sock.sendto(rx.to_bytes(), ("127.0.0.1", plant.local_port))
            tx = plant.step(dt_seconds=0.002)

        assert (tx.status_word & STAT_DRIVES_ENABLED) != 0
        assert tx.digital_in == 0x05
        assert tx.q_act_deg[0] > HOME_JOINTS_DEG[0] + 0.5

        # 3. 故障复位脉冲清除 fault_active
        plant.fault_active = True
        plant.fault_code = 0x1002
        rx_rst = RxPdo(
            control_word=CTRL_ESTOP_OK | CTRL_FAULT_RESET,
            seq=100,
            timestamp_ns=200_000_000,
            q_cmd_deg=target,
            digital_out=0,
        )
        ctrl_sock.sendto(rx_rst.to_bytes(), ("127.0.0.1", plant.local_port))
        tx_rst = plant.step(dt_seconds=0.002)
        assert not plant.fault_active
        assert tx_rst.fault_code == 0
    finally:
        plant.close()
        ctrl_sock.close()


def test_studio_web_viewer_lifecycle() -> None:
    """校验 MuJoCo 4.0.1 Studio WebViewer 模式可与 MuJoCoUdpPlant 协同启动、同步并退出。"""
    port = _find_free_tcp_port()
    plant = MuJoCoUdpPlant(
        model_path=MODEL_JSON,
        bind_port=0,
        controller_addr=None,
        viewer_mode="studio-web",
        viewer_port=port,
        viewer_open_browser=False,
    )
    try:
        assert plant.is_viewer_running()
        for _ in range(10):
            plant.step(dt_seconds=0.002)
            time.sleep(0.01)
        assert plant.is_viewer_running()
    finally:
        plant.close()
        assert not plant.is_viewer_running()


def test_invalid_viewer_mode_raises() -> None:
    """校验非法 viewer_mode 会立即报错而非静默回退。"""
    with pytest.raises(ValueError, match="viewer_mode"):
        MuJoCoUdpPlant(model_path=MODEL_JSON, bind_port=0, viewer_mode="unknown-mode")
