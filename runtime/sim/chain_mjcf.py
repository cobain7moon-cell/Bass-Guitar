"""解析 UR5e 等 6 轴机器人 JSON 参数文件 (robot_model.json) 并基于 MuJoCo 4.0.1 MjSpec 生成仿真场景。"""

from __future__ import annotations

from dataclasses import dataclass
import json
import math
from pathlib import Path
from typing import Any
import mujoco


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


_GEOM_SHAPE_MAP: dict[str, mujoco.mjtGeom] = {
    "capsule": mujoco.mjtGeom.mjGEOM_CAPSULE,
    "cylinder": mujoco.mjtGeom.mjGEOM_CYLINDER,
    "box": mujoco.mjtGeom.mjGEOM_BOX,
    "sphere": mujoco.mjtGeom.mjGEOM_SPHERE,
}


def _mesh_asset_name(filename: str) -> str:
    return Path(filename).stem


def _apply_explicit_inertial(body: mujoco.MjsBody, inertial: InertialSpec) -> None:
    """将 JSON 标定的质量、质心与主惯量写入 MjsBody 显式惯量属性。"""
    body.explicitinertial = True
    body.ipos = list(inertial.pos_m)
    body.iquat = list(inertial.quat_wxyz)
    body.mass = inertial.mass_kg
    body.inertia = list(inertial.diaginertia)


def _add_visual_meshes(
    body: mujoco.MjsBody,
    vis_default: mujoco.MjsDefault,
    prefix: str,
    meshes: list[MeshSpec],
) -> None:
    """为刚体挂载 group=2、零质量、无碰撞的视觉网格几何体。"""
    for idx, mesh in enumerate(meshes):
        body.add_geom(
            vis_default,
            name=f"{prefix}_vis_{idx}",
            type=mujoco.mjtGeom.mjGEOM_MESH,
            meshname=_mesh_asset_name(mesh.file),
            rgba=list(mesh.rgba),
        )


def build_mujoco_spec(
    spec: RobotChainSpec,
    model_base_dir: str | Path | None = None,
    timestep: float = 0.002,
) -> mujoco.MjSpec:
    """基于 MuJoCo 4.0.1 MjSpec 程序化构建 SI 弧度制 UR5e 工作站场景（含碰撞分层与 'home' 关键帧）。"""
    resolved_base = Path(model_base_dir).resolve() if model_base_dir is not None else spec.base_dir
    if resolved_base is not None:
        mesh_dir_path = (resolved_base / spec.mesh_dir).resolve()
    else:
        mesh_dir_path = Path(spec.mesh_dir).resolve()

    mj_spec = mujoco.MjSpec()
    mj_spec.modelname = f"robot_{spec.robot_name}"
    mj_spec.compiler.degree = False
    mj_spec.compiler.meshdir = mesh_dir_path.as_posix()
    mj_spec.compiler.autolimits = True

    mj_spec.option.timestep = timestep
    mj_spec.option.integrator = mujoco.mjtIntegrator.mjINT_IMPLICITFAST
    mj_spec.option.cone = mujoco.mjtCone.mjCONE_ELLIPTIC
    mj_spec.option.impratio = 10.0
    mj_spec.option.gravity = [0.0, 0.0, -9.81]

    mj_spec.visual.headlight.diffuse = [0.7, 0.7, 0.7]
    mj_spec.visual.headlight.ambient = [0.3, 0.3, 0.3]
    mj_spec.visual.headlight.specular = [0.2, 0.2, 0.2]
    mj_spec.visual.rgba.haze = [0.15, 0.2, 0.25, 1.0]
    mj_spec.visual.global_.azimuth = 135.0
    mj_spec.visual.global_.elevation = -25.0

    # 分离 group="2" 视觉几何（零质量/无碰撞）与 group="3" 碰撞包络
    visual_def = mj_spec.add_default("visual", mj_spec.default)
    visual_def.geom.group = 2
    visual_def.geom.contype = 0
    visual_def.geom.conaffinity = 0
    visual_def.geom.density = 0.0
    visual_def.geom.mass = 0.0

    collision_def = mj_spec.add_default("collision", mj_spec.default)
    collision_def.geom.group = 3
    collision_def.geom.contype = 1
    collision_def.geom.conaffinity = 1
    collision_def.geom.condim = 4
    collision_def.geom.friction = [0.8, 0.02, 0.005]
    collision_def.geom.solref = [max(0.005, 2.0 * timestep), 1.0]
    collision_def.geom.rgba = [0.20, 0.75, 0.35, 0.50]

    mj_spec.add_texture(
        name="skybox",
        type=mujoco.mjtTexture.mjTEXTURE_SKYBOX,
        builtin=mujoco.mjtBuiltin.mjBUILTIN_GRADIENT,
        rgb1=[0.20, 0.26, 0.34],
        rgb2=[0.06, 0.08, 0.12],
        width=512,
        height=3072,
    )
    mj_spec.add_texture(
        name="groundplane",
        type=mujoco.mjtTexture.mjTEXTURE_2D,
        builtin=mujoco.mjtBuiltin.mjBUILTIN_CHECKER,
        mark=mujoco.mjtMark.mjMARK_EDGE,
        rgb1=[0.22, 0.25, 0.28],
        rgb2=[0.16, 0.18, 0.20],
        markrgb=[0.35, 0.38, 0.42],
        width=300,
        height=300,
    )
    mj_spec.add_material(
        name="groundplane",
        textures=["", "groundplane"],
        texuniform=True,
        texrepeat=[5.0, 5.0],
        reflectance=0.1,
    )

    seen_files: set[str] = set()
    for mesh in spec.base_visual.meshes + [m for joint in spec.joints for m in joint.meshes]:
        if mesh.file not in seen_files:
            seen_files.add(mesh.file)
            mj_spec.add_mesh(name=_mesh_asset_name(mesh.file), file=mesh.file)

    mj_spec.worldbody.add_light(
        name="main_light",
        pos=[1.0, -1.0, 2.2],
        dir=[-0.4, 0.4, -0.8],
        type=mujoco.mjtLightType.mjLIGHT_DIRECTIONAL,
    )
    mj_spec.worldbody.add_geom(
        name="floor",
        type=mujoco.mjtGeom.mjGEOM_PLANE,
        size=[2.0, 2.0, 0.05],
        material="groundplane",
        contype=1,
        conaffinity=1,
        group=0,
    )

    wt = spec.environment.worktable
    wt_body = mj_spec.worldbody.add_body(name="worktable", pos=list(wt.pos_m))
    wt_body.add_geom(
        visual_def,
        name="table_top_vis",
        type=mujoco.mjtGeom.mjGEOM_BOX,
        size=list(wt.half_size_m),
        rgba=[0.30, 0.34, 0.38, 0.85],
    )
    wt_body.add_geom(
        collision_def,
        name="table_top_col",
        type=mujoco.mjtGeom.mjGEOM_BOX,
        size=list(wt.half_size_m),
        rgba=[0.25, 0.55, 0.90, 0.45],
        density=0.0,
        mass=0.0,
    )

    tgt_body = mj_spec.worldbody.add_body(
        name="target_marker",
        mocap=True,
        pos=list(spec.environment.target_marker_pos_m),
    )
    tgt_body.add_site(
        name="target_site",
        type=mujoco.mjtGeom.mjGEOM_SPHERE,
        size=[0.015],
        rgba=[1.0, 0.2, 0.2, 0.50],
        group=4,
    )

    base_body = mj_spec.worldbody.add_body(
        name=spec.base_visual.body_name,
        pos=list(spec.base_transform.pos_m),
        quat=list(spec.base_transform.quat_wxyz),
    )
    _apply_explicit_inertial(base_body, spec.base_visual.inertial)
    base_body.add_geom(
        visual_def,
        name="base_pedestal_plate",
        type=mujoco.mjtGeom.mjGEOM_CYLINDER,
        pos=[0.0, 0.0, -0.008],
        size=[0.095, 0.008, 0.0],
        rgba=[0.15, 0.16, 0.18, 1.0],
    )
    _add_visual_meshes(base_body, visual_def, spec.base_visual.body_name, spec.base_visual.meshes)

    parent_body = base_body
    for joint in spec.joints:
        link_body = parent_body.add_body(
            name=joint.body_name,
            pos=list(joint.pos_m),
            quat=list(joint.quat_wxyz),
        )
        _apply_explicit_inertial(link_body, joint.inertial)

        j_min_rad = math.radians(joint.limits_deg[0])
        j_max_rad = math.radians(joint.limits_deg[1])
        link_body.add_joint(
            name=joint.name,
            type=mujoco.mjtJoint.mjJNT_HINGE,
            axis=list(joint.axis),
            range=[j_min_rad, j_max_rad],
            damping=joint.damping,
            armature=joint.armature,
        )
        _add_visual_meshes(link_body, visual_def, joint.body_name, joint.meshes)

        for ci, col in enumerate(joint.collisions):
            geom_type = _GEOM_SHAPE_MAP.get(col.shape.lower(), mujoco.mjtGeom.mjGEOM_CAPSULE)
            link_body.add_geom(
                collision_def,
                name=f"{joint.body_name}_col_{ci}",
                type=geom_type,
                size=[col.size_m[0], col.size_m[1], 0.0],
                pos=list(col.pos_m),
                quat=list(col.quat_wxyz),
                density=0.0,
                mass=0.0,
            )

        actuator = mj_spec.add_actuator(
            name=f"act_J{joint.id}",
            target=joint.name,
            trntype=mujoco.mjtTrn.mjTRN_JOINT,
        )
        actuator.set_to_position(kp=joint.kp, kv=joint.kv)
        actuator.forcelimited = True
        actuator.forcerange = [-joint.force_limit_nm, joint.force_limit_nm]
        actuator.ctrllimited = True
        actuator.ctrlrange = [j_min_rad, j_max_rad]

        parent_body = link_body

    fl = spec.flange_transform
    tx, ty, tz = (v / 1000.0 for v in spec.tcp_offset_mm)
    flange_body = parent_body.add_body(name="flange", pos=list(fl.pos_m), quat=list(fl.quat_wxyz))
    flange_body.add_geom(
        visual_def,
        name="flange_plate",
        type=mujoco.mjtGeom.mjGEOM_CYLINDER,
        pos=[0.0, 0.0, 0.004],
        size=[0.032, 0.008, 0.0],
        rgba=[0.25, 0.27, 0.30, 1.0],
    )
    flange_body.add_geom(
        visual_def,
        name="tcp_pointer",
        type=mujoco.mjtGeom.mjGEOM_CAPSULE,
        fromto=[0.0, 0.0, 0.0, tx, ty, tz],
        size=[0.007, 0.0, 0.0],
        rgba=[0.1, 0.85, 0.4, 1.0],
    )
    flange_body.add_site(
        name="tcp_site",
        pos=[tx, ty, tz],
        size=[0.012],
        rgba=[0.0, 1.0, 0.4, 0.45],
        group=4,
    )

    home_rad = [math.radians(deg) for deg in spec.home_joints_deg]
    mj_spec.add_key(name="home", qpos=home_rad, ctrl=home_rad)
    return mj_spec


def build_mujoco_xml(
    spec: RobotChainSpec,
    model_base_dir: str | Path | None = None,
    timestep: float = 0.002,
) -> str:
    """生成基于 MjSpec 的标准 MJCF XML 字符串（兼容需要 XML 文本的调用方）。"""
    return build_mujoco_spec(spec, model_base_dir=model_base_dir, timestep=timestep).to_xml()
