"""解析 UR5e 等 6 轴机器人 JSON 参数文件 (robot_model.json) 并生成 MuJoCo 4.0.0 MJCF 仿真场景。"""

from __future__ import annotations

from dataclasses import dataclass
import json
import math
from pathlib import Path
from typing import Any


@dataclass(frozen=True)
class FrameTransform:
    """三维刚体变换（位置单位 mm，四元数顺序 w, x, y, z）。"""

    pos_mm: tuple[float, float, float]
    quat_wxyz: tuple[float, float, float, float]

    @property
    def pos_m(self) -> tuple[float, float, float]:
        """转换为 MuJoCo 使用的米制坐标。"""
        return (self.pos_mm[0] / 1000.0, self.pos_mm[1] / 1000.0, self.pos_mm[2] / 1000.0)


@dataclass(frozen=True)
class MeshSpec:
    """视觉网格文件与材质颜色配置。"""

    file: str
    rgba: tuple[float, float, float, float]


@dataclass(frozen=True)
class InertialSpec:
    """连杆惯量参数（质量 kg、质心 mm、主惯量 kg·m²）。"""

    mass_kg: float
    pos_mm: tuple[float, float, float]
    quat_wxyz: tuple[float, float, float, float]
    diaginertia: tuple[float, float, float]

    @property
    def pos_m(self) -> tuple[float, float, float]:
        return (self.pos_mm[0] / 1000.0, self.pos_mm[1] / 1000.0, self.pos_mm[2] / 1000.0)


@dataclass(frozen=True)
class CollisionSpec:
    """简化碰撞包络几何体配置。"""

    shape: str
    radius_mm: float
    half_length_mm: float
    pos_mm: tuple[float, float, float]
    quat_wxyz: tuple[float, float, float, float]

    @property
    def pos_m(self) -> tuple[float, float, float]:
        return (self.pos_mm[0] / 1000.0, self.pos_mm[1] / 1000.0, self.pos_mm[2] / 1000.0)

    @property
    def size_m(self) -> tuple[float, float]:
        return (self.radius_mm / 1000.0, self.half_length_mm / 1000.0)


@dataclass(frozen=True)
class BaseVisualSpec:
    """基座连杆惯量与视觉网格。"""

    body_name: str
    inertial: InertialSpec
    meshes: list[MeshSpec]


@dataclass(frozen=True)
class JointSpec:
    """单轴关节动力学、运动学与视觉网格描述。"""

    id: int
    name: str
    body_name: str
    pos_mm: tuple[float, float, float]
    quat_wxyz: tuple[float, float, float, float]
    axis: tuple[float, float, float]
    limits_deg: tuple[float, float]
    armature: float
    damping: float
    kp: float
    kv: float
    force_limit_nm: float
    inertial: InertialSpec
    meshes: list[MeshSpec]
    collisions: list[CollisionSpec]

    @property
    def pos_m(self) -> tuple[float, float, float]:
        return (self.pos_mm[0] / 1000.0, self.pos_mm[1] / 1000.0, self.pos_mm[2] / 1000.0)


@dataclass(frozen=True)
class WorktableSpec:
    """工作台几何位置与半尺寸（单位 mm）。"""

    pos_mm: tuple[float, float, float]
    half_size_mm: tuple[float, float, float]

    @property
    def pos_m(self) -> tuple[float, float, float]:
        return (self.pos_mm[0] / 1000.0, self.pos_mm[1] / 1000.0, self.pos_mm[2] / 1000.0)

    @property
    def half_size_m(self) -> tuple[float, float, float]:
        return (
            self.half_size_mm[0] / 1000.0,
            self.half_size_mm[1] / 1000.0,
            self.half_size_mm[2] / 1000.0,
        )


@dataclass(frozen=True)
class EnvironmentSpec:
    """工作站场景参考物体（工作台与目标点标记）。"""

    worktable: WorktableSpec
    target_marker_pos_mm: tuple[float, float, float]

    @property
    def target_marker_pos_m(self) -> tuple[float, float, float]:
        return (
            self.target_marker_pos_mm[0] / 1000.0,
            self.target_marker_pos_mm[1] / 1000.0,
            self.target_marker_pos_mm[2] / 1000.0,
        )


@dataclass(frozen=True)
class RobotChainSpec:
    """从 robot_model.json 解析出的完整 6 轴开源机器人模型参数。"""

    schema_version: int
    robot_name: str
    license: str
    license_file: str
    mesh_dir: str
    base_dir: Path | None
    base_transform: FrameTransform
    flange_transform: FrameTransform
    tcp_offset_mm: tuple[float, float, float]
    home_joints_deg: tuple[float, float, float, float, float, float]
    base_visual: BaseVisualSpec
    joints: list[JointSpec]
    environment: EnvironmentSpec


RobotModelSpec = RobotChainSpec


def _parse_float_tuple(raw: Any, expected_len: int, field_name: str) -> tuple[float, ...]:
    if not isinstance(raw, list) or len(raw) != expected_len:
        raise ValueError(f"字段 {field_name} 必须是长度为 {expected_len} 的数值数组")
    values: list[float] = []
    for item in raw:
        if not isinstance(item, (int, float)) or isinstance(item, bool):
            raise ValueError(f"字段 {field_name} 包含非数值元素: {item!r}")
        val = float(item)
        if not math.isfinite(val):
            raise ValueError(f"字段 {field_name} 包含非有限浮点值: {item!r}")
        values.append(val)
    return tuple(values)


def _normalize_quat(q: tuple[float, float, float, float], field_name: str) -> tuple[float, float, float, float]:
    norm = math.sqrt(sum(c * c for c in q))
    if norm <= 1e-9:
        raise ValueError(f"四元数 {field_name} 模长为零")
    return (q[0] / norm, q[1] / norm, q[2] / norm, q[3] / norm)


def _parse_frame(raw: dict[str, Any], name: str) -> FrameTransform:
    pos = _parse_float_tuple(raw["pos_mm"], 3, f"{name}.pos_mm")
    quat = _normalize_quat(_parse_float_tuple(raw["quat_wxyz"], 4, f"{name}.quat_wxyz"), f"{name}.quat_wxyz")  # type: ignore[arg-type]
    return FrameTransform(pos_mm=pos, quat_wxyz=quat)  # type: ignore[arg-type]


def _parse_inertial(raw: dict[str, Any], name: str) -> InertialSpec:
    mass = float(raw["mass_kg"])
    if not math.isfinite(mass) or mass <= 0.0:
        raise ValueError(f"{name}.mass_kg 必须大于 0")
    pos = _parse_float_tuple(raw["pos_mm"], 3, f"{name}.pos_mm")
    quat_raw = raw.get("quat_wxyz", [1.0, 0.0, 0.0, 0.0])
    quat = _normalize_quat(_parse_float_tuple(quat_raw, 4, f"{name}.quat_wxyz"), f"{name}.quat_wxyz")  # type: ignore[arg-type]
    diag = _parse_float_tuple(raw["diaginertia"], 3, f"{name}.diaginertia")
    return InertialSpec(
        mass_kg=mass,
        pos_mm=pos,  # type: ignore[arg-type]
        quat_wxyz=quat,
        diaginertia=diag,  # type: ignore[arg-type]
    )


def _parse_meshes(raw_list: list[dict[str, Any]], name: str) -> list[MeshSpec]:
    meshes: list[MeshSpec] = []
    for idx, item in enumerate(raw_list):
        rgba = _parse_float_tuple(item["rgba"], 4, f"{name}[{idx}].rgba")
        meshes.append(MeshSpec(file=str(item["file"]), rgba=rgba))  # type: ignore[arg-type]
    return meshes


def _parse_collisions(raw_list: list[dict[str, Any]], name: str) -> list[CollisionSpec]:
    collisions: list[CollisionSpec] = []
    for idx, item in enumerate(raw_list):
        pos = _parse_float_tuple(item["pos_mm"], 3, f"{name}[{idx}].pos_mm")
        quat = _normalize_quat(
            _parse_float_tuple(item.get("quat_wxyz", [1.0, 0.0, 0.0, 0.0]), 4, f"{name}[{idx}].quat_wxyz"),  # type: ignore[arg-type]
            f"{name}[{idx}].quat_wxyz",
        )
        collisions.append(
            CollisionSpec(
                shape=str(item.get("shape", "capsule")),
                radius_mm=float(item["radius_mm"]),
                half_length_mm=float(item["half_length_mm"]),
                pos_mm=pos,  # type: ignore[arg-type]
                quat_wxyz=quat,
            )
        )
    return collisions


def load_robot_model(json_path: str | Path) -> RobotChainSpec:
    """读取并校验 JSON 机器人模型配置文件 (robot_model.json)。"""
    path = Path(json_path).resolve()
    raw = json.loads(path.read_text(encoding="utf-8"))

    schema_version = int(raw["schema_version"])
    if schema_version != 1:
        raise ValueError(f"不支持的 robot_model.json schema_version: {schema_version}")

    raw_joints = raw.get("joints", [])
    if len(raw_joints) != 6:
        raise ValueError(f"预期 6 个串联关节，实际解析到 {len(raw_joints)} 个")

    joints: list[JointSpec] = []
    for idx, item in enumerate(raw_joints):
        prefix = f"joints[{idx}]"
        pos = _parse_float_tuple(item["pos_mm"], 3, f"{prefix}.pos_mm")
        quat = _normalize_quat(_parse_float_tuple(item["quat_wxyz"], 4, f"{prefix}.quat_wxyz"), f"{prefix}.quat_wxyz")  # type: ignore[arg-type]
        axis_raw = _parse_float_tuple(item["axis"], 3, f"{prefix}.axis")
        axis_norm = math.sqrt(sum(v * v for v in axis_raw))
        if axis_norm <= 1e-6:
            raise ValueError(f"{prefix}.axis 不能为零向量")
        axis = (axis_raw[0] / axis_norm, axis_raw[1] / axis_norm, axis_raw[2] / axis_norm)

        limits = _parse_float_tuple(item["limits_deg"], 2, f"{prefix}.limits_deg")
        if limits[0] > limits[1]:
            raise ValueError(f"{prefix}.limits_deg 下限 {limits[0]} 大于上限 {limits[1]}")

        joints.append(
            JointSpec(
                id=int(item["id"]),
                name=str(item["name"]),
                body_name=str(item["body_name"]),
                pos_mm=pos,  # type: ignore[arg-type]
                quat_wxyz=quat,
                axis=axis,
                limits_deg=limits,  # type: ignore[arg-type]
                armature=float(item["armature"]),
                damping=float(item["damping"]),
                kp=float(item["kp"]),
                kv=float(item["kv"]),
                force_limit_nm=float(item["force_limit_nm"]),
                inertial=_parse_inertial(item["inertial"], f"{prefix}.inertial"),
                meshes=_parse_meshes(item.get("meshes", []), f"{prefix}.meshes"),
                collisions=_parse_collisions(item.get("collisions", []), f"{prefix}.collisions"),
            )
        )

    base_visual_raw = raw["base_visual"]
    base_visual = BaseVisualSpec(
        body_name=str(base_visual_raw.get("body_name", "base")),
        inertial=_parse_inertial(base_visual_raw["inertial"], "base_visual.inertial"),
        meshes=_parse_meshes(base_visual_raw.get("meshes", []), "base_visual.meshes"),
    )

    env_raw = raw.get("environment", {})
    wt_raw = env_raw.get("worktable", {"pos_mm": [-150.0, 480.0, 160.0], "half_size_mm": [280.0, 280.0, 15.0]})
    env = EnvironmentSpec(
        worktable=WorktableSpec(
            pos_mm=_parse_float_tuple(wt_raw["pos_mm"], 3, "environment.worktable.pos_mm"),  # type: ignore[arg-type]
            half_size_mm=_parse_float_tuple(wt_raw["half_size_mm"], 3, "environment.worktable.half_size_mm"),  # type: ignore[arg-type]
        ),
        target_marker_pos_mm=_parse_float_tuple(
            env_raw.get("target_marker_pos_mm", [-134.0, 492.0, 423.0]),
            3,
            "environment.target_marker_pos_mm",
        ),  # type: ignore[arg-type]
    )

    return RobotChainSpec(
        schema_version=schema_version,
        robot_name=str(raw["robot_name"]),
        license=str(raw["license"]),
        license_file=str(raw["license_file"]),
        mesh_dir=str(raw["mesh_dir"]),
        base_dir=path.parent.parent,
        base_transform=_parse_frame(raw["base_transform"], "base_transform"),
        flange_transform=_parse_frame(raw["flange_transform"], "flange_transform"),
        tcp_offset_mm=_parse_float_tuple(raw["tcp_offset_mm"], 3, "tcp_offset_mm"),  # type: ignore[arg-type]
        home_joints_deg=_parse_float_tuple(raw["home_joints_deg"], 6, "home_joints_deg"),  # type: ignore[arg-type]
        base_visual=base_visual,
        joints=joints,
        environment=env,
    )


def _fmt_vec(vals: tuple[float, ...]) -> str:
    return " ".join(f"{v:.7f}" for v in vals)


def _mesh_asset_name(filename: str) -> str:
    return Path(filename).stem


def build_mujoco_xml(
    spec: RobotChainSpec,
    model_base_dir: str | Path | None = None,
    timestep: float = 0.002,
) -> str:
    """根据 RobotChainSpec 生成包含 UR5e OBJ 视觉网格与伺服执行器的 MuJoCo 4.0 MJCF XML。"""
    resolved_base = Path(model_base_dir).resolve() if model_base_dir is not None else spec.base_dir
    if resolved_base is not None:
        mesh_dir_path = (resolved_base / spec.mesh_dir).resolve()
    else:
        mesh_dir_path = Path(spec.mesh_dir).resolve()

    # 收集去重后的所有视觉网格文件名
    mesh_files: list[str] = []
    seen_files: set[str] = set()
    for mesh in spec.base_visual.meshes:
        if mesh.file not in seen_files:
            seen_files.add(mesh.file)
            mesh_files.append(mesh.file)
    for joint in spec.joints:
        for mesh in joint.meshes:
            if mesh.file not in seen_files:
                seen_files.add(mesh.file)
                mesh_files.append(mesh.file)

    mesh_assets_xml = "\n".join(
        f'    <mesh name="{_mesh_asset_name(fname)}" file="{fname}"/>' for fname in mesh_files
    )

    def build_link_tree(idx: int, indent: int) -> str:
        pad = " " * indent
        joint = spec.joints[idx]
        j_min, j_max = joint.limits_deg

        lines = [
            f'{pad}<body name="{joint.body_name}" pos="{_fmt_vec(joint.pos_m)}" quat="{_fmt_vec(joint.quat_wxyz)}">',
            (
                f'{pad}  <inertial pos="{_fmt_vec(joint.inertial.pos_m)}" '
                f'quat="{_fmt_vec(joint.inertial.quat_wxyz)}" '
                f'mass="{joint.inertial.mass_kg:.6f}" '
                f'diaginertia="{_fmt_vec(joint.inertial.diaginertia)}"/>'
            ),
            (
                f'{pad}  <joint name="{joint.name}" type="hinge" axis="{_fmt_vec(joint.axis)}" '
                f'range="{j_min:.2f} {j_max:.2f}" damping="{joint.damping:.4f}" armature="{joint.armature:.4f}"/>'
            ),
        ]

        for mesh in joint.meshes:
            lines.append(
                f'{pad}  <geom type="mesh" mesh="{_mesh_asset_name(mesh.file)}" '
                f'rgba="{_fmt_vec(mesh.rgba)}" contype="0" conaffinity="0" group="2"/>'
            )

        for col in joint.collisions:
            lines.append(
                f'{pad}  <geom type="{col.shape}" size="{col.size_m[0]:.4f} {col.size_m[1]:.4f}" '
                f'pos="{_fmt_vec(col.pos_m)}" quat="{_fmt_vec(col.quat_wxyz)}" '
                f'rgba="0.6 0.6 0.6 0.15" contype="0" conaffinity="0" group="3"/>'
            )

        if idx < 5:
            lines.append(build_link_tree(idx + 1, indent + 2))
        else:
            fl = spec.flange_transform
            tx, ty, tz = (
                spec.tcp_offset_mm[0] / 1000.0,
                spec.tcp_offset_mm[1] / 1000.0,
                spec.tcp_offset_mm[2] / 1000.0,
            )
            lines.extend(
                [
                    f'{pad}  <body name="flange" pos="{_fmt_vec(fl.pos_m)}" quat="{_fmt_vec(fl.quat_wxyz)}">',
                    (
                        f'{pad}    <geom name="flange_plate" type="cylinder" size="0.032 0.008" '
                        f'pos="0 0 0.004" rgba="0.25 0.27 0.30 1" contype="0" conaffinity="0" group="2"/>'
                    ),
                    (
                        f'{pad}    <geom name="tcp_pointer" type="capsule" fromto="0 0 0 {tx:.5f} {ty:.5f} {tz:.5f}" '
                        f'size="0.007" rgba="0.1 0.85 0.4 1" contype="0" conaffinity="0" group="2"/>'
                    ),
                    (
                        f'{pad}    <site name="tcp_site" pos="{tx:.5f} {ty:.5f} {tz:.5f}" '
                        f'size="0.012" rgba="0.0 1.0 0.4 1"/>'
                    ),
                    f"{pad}  </body>",
                ]
            )

        lines.append(f"{pad}</body>")
        return "\n".join(lines)

    body_tree = build_link_tree(0, 6)

    base_meshes_xml = "\n".join(
        f'      <geom type="mesh" mesh="{_mesh_asset_name(m.file)}" rgba="{_fmt_vec(m.rgba)}" '
        f'contype="0" conaffinity="0" group="2"/>'
        for m in spec.base_visual.meshes
    )

    actuators: list[str] = []
    for joint in spec.joints:
        j_min, j_max = joint.limits_deg
        f_lim = joint.force_limit_nm
        actuators.append(
            f'    <position name="act_J{joint.id}" joint="{joint.name}" kp="{joint.kp:.1f}" kv="{joint.kv:.1f}" '
            f'forcerange="-{f_lim:.1f} {f_lim:.1f}" ctrlrange="{j_min:.2f} {j_max:.2f}"/>'
        )
    actuators_xml = "\n".join(actuators)

    wt = spec.environment.worktable
    tgt_pos_m = spec.environment.target_marker_pos_m

    return f"""<mujoco model="robot_{spec.robot_name}">
  <compiler angle="degree" coordinate="local" meshdir="{mesh_dir_path.as_posix()}"/>
  <option timestep="{timestep:.4f}" integrator="implicitfast" gravity="0 0 -9.81"/>

  <visual>
    <headlight diffuse="0.7 0.7 0.7" ambient="0.3 0.3 0.3" specular="0.2 0.2 0.2"/>
    <rgba haze="0.15 0.2 0.25 1"/>
    <global azimuth="135" elevation="-25"/>
  </visual>

  <asset>
    <texture type="skybox" builtin="gradient" rgb1="0.20 0.26 0.34" rgb2="0.06 0.08 0.12"
             width="512" height="3072"/>
    <texture type="2d" name="groundplane" builtin="checker" mark="edge" rgb1="0.22 0.25 0.28"
             rgb2="0.16 0.18 0.20" markrgb="0.35 0.38 0.42" width="300" height="300"/>
    <material name="groundplane" texture="groundplane" texuniform="true" texrepeat="5 5" reflectance="0.1"/>
{mesh_assets_xml}
  </asset>

  <worldbody>
    <light pos="1.0 -1.0 2.2" dir="-0.4 0.4 -0.8" directional="true"/>
    <geom name="floor" size="2.0 2.0 0.05" type="plane" material="groundplane" contype="0" conaffinity="0"/>

    <!-- 工作台参考面 -->
    <body name="worktable" pos="{_fmt_vec(wt.pos_m)}">
      <geom name="table_top" type="box" size="{_fmt_vec(wt.half_size_m)}" rgba="0.30 0.34 0.38 0.85"
            contype="0" conaffinity="0"/>
    </body>

    <!-- 目标点可视化球体 -->
    <body name="target_marker" mocap="true" pos="{_fmt_vec(tgt_pos_m)}">
      <site name="target_site" type="sphere" size="0.015" rgba="1.0 0.2 0.2 0.85"/>
    </body>

    <!-- 开源 {spec.robot_name} ({spec.license}) 基座 -->
    <body name="{spec.base_visual.body_name}" pos="{_fmt_vec(spec.base_transform.pos_m)}"
          quat="{_fmt_vec(spec.base_transform.quat_wxyz)}">
      <inertial pos="{_fmt_vec(spec.base_visual.inertial.pos_m)}"
                quat="{_fmt_vec(spec.base_visual.inertial.quat_wxyz)}"
                mass="{spec.base_visual.inertial.mass_kg:.6f}"
                diaginertia="{_fmt_vec(spec.base_visual.inertial.diaginertia)}"/>
      <geom name="base_pedestal_plate" type="cylinder" pos="0 0 -0.008" size="0.095 0.008"
            rgba="0.15 0.16 0.18 1" contype="0" conaffinity="0" group="2"/>
{base_meshes_xml}
{body_tree}
    </body>
  </worldbody>

  <actuator>
{actuators_xml}
  </actuator>
</mujoco>
"""
