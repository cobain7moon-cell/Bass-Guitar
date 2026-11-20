//! # MuJoCo 4.0.1 C FFI 内置物理引擎驱动
//!
//! 通过动态加载 `mujoco.dll`（或对应平台的 `libmujoco` 动态库）直接在 `bass-core` 进程内
//! 运行 UR5e 6 轴机械臂的刚体动力学与碰撞闭环，并实现 [`FieldbusTransport`] 接口供实时运动引擎直接调度。

use crate::{FieldbusTransport, HalError};
use bass_types::{
    RxPdo, TxPdo, CTRL_ENABLE, CTRL_ESTOP_OK, CTRL_FAULT_RESET, STAT_DRIVES_ENABLED, STAT_FAULT,
    STAT_PLANT_READY,
};
use serde::Deserialize;
use std::ffi::{CStr, CString};
use std::os::raw::{c_char, c_int, c_void};
use std::path::{Path, PathBuf};
use std::ptr;
use std::sync::Arc;

/// MuJoCo 4.0.1 头文件对应的版本号 (`mj_version()`)
pub const MUJOCO_EXPECTED_VERSION: i32 = 4_000_001;

const MJOBJ_JOINT: c_int = 3;
const MJOBJ_ACTUATOR: c_int = 19;
const MJOBJ_KEY: c_int = 24;

const CTRL_CYCLE_DT_S: f64 = 0.002;
const FAULT_INVALID_CMD: u32 = 0x2001;
const FAULT_SIM_NUMERIC: u32 = 0x2002;

// ---------------------------------------------------------------------------
// 已验证的 MuJoCo 4.0.1 x86_64 C 结构体字节偏移（已在 mujoco.dll 4.0.1 实机核验）
// ---------------------------------------------------------------------------
const MJMODEL_OFFSET_NQ: usize = 0;
const MJMODEL_OFFSET_OPT_TIMESTEP: usize = 792;
const MJMODEL_OFFSET_JNT_QPOSADR: usize = 2112;
const MJMODEL_OFFSET_JNT_DOFADR: usize = 2120;

const MJDATA_OFFSET_QPOS: usize = 160_688;
const MJDATA_OFFSET_QVEL: usize = 160_696;
const MJDATA_OFFSET_CTRL: usize = 160_744;
const MJDATA_OFFSET_ACTUATOR_FORCE: usize = 161_416;

#[repr(C)]
struct MjSpec {
    _private: [u8; 0],
}

#[repr(C)]
struct MjModel {
    _private: [u8; 0],
}

#[repr(C)]
struct MjData {
    _private: [u8; 0],
}

#[repr(C)]
struct MjVfs {
    _private: [u8; 0],
}

// ---------------------------------------------------------------------------
// robot_model.json 反序列化结构（生成 SI 弧度制 MJCF）
// ---------------------------------------------------------------------------

#[derive(Debug, Deserialize)]
struct RobotModelJson {
    robot_name: String,
    home_joints_deg: [f64; 6],
    base_transform: FrameTransformJson,
    flange_transform: FrameTransformJson,
    #[serde(default)]
    tcp_offset_mm: [f64; 3],
    base_visual: BaseVisualJson,
    joints: Vec<JointJson>,
    #[serde(default)]
    environment: EnvironmentJson,
}

#[derive(Debug, Deserialize)]
struct FrameTransformJson {
    pos_mm: [f64; 3],
    quat_wxyz: [f64; 4],
}

#[derive(Debug, Deserialize)]
struct InertialJson {
    mass_kg: f64,
    pos_mm: [f64; 3],
    quat_wxyz: [f64; 4],
    diaginertia: [f64; 3],
}

#[derive(Debug, Deserialize)]
struct CollisionJson {
    shape: String,
    radius_mm: f64,
    #[serde(default)]
    half_length_mm: f64,
    pos_mm: [f64; 3],
    quat_wxyz: [f64; 4],
}

#[derive(Debug, Deserialize)]
struct BaseVisualJson {
    #[serde(default = "default_base_name")]
    body_name: String,
    inertial: InertialJson,
}

fn default_base_name() -> String {
    "base".to_string()
}

#[derive(Debug, Deserialize)]
struct JointJson {
    id: u32,
    name: String,
    body_name: String,
    pos_mm: [f64; 3],
    quat_wxyz: [f64; 4],
    axis: [f64; 3],
    limits_deg: [f64; 2],
    armature: f64,
    damping: f64,
    kp: f64,
    kv: f64,
    force_limit_nm: f64,
    inertial: InertialJson,
    #[serde(default)]
    collisions: Vec<CollisionJson>,
}

#[derive(Debug, Deserialize, Default)]
struct EnvironmentJson {
    #[serde(default)]
    worktable: WorktableJson,
}

#[derive(Debug, Deserialize)]
struct WorktableJson {
    pos_mm: [f64; 3],
    half_size_mm: [f64; 3],
}

impl Default for WorktableJson {
    fn default() -> Self {
        Self {
            pos_mm: [-150.0, 480.0, 160.0],
            half_size_mm: [280.0, 280.0, 15.0],
        }
    }
}

fn xml_escape(input: &str) -> String {
    let mut out = String::with_capacity(input.len());
    for ch in input.chars() {
        match ch {
            '&' => out.push_str("&amp;"),
            '<' => out.push_str("&lt;"),
            '>' => out.push_str("&gt;"),
            '"' => out.push_str("&quot;"),
            '\'' => out.push_str("&apos;"),
            _ => out.push(ch),
        }
    }
    out
}

fn fmt3(v: [f64; 3]) -> String {
    format!("{:.9} {:.9} {:.9}", v[0], v[1], v[2])
}

fn fmt4(v: [f64; 4]) -> String {
    format!("{:.12} {:.12} {:.12} {:.12}", v[0], v[1], v[2], v[3])
}

fn mm_to_m3(v: [f64; 3]) -> [f64; 3] {
    [v[0] * 0.001, v[1] * 0.001, v[2] * 0.001]
}

fn push_inertial_xml(out: &mut String, indent: &str, in_spec: &InertialJson) {
    let pos = mm_to_m3(in_spec.pos_mm);
    out.push_str(&format!(
        "{indent}<inertial pos=\"{}\" quat=\"{}\" mass=\"{:.9}\" diaginertia=\"{}\"/>\n",
        fmt3(pos),
        fmt4(in_spec.quat_wxyz),
        in_spec.mass_kg,
        fmt3(in_spec.diaginertia)
    ));
}

/// 从 `robot_model.json` 构建 SI 弧度制无头 MJCF XML（含碰撞包络、关节驱动与 `home` 关键帧）
fn build_headless_mjcf_from_json(raw_json: &str, timestep_s: f64) -> Result<(String, RobotModelJson), HalError> {
    let model: RobotModelJson = serde_json::from_str(raw_json)
        .map_err(|e| HalError::Mujoco(format!("解析 robot_model.json 失败: {e}")))?;
    if model.joints.len() != 6 {
        return Err(HalError::Mujoco(format!(
            "期望 6 个关节定义，实际为 {}",
            model.joints.len()
        )));
    }

    let solref0 = (2.0 * timestep_s).max(0.005);
    let mut xml = String::with_capacity(4096);
    xml.push_str(&format!(
        "<mujoco model=\"robot_{}\">\n",
        xml_escape(&model.robot_name)
    ));
    xml.push_str("  <compiler angle=\"radian\" autolimits=\"true\"/>\n");
    xml.push_str(&format!(
        "  <option timestep=\"{:.6}\" integrator=\"implicitfast\" cone=\"elliptic\" impratio=\"10.0\" gravity=\"0 0 -9.81\"/>\n",
        timestep_s
    ));
    xml.push_str("  <default>\n");
    xml.push_str("    <default class=\"collision\">\n");
    xml.push_str(&format!(
        "      <geom group=\"3\" contype=\"1\" conaffinity=\"1\" condim=\"4\" friction=\"0.8 0.02 0.005\" solref=\"{:.6} 1\"/>\n",
        solref0
    ));
    xml.push_str("    </default>\n");
    xml.push_str("  </default>\n");

    xml.push_str("  <worldbody>\n");
    xml.push_str(
        "    <geom name=\"floor\" type=\"plane\" size=\"2 2 0.05\" contype=\"1\" conaffinity=\"1\" group=\"0\"/>\n",
    );

    let wt_pos = mm_to_m3(model.environment.worktable.pos_mm);
    let wt_size = mm_to_m3(model.environment.worktable.half_size_mm);
    xml.push_str(&format!(
        "    <body name=\"worktable\" pos=\"{}\">\n",
        fmt3(wt_pos)
    ));
    xml.push_str(&format!(
        "      <geom name=\"table_top_col\" class=\"collision\" type=\"box\" size=\"{}\"/>\n",
        fmt3(wt_size)
    ));
    xml.push_str("    </body>\n");

    let base_pos = mm_to_m3(model.base_transform.pos_mm);
    xml.push_str(&format!(
        "    <body name=\"{}\" pos=\"{}\" quat=\"{}\">\n",
        xml_escape(&model.base_visual.body_name),
        fmt3(base_pos),
        fmt4(model.base_transform.quat_wxyz)
    ));
    push_inertial_xml(&mut xml, "      ", &model.base_visual.inertial);

    for (idx, j) in model.joints.iter().enumerate() {
        let indent = "  ".repeat(4 + idx);
        let pos = mm_to_m3(j.pos_mm);
        xml.push_str(&format!(
            "{indent}<body name=\"{}\" pos=\"{}\" quat=\"{}\">\n",
            xml_escape(&j.body_name),
            fmt3(pos),
            fmt4(j.quat_wxyz)
        ));
        push_inertial_xml(&mut xml, &format!("{indent}  "), &j.inertial);
        let r0 = j.limits_deg[0].to_radians();
        let r1 = j.limits_deg[1].to_radians();
        xml.push_str(&format!(
            "{indent}  <joint name=\"{}\" type=\"hinge\" axis=\"{}\" range=\"{:.9} {:.9}\" damping=\"{:.9}\" armature=\"{:.9}\"/>\n",
            xml_escape(&j.name),
            fmt3(j.axis),
            r0,
            r1,
            j.damping,
            j.armature
        ));
        for (ci, col) in j.collisions.iter().enumerate() {
            let geom_type = match col.shape.to_ascii_lowercase().as_str() {
                "cylinder" => "cylinder",
                "box" => "box",
                "sphere" => "sphere",
                _ => "capsule",
            };
            let cpos = mm_to_m3(col.pos_mm);
            let size_str = match geom_type {
                "sphere" => format!("{:.9}", col.radius_mm * 0.001),
                "box" => fmt3([
                    col.radius_mm * 0.001,
                    col.radius_mm * 0.001,
                    col.half_length_mm * 0.001,
                ]),
                _ => format!(
                    "{:.9} {:.9}",
                    col.radius_mm * 0.001,
                    col.half_length_mm * 0.001
                ),
            };
            xml.push_str(&format!(
                "{indent}  <geom name=\"{}_col_{ci}\" class=\"collision\" type=\"{geom_type}\" size=\"{size_str}\" pos=\"{}\" quat=\"{}\"/>\n",
                xml_escape(&j.body_name),
                fmt3(cpos),
                fmt4(col.quat_wxyz)
            ));
        }
    }

    let flange_indent = "  ".repeat(4 + model.joints.len());
    let flange_pos = mm_to_m3(model.flange_transform.pos_mm);
    let tcp_pos = mm_to_m3(model.tcp_offset_mm);
    xml.push_str(&format!(
        "{flange_indent}<body name=\"flange\" pos=\"{}\" quat=\"{}\">\n",
        fmt3(flange_pos),
        fmt4(model.flange_transform.quat_wxyz)
    ));
    xml.push_str(&format!(
        "{flange_indent}  <site name=\"tcp_site\" pos=\"{}\" size=\"0.012\" group=\"4\"/>\n",
        fmt3(tcp_pos)
    ));
    xml.push_str(&format!("{flange_indent}</body>\n"));

    for idx in (0..model.joints.len()).rev() {
        let indent = "  ".repeat(4 + idx);
        xml.push_str(&format!("{indent}</body>\n"));
    }
    xml.push_str("    </body>\n");
    xml.push_str("  </worldbody>\n");

    xml.push_str("  <actuator>\n");
    for j in &model.joints {
        let r0 = j.limits_deg[0].to_radians();
        let r1 = j.limits_deg[1].to_radians();
        xml.push_str(&format!(
            "    <position name=\"act_J{}\" joint=\"{}\" kp=\"{:.6}\" kv=\"{:.6}\" forcelimited=\"true\" forcerange=\"-{:.6} {:.6}\" ctrllimited=\"true\" ctrlrange=\"{:.9} {:.9}\"/>\n",
            j.id,
            xml_escape(&j.name),
            j.kp,
            j.kv,
            j.force_limit_nm,
            j.force_limit_nm,
            r0,
            r1
        ));
    }
    xml.push_str("  </actuator>\n");

    let home_rad_str: Vec<String> = model
        .home_joints_deg
        .iter()
        .map(|deg| format!("{:.12}", deg.to_radians()))
        .collect();
    let home_joined = home_rad_str.join(" ");
    xml.push_str("  <keyframe>\n");
    xml.push_str(&format!(
        "    <key name=\"home\" qpos=\"{home_joined}\" ctrl=\"{home_joined}\"/>\n"
    ));
    xml.push_str("  </keyframe>\n");
    xml.push_str("</mujoco>\n");

    Ok((xml, model))
}

// ---------------------------------------------------------------------------
// 平台动态库加载抽象 (Windows kernel32 / Unix dlopen)
// ---------------------------------------------------------------------------

#[cfg(target_os = "windows")]
mod dynlib {
    use super::*;
    use std::os::windows::ffi::OsStrExt;

    #[link(name = "kernel32")]
    extern "system" {
        fn LoadLibraryW(lpLibFileName: *const u16) -> *mut c_void;
        fn GetProcAddress(hModule: *mut c_void, lpProcName: *const c_char) -> *mut c_void;
        fn FreeLibrary(hLibModule: *mut c_void) -> i32;
        fn GetLastError() -> u32;
    }

    pub struct NativeLib(*mut c_void);
    unsafe impl Send for NativeLib {}
    unsafe impl Sync for NativeLib {}

    impl NativeLib {
        pub fn open(path: &Path) -> Result<Self, String> {
            let wide: Vec<u16> = path
                .as_os_str()
                .encode_wide()
                .chain(std::iter::once(0))
                .collect();
            let handle = unsafe { LoadLibraryW(wide.as_ptr()) };
            if handle.is_null() {
                let err = unsafe { GetLastError() };
                return Err(format!(
                    "加载动态库失败 ({}) Win32错误码={}",
                    path.display(),
                    err
                ));
            }
            Ok(Self(handle))
        }

        pub unsafe fn symbol<T>(&self, name: &str) -> Result<T, String> {
            assert_eq!(std::mem::size_of::<T>(), std::mem::size_of::<*mut c_void>());
            let cname = CString::new(name).map_err(|_| format!("非法符号名: {name}"))?;
            let ptr = GetProcAddress(self.0, cname.as_ptr());
            if ptr.is_null() {
                return Err(format!("MuJoCo 动态库缺少必需符号 `{name}`"));
            }
            Ok(std::mem::transmute_copy(&ptr))
        }
    }

    impl Drop for NativeLib {
        fn drop(&mut self) {
            if !self.0.is_null() {
                unsafe {
                    FreeLibrary(self.0);
                }
            }
        }
    }
}

#[cfg(unix)]
mod dynlib {
    use super::*;
    use std::os::unix::ffi::OsStrExt;

    const RTLD_NOW: c_int = 2;

    extern "C" {
        fn dlopen(filename: *const c_char, flags: c_int) -> *mut c_void;
        fn dlsym(handle: *mut c_void, symbol: *const c_char) -> *mut c_void;
        fn dlclose(handle: *mut c_void) -> c_int;
        fn dlerror() -> *const c_char;
    }

    pub struct NativeLib(*mut c_void);
    unsafe impl Send for NativeLib {}
    unsafe impl Sync for NativeLib {}

    impl NativeLib {
        pub fn open(path: &Path) -> Result<Self, String> {
            let cpath = CString::new(path.as_os_str().as_bytes())
                .map_err(|_| format!("路径包含空字节: {}", path.display()))?;
            let handle = unsafe { dlopen(cpath.as_ptr(), RTLD_NOW) };
            if handle.is_null() {
                let msg = unsafe {
                    let err_ptr = dlerror();
                    if err_ptr.is_null() {
                        "unknown dlopen error".to_string()
                    } else {
                        CStr::from_ptr(err_ptr).to_string_lossy().into_owned()
                    }
                };
                return Err(format!("加载动态库失败 ({}): {}", path.display(), msg));
            }
            Ok(Self(handle))
        }

        pub unsafe fn symbol<T>(&self, name: &str) -> Result<T, String> {
            assert_eq!(std::mem::size_of::<T>(), std::mem::size_of::<*mut c_void>());
            let cname = CString::new(name).map_err(|_| format!("非法符号名: {name}"))?;
            let ptr = dlsym(self.0, cname.as_ptr());
            if ptr.is_null() {
                return Err(format!("MuJoCo 动态库缺少必需符号 `{name}`"));
            }
            Ok(std::mem::transmute_copy(&ptr))
        }
    }

    impl Drop for NativeLib {
        fn drop(&mut self) {
            if !self.0.is_null() {
                unsafe {
                    dlclose(self.0);
                }
            }
        }
    }
}

struct MujocoApi {
    _lib: dynlib::NativeLib,
    mj_version: unsafe extern "C" fn() -> c_int,
    mj_version_string: unsafe extern "C" fn() -> *const c_char,
    mj_parse_xml_string:
        unsafe extern "C" fn(*const c_char, *const MjVfs, *mut c_char, c_int) -> *mut MjSpec,
    mj_compile: unsafe extern "C" fn(*mut MjSpec, *const MjVfs) -> *mut MjModel,
    mjs_get_error: unsafe extern "C" fn(*mut MjSpec) -> *const c_char,
    mj_delete_spec: unsafe extern "C" fn(*mut MjSpec),
    mj_make_data: unsafe extern "C" fn(*const MjModel) -> *mut MjData,
    mj_delete_data: unsafe extern "C" fn(*mut MjData),
    mj_delete_model: unsafe extern "C" fn(*mut MjModel),
    mj_name2id: unsafe extern "C" fn(*const MjModel, c_int, *const c_char) -> c_int,
    mj_reset_data_keyframe: unsafe extern "C" fn(*const MjModel, *mut MjData, c_int),
    mj_step: unsafe extern "C" fn(*const MjModel, *mut MjData),
    mj_forward: unsafe extern "C" fn(*const MjModel, *mut MjData),
}

impl MujocoApi {
    fn load(path: &Path) -> Result<Self, HalError> {
        let lib = dynlib::NativeLib::open(path).map_err(HalError::Mujoco)?;
        let api = unsafe {
            Self {
                mj_version: lib.symbol("mj_version").map_err(HalError::Mujoco)?,
                mj_version_string: lib.symbol("mj_versionString").map_err(HalError::Mujoco)?,
                mj_parse_xml_string: lib.symbol("mj_parseXMLString").map_err(HalError::Mujoco)?,
                mj_compile: lib.symbol("mj_compile").map_err(HalError::Mujoco)?,
                mjs_get_error: lib.symbol("mjs_getError").map_err(HalError::Mujoco)?,
                mj_delete_spec: lib.symbol("mj_deleteSpec").map_err(HalError::Mujoco)?,
                mj_make_data: lib.symbol("mj_makeData").map_err(HalError::Mujoco)?,
                mj_delete_data: lib.symbol("mj_deleteData").map_err(HalError::Mujoco)?,
                mj_delete_model: lib.symbol("mj_deleteModel").map_err(HalError::Mujoco)?,
                mj_name2id: lib.symbol("mj_name2id").map_err(HalError::Mujoco)?,
                mj_reset_data_keyframe: lib
                    .symbol("mj_resetDataKeyframe")
                    .map_err(HalError::Mujoco)?,
                mj_step: lib.symbol("mj_step").map_err(HalError::Mujoco)?,
                mj_forward: lib.symbol("mj_forward").map_err(HalError::Mujoco)?,
                _lib: lib,
            }
        };

        let ver = unsafe { (api.mj_version)() };
        if ver != MUJOCO_EXPECTED_VERSION {
            return Err(HalError::Mujoco(format!(
                "MuJoCo 动态库版本不匹配: 期望 {} (4.0.1), 实际 {}",
                MUJOCO_EXPECTED_VERSION, ver
            )));
        }

        Ok(api)
    }

    fn version_string(&self) -> String {
        unsafe {
            let p = (self.mj_version_string)();
            if p.is_null() {
                "unknown".to_string()
            } else {
                CStr::from_ptr(p).to_string_lossy().into_owned()
            }
        }
    }
}

/// 按优先级定位 `mujoco.dll` / `libmujoco.so` / `libmujoco.dylib`
pub fn resolve_mujoco_lib_path(explicit: Option<&Path>) -> PathBuf {
    #[cfg(target_os = "windows")]
    const LIB_NAME: &str = "mujoco.dll";
    #[cfg(target_os = "linux")]
    const LIB_NAME: &str = "libmujoco.so";
    #[cfg(target_os = "macos")]
    const LIB_NAME: &str = "libmujoco.dylib";

    if let Some(p) = explicit {
        return p.to_path_buf();
    }
    if let Ok(env_path) = std::env::var("BASS_MUJOCO_LIB") {
        let trimmed = env_path.trim();
        if !trimmed.is_empty() {
            return PathBuf::from(trimmed);
        }
    }
    if let Ok(exe) = std::env::current_exe() {
        if let Some(dir) = exe.parent() {
            let beside_exe = dir.join(LIB_NAME);
            if beside_exe.exists() {
                return beside_exe;
            }
            if let Some(parent) = dir.parent() {
                let parent_bin = parent.join("bin").join(LIB_NAME);
                if parent_bin.exists() {
                    return parent_bin;
                }
            }
        }
    }
    for candidate in [
        Path::new("runtime/bin").join(LIB_NAME),
        Path::new("bin").join(LIB_NAME),
        Path::new(env!("CARGO_MANIFEST_DIR"))
            .join("../../../../runtime/bin")
            .join(LIB_NAME),
    ] {
        if candidate.exists() {
            return candidate;
        }
    }
    PathBuf::from(LIB_NAME)
}

/// 基于 MuJoCo 4.0.1 C FFI 的进程内物理引擎驱动，实现 [`FieldbusTransport`]
pub struct MujocoFfiDriver {
    api: Arc<MujocoApi>,
    model: *mut MjModel,
    data: *mut MjData,
    qpos_idx: [usize; 6],
    dof_idx: [usize; 6],
    ctrl_idx: [usize; 6],
    q_hold_rad: [f64; 6],
    joint_limits_rad: [(f64, f64); 6],
    timestep_s: f64,
    sim_tick: u64,
    echo_seq: u64,
    drives_enabled: bool,
    digital_in: u32,
    fault_active: bool,
    fault_code: u32,
    pending_tx: Option<TxPdo>,
    version_str: String,
    lib_path: PathBuf,
}

unsafe impl Send for MujocoFfiDriver {}

impl Drop for MujocoFfiDriver {
    fn drop(&mut self) {
        unsafe {
            if !self.data.is_null() {
                (self.api.mj_delete_data)(self.data);
                self.data = ptr::null_mut();
            }
            if !self.model.is_null() {
                (self.api.mj_delete_model)(self.model);
                self.model = ptr::null_mut();
            }
        }
    }
}

impl MujocoFfiDriver {
    /// 从 `robot_model.json` 和指定/自动发现的 MuJoCo 4.0.1 动态库初始化内置物理引擎
    pub fn open(
        robot_model_path: impl AsRef<Path>,
        mujoco_lib_path: Option<&Path>,
    ) -> Result<Self, HalError> {
        let model_path = robot_model_path.as_ref();
        let raw_json = std::fs::read_to_string(model_path).map_err(|e| {
            HalError::Mujoco(format!("读取机器人模型文件 {} 失败: {e}", model_path.display()))
        })?;
        let (mjcf_xml, robot_cfg) = build_headless_mjcf_from_json(&raw_json, CTRL_CYCLE_DT_S)?;
        let resolved_lib = resolve_mujoco_lib_path(mujoco_lib_path);
        let api = Arc::new(MujocoApi::load(&resolved_lib)?);
        let version_str = api.version_string();

        let xml_cstr = CString::new(mjcf_xml)
            .map_err(|_| HalError::Mujoco("MJCF XML 包含非法空字节".to_string()))?;
        let mut err_buf = vec![0u8; 1024];
        let spec = unsafe {
            (api.mj_parse_xml_string)(
                xml_cstr.as_ptr(),
                ptr::null(),
                err_buf.as_mut_ptr() as *mut c_char,
                err_buf.len() as c_int,
            )
        };
        if spec.is_null() {
            let err_msg = unsafe { CStr::from_ptr(err_buf.as_ptr() as *const c_char) }
                .to_string_lossy()
                .into_owned();
            return Err(HalError::Mujoco(format!("MJCF 解析失败: {err_msg}")));
        }

        let model = unsafe { (api.mj_compile)(spec, ptr::null()) };
        if model.is_null() {
            let err_msg = unsafe {
                let p = (api.mjs_get_error)(spec);
                let s = if p.is_null() {
                    "unknown mj_compile error".to_string()
                } else {
                    CStr::from_ptr(p).to_string_lossy().into_owned()
                };
                (api.mj_delete_spec)(spec);
                s
            };
            return Err(HalError::Mujoco(format!("MuJoCo 编译模型失败: {err_msg}")));
        }
        unsafe {
            (api.mj_delete_spec)(spec);
        }

        let data = unsafe { (api.mj_make_data)(model) };
        if data.is_null() {
            unsafe {
                (api.mj_delete_model)(model);
            }
            return Err(HalError::Mujoco("mj_makeData 返回空指针".to_string()));
        }

        // 解析关节与执行器索引并完成初始安全核验
        let result = (|| -> Result<Self, HalError> {
            let nq = unsafe { *((model as *const u8).add(MJMODEL_OFFSET_NQ) as *const i64) };
            let timestep_s = unsafe {
                *((model as *const u8).add(MJMODEL_OFFSET_OPT_TIMESTEP) as *const f64)
            };
            if nq < 6 || !timestep_s.is_finite() || timestep_s <= 0.0 {
                return Err(HalError::Mujoco(format!(
                    "编译后的 MuJoCo 模型参数异常 (nq={}, timestep={})",
                    nq, timestep_s
                )));
            }

            let jnt_qposadr = unsafe {
                *((model as *const u8).add(MJMODEL_OFFSET_JNT_QPOSADR) as *const *const i32)
            };
            let jnt_dofadr = unsafe {
                *((model as *const u8).add(MJMODEL_OFFSET_JNT_DOFADR) as *const *const i32)
            };

            let mut qpos_idx = [0usize; 6];
            let mut dof_idx = [0usize; 6];
            let mut ctrl_idx = [0usize; 6];
            let mut joint_limits_rad = [(0.0f64, 0.0f64); 6];

            for (i, j) in robot_cfg.joints.iter().enumerate() {
                let jname = CString::new(j.name.as_str()).unwrap();
                let jid = unsafe { (api.mj_name2id)(model, MJOBJ_JOINT, jname.as_ptr()) };
                if jid < 0 {
                    return Err(HalError::Mujoco(format!("未找到关节 {}", j.name)));
                }
                let aname = CString::new(format!("act_J{}", j.id)).unwrap();
                let aid = unsafe { (api.mj_name2id)(model, MJOBJ_ACTUATOR, aname.as_ptr()) };
                if aid < 0 {
                    return Err(HalError::Mujoco(format!("未找到执行器 act_J{}", j.id)));
                }
                qpos_idx[i] = unsafe { *jnt_qposadr.add(jid as usize) } as usize;
                dof_idx[i] = unsafe { *jnt_dofadr.add(jid as usize) } as usize;
                ctrl_idx[i] = aid as usize;
                joint_limits_rad[i] = (j.limits_deg[0].to_radians(), j.limits_deg[1].to_radians());
            }

            let home_key = CString::new("home").unwrap();
            let home_kid = unsafe { (api.mj_name2id)(model, MJOBJ_KEY, home_key.as_ptr()) };
            if home_kid >= 0 {
                unsafe {
                    (api.mj_reset_data_keyframe)(model, data, home_kid);
                }
            }
            unsafe {
                (api.mj_forward)(model, data);
            }

            let q_home_rad = robot_cfg.home_joints_deg.map(|d| d.to_radians());

            let mut driver = Self {
                api: api.clone(),
                model,
                data,
                qpos_idx,
                dof_idx,
                ctrl_idx,
                q_hold_rad: q_home_rad,
                joint_limits_rad,
                timestep_s,
                sim_tick: 0,
                echo_seq: 0,
                drives_enabled: false,
                digital_in: 0,
                fault_active: false,
                fault_code: 0,
                pending_tx: None,
                version_str,
                lib_path: resolved_lib,
            };

            let q_init_deg = driver.read_q_deg();
            driver.pending_tx = Some(TxPdo {
                status_word: STAT_PLANT_READY,
                echo_seq: 0,
                sim_tick: 0,
                q_act_deg: q_init_deg,
                qd_act_deg_s: [0.0; 6],
                tau_act_nm: [0.0; 6],
                digital_in: 0,
                fault_code: 0,
            });
            Ok(driver)
        })();

        if result.is_err() {
            unsafe {
                (api.mj_delete_data)(data);
                (api.mj_delete_model)(model);
            }
        }
        result
    }

    pub fn version_string(&self) -> &str {
        &self.version_str
    }

    pub fn library_path(&self) -> &Path {
        &self.lib_path
    }

    #[inline]
    unsafe fn qpos_ptr(&self) -> *mut f64 {
        *((self.data as *const u8).add(MJDATA_OFFSET_QPOS) as *const *mut f64)
    }

    #[inline]
    unsafe fn qvel_ptr(&self) -> *mut f64 {
        *((self.data as *const u8).add(MJDATA_OFFSET_QVEL) as *const *mut f64)
    }

    #[inline]
    unsafe fn ctrl_ptr(&self) -> *mut f64 {
        *((self.data as *const u8).add(MJDATA_OFFSET_CTRL) as *const *mut f64)
    }

    #[inline]
    unsafe fn actuator_force_ptr(&self) -> *const f64 {
        *((self.data as *const u8).add(MJDATA_OFFSET_ACTUATOR_FORCE) as *const *const f64)
    }

    fn read_q_rad(&self) -> [f64; 6] {
        let mut out = [0.0; 6];
        unsafe {
            let p = self.qpos_ptr();
            for i in 0..6 {
                out[i] = *p.add(self.qpos_idx[i]);
            }
        }
        out
    }

    fn read_q_deg(&self) -> [f64; 6] {
        self.read_q_rad().map(|r| r.to_degrees())
    }

    fn read_qd_deg_s(&self) -> [f64; 6] {
        let mut out = [0.0; 6];
        unsafe {
            let p = self.qvel_ptr();
            for i in 0..6 {
                out[i] = (*p.add(self.dof_idx[i])).to_degrees();
            }
        }
        out
    }

    fn read_tau_nm(&self) -> [f64; 6] {
        let mut out = [0.0; 6];
        unsafe {
            let p = self.actuator_force_ptr();
            for i in 0..6 {
                out[i] = *p.add(self.ctrl_idx[i]);
            }
        }
        out
    }

    fn write_qpos_zero_qvel(&mut self, q_rad: [f64; 6]) {
        unsafe {
            let qp = self.qpos_ptr();
            let vp = self.qvel_ptr();
            let cp = self.ctrl_ptr();
            for i in 0..6 {
                *qp.add(self.qpos_idx[i]) = q_rad[i];
                *vp.add(self.dof_idx[i]) = 0.0;
                *cp.add(self.ctrl_idx[i]) = q_rad[i];
            }
        }
    }

    fn write_ctrl(&mut self, q_rad: [f64; 6]) {
        unsafe {
            let cp = self.ctrl_ptr();
            for i in 0..6 {
                let (lo, hi) = self.joint_limits_rad[i];
                *cp.add(self.ctrl_idx[i]) = q_rad[i].clamp(lo, hi);
            }
        }
    }
}

impl FieldbusTransport for MujocoFfiDriver {
    fn send_rx_pdo(&mut self, cmd: &RxPdo) -> Result<(), HalError> {
        self.echo_seq = cmd.seq;
        self.digital_in = cmd.digital_out;

        if (cmd.control_word & CTRL_FAULT_RESET) != 0 {
            self.fault_active = false;
            self.fault_code = 0;
        }

        if cmd.q_cmd_deg.iter().any(|v| !v.is_finite()) {
            self.fault_active = true;
            self.fault_code = FAULT_INVALID_CMD;
        }

        let want_enable = (cmd.control_word & CTRL_ENABLE) != 0
            && (cmd.control_word & CTRL_ESTOP_OK) != 0
            && !self.fault_active;

        if want_enable {
            self.drives_enabled = true;
            let q_cmd_rad = cmd.q_cmd_deg.map(|d| d.to_radians());
            self.q_hold_rad = q_cmd_rad;
            self.write_ctrl(q_cmd_rad);

            let n_substeps = ((CTRL_CYCLE_DT_S / self.timestep_s).round() as usize).max(1);
            for _ in 0..n_substeps {
                unsafe {
                    (self.api.mj_step)(self.model, self.data);
                }
            }

            let q_after = self.read_q_rad();
            let qd_after = self.read_qd_deg_s();
            let tau_after = self.read_tau_nm();
            if q_after.iter().any(|v| !v.is_finite())
                || qd_after.iter().any(|v| !v.is_finite())
                || tau_after.iter().any(|v| !v.is_finite())
            {
                self.fault_active = true;
                self.fault_code = FAULT_SIM_NUMERIC;
                self.drives_enabled = false;
                self.write_qpos_zero_qvel(self.q_hold_rad);
                unsafe {
                    (self.api.mj_forward)(self.model, self.data);
                }
            } else {
                self.q_hold_rad = q_after;
            }
        } else {
            if self.drives_enabled {
                self.q_hold_rad = self.read_q_rad();
            }
            self.drives_enabled = false;
            self.write_qpos_zero_qvel(self.q_hold_rad);
            unsafe {
                (self.api.mj_forward)(self.model, self.data);
            }
        }

        self.sim_tick += 1;

        let mut status_word = STAT_PLANT_READY;
        if self.drives_enabled {
            status_word |= STAT_DRIVES_ENABLED;
        }
        if self.fault_active {
            status_word |= STAT_FAULT;
        }

        self.pending_tx = Some(TxPdo {
            status_word,
            echo_seq: self.echo_seq,
            sim_tick: self.sim_tick,
            q_act_deg: self.read_q_deg(),
            qd_act_deg_s: self.read_qd_deg_s(),
            tau_act_nm: self.read_tau_nm(),
            digital_in: self.digital_in,
            fault_code: self.fault_code,
        });

        Ok(())
    }

    fn poll_tx_pdo(&mut self) -> Result<Option<TxPdo>, HalError> {
        Ok(self.pending_tx.take())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn test_model_json_path() -> PathBuf {
        Path::new(env!("CARGO_MANIFEST_DIR"))
            .join("../../../../runtime/instances/default_cell/config/robot_model.json")
    }

    #[test]
    fn test_mujoco_ffi_driver_loads_and_steps_ur5e() {
        let mut driver = MujocoFfiDriver::open(test_model_json_path(), None)
            .expect("应成功加载 MuJoCo 4.0.1 DLL 并初始化 UR5e 物理场景");
        assert_eq!(driver.version_string(), "4.0.1");

        // 1. 初始待机包存在且回传 HOME 姿态
        let init_tx = driver
            .poll_tx_pdo()
            .expect("poll_tx_pdo 不应报错")
            .expect("初始化应生成首帧 TxPdo");
        assert_ne!(init_tx.status_word & STAT_PLANT_READY, 0);
        assert_eq!(init_tx.status_word & STAT_DRIVES_ENABLED, 0);
        assert!((init_tx.q_act_deg[0] - (-90.0)).abs() < 1e-4);
        assert!((init_tx.q_act_deg[2] - 90.0).abs() < 1e-4);

        // 2. 使能并指令 J1 向 -80 度运动 400 个周期 (0.8s)
        let mut target = init_tx.q_act_deg;
        target[0] = -80.0;
        let mut latest = init_tx;
        for seq in 1..=400u64 {
            driver
                .send_rx_pdo(&RxPdo {
                    control_word: CTRL_ENABLE | CTRL_ESTOP_OK,
                    seq,
                    timestamp_ns: seq * 2_000_000,
                    q_cmd_deg: target,
                    digital_out: 0x05,
                })
                .expect("send_rx_pdo 不应报错");
            latest = driver
                .poll_tx_pdo()
                .expect("poll_tx_pdo 不应报错")
                .expect("每次 send_rx_pdo 后应产出新 TxPdo");
        }

        assert_ne!(latest.status_word & STAT_DRIVES_ENABLED, 0);
        assert_eq!(latest.echo_seq, 400);
        assert_eq!(latest.digital_in, 0x05);
        assert!(
            (latest.q_act_deg[0] - (-80.0)).abs() < 0.2,
            "J1 应向 -80deg 收敛, 实际为 {:.3}",
            latest.q_act_deg[0]
        );
    }
}
