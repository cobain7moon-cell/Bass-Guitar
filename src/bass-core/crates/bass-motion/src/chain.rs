use nalgebra::{Isometry3, Quaternion, Translation3, UnitQuaternion, UnitVector3, Vector3};
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;

use crate::error::MotionError;

pub const TCP_OFFSET_MM: [f64; 3] = [0.0, 0.0, 65.0];

pub const DEFAULT_JOINT_LIMITS_DEG: [(f64, f64); 6] = [
    (-360.0, 360.0),
    (-360.0, 360.0),
    (-180.0, 180.0),
    (-360.0, 360.0),
    (-360.0, 360.0),
    (-360.0, 360.0),
];

#[derive(Debug, Clone, Copy, PartialEq)]
pub struct FrameTransform {
    pub x: f64,
    pub y: f64,
    pub z: f64,
    pub a: f64,
    pub b: f64,
    pub c: f64,
}

impl Default for FrameTransform {
    fn default() -> Self {
        Self {
            x: 0.0,
            y: 0.0,
            z: 0.0,
            a: 0.0,
            b: 0.0,
            c: 0.0,
        }
    }
}

impl FrameTransform {
    pub fn new(x: f64, y: f64, z: f64, a: f64, b: f64, c: f64) -> Self {
        Self { x, y, z, a, b, c }
    }

    pub fn to_isometry(&self) -> Isometry3<f64> {
        let rot = euler_zyx_deg_to_rot(self.a, self.b, self.c);
        let trans = Translation3::new(self.x, self.y, self.z);
        Isometry3::from_parts(trans, rot)
    }
}

/// 以毫米平移和 `(w, x, y, z)` 四元数表示的三维刚体变换。
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub struct IsoTransform {
    pub pos_mm: [f64; 3],
    pub quat_wxyz: [f64; 4],
}

impl IsoTransform {
    pub fn validate(&self, field: &str) -> Result<(), MotionError> {
        validate_finite_slice(&self.pos_mm, &format!("{}.pos_mm", field))?;
        validate_finite_slice(&self.quat_wxyz, &format!("{}.quat_wxyz", field))?;
        let norm_sq: f64 = self.quat_wxyz.iter().map(|v| v * v).sum();
        if norm_sq <= 1e-12 {
            return Err(MotionError::ModelConfig(format!(
                "{}.quat_wxyz 四元数模长不能为零",
                field
            )));
        }
        Ok(())
    }

    pub fn to_isometry(&self) -> Isometry3<f64> {
        let q = Quaternion::new(
            self.quat_wxyz[0],
            self.quat_wxyz[1],
            self.quat_wxyz[2],
            self.quat_wxyz[3],
        );
        let rot = UnitQuaternion::from_quaternion(q);
        let trans = Translation3::new(self.pos_mm[0], self.pos_mm[1], self.pos_mm[2]);
        Isometry3::from_parts(trans, rot)
    }
}

/// 单个旋转关节的运动学几何参数与软限位配置。
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct JointSpec {
    pub id: usize,
    pub name: String,
    pub body_name: String,
    pub pos_mm: [f64; 3],
    pub quat_wxyz: [f64; 4],
    pub axis: [f64; 3],
    pub limits_deg: [f64; 2],
}

impl JointSpec {
    pub fn to_isometry(&self) -> Isometry3<f64> {
        IsoTransform {
            pos_mm: self.pos_mm,
            quat_wxyz: self.quat_wxyz,
        }
        .to_isometry()
    }

    pub fn unit_axis(&self) -> UnitVector3<f64> {
        UnitVector3::new_normalize(Vector3::new(self.axis[0], self.axis[1], self.axis[2]))
    }
}

pub fn euler_zyx_deg_to_rot(a_deg: f64, b_deg: f64, c_deg: f64) -> UnitQuaternion<f64> {
    let rz = UnitQuaternion::from_axis_angle(&Vector3::z_axis(), a_deg.to_radians());
    let ry = UnitQuaternion::from_axis_angle(&Vector3::y_axis(), b_deg.to_radians());
    let rx = UnitQuaternion::from_axis_angle(&Vector3::x_axis(), c_deg.to_radians());
    rz * ry * rx
}

pub fn rot_to_euler_zyx_deg(rot: &UnitQuaternion<f64>) -> (f64, f64, f64) {
    let m = rot.to_rotation_matrix();
    let r = m.matrix();
    let r20 = r[(2, 0)];
    let sin_b = (-r20).clamp(-1.0, 1.0);
    let b_rad = sin_b.asin();
    let cos_b = b_rad.cos();

    let (a_rad, c_rad) = if cos_b.abs() > 1e-7 {
        let a = r[(1, 0)].atan2(r[(0, 0)]);
        let c = r[(2, 1)].atan2(r[(2, 2)]);
        (a, c)
    } else if sin_b > 0.0 {
        let a = (-r[(0, 1)]).atan2(r[(0, 2)]);
        (a, 0.0)
    } else {
        let a = (-r[(0, 1)]).atan2(-r[(0, 2)]);
        (a, 0.0)
    };

    (a_rad.to_degrees(), b_rad.to_degrees(), c_rad.to_degrees())
}

#[derive(Debug, Clone, PartialEq)]
pub struct RobotChainSpec {
    pub schema_version: u32,
    pub robot_name: String,
    pub license: String,
    pub base_transform: IsoTransform,
    pub flange_transform: IsoTransform,
    pub tcp_offset_mm: [f64; 3],
    pub home_joints_deg: [f64; 6],
    pub joints: [JointSpec; 6],
    pub joint_limits_deg: [(f64, f64); 6],
}

pub type RobotModelSpec = RobotChainSpec;

#[derive(Debug, Deserialize)]
struct RobotModelJsonRaw {
    schema_version: u32,
    robot_name: String,
    license: String,
    base_transform: IsoTransform,
    flange_transform: IsoTransform,
    tcp_offset_mm: [f64; 3],
    home_joints_deg: [f64; 6],
    joints: Vec<JointSpec>,
}

fn validate_finite_slice(vals: &[f64], field: &str) -> Result<(), MotionError> {
    for (idx, val) in vals.iter().enumerate() {
        if !val.is_finite() {
            return Err(MotionError::ModelConfig(format!(
                "{}[{}] 包含非有限浮点数",
                field, idx
            )));
        }
    }
    Ok(())
}

impl RobotChainSpec {
    /// 从 JSON 模型参数文件 (`robot_model.json`) 加载并校验 6 轴串联运动学配置。
    pub fn load_from_json_file<P: AsRef<Path>>(path: P) -> Result<Self, MotionError> {
        let raw = fs::read_to_string(path.as_ref())
            .map_err(|e| MotionError::ModelConfig(format!("读取 JSON 模型文件失败: {}", e)))?;
        Self::from_json_str(&raw)
    }

    /// 从 JSON 字符串解析并校验 6 轴串联运动学配置。
    pub fn from_json_str(json_str: &str) -> Result<Self, MotionError> {
        let mut parsed: RobotModelJsonRaw = serde_json::from_str(json_str)
            .map_err(|e| MotionError::ModelConfig(format!("JSON 反序列化失败: {}", e)))?;

        if parsed.schema_version != 1 {
            return Err(MotionError::ModelConfig(format!(
                "不支持的 schema_version: {} (仅支持 1)",
                parsed.schema_version
            )));
        }
        if parsed.robot_name.trim().is_empty() {
            return Err(MotionError::ModelConfig("robot_name 不能为空".to_string()));
        }

        parsed.base_transform.validate("base_transform")?;
        parsed.flange_transform.validate("flange_transform")?;
        validate_finite_slice(&parsed.tcp_offset_mm, "tcp_offset_mm")?;
        validate_finite_slice(&parsed.home_joints_deg, "home_joints_deg")?;

        if parsed.joints.len() != 6 {
            return Err(MotionError::ModelConfig(format!(
                "期望 6 个关节，实际解析到 {} 个",
                parsed.joints.len()
            )));
        }

        parsed.joints.sort_by_key(|j| j.id);
        let mut joint_limits_deg = DEFAULT_JOINT_LIMITS_DEG;

        for (i, j) in parsed.joints.iter().enumerate() {
            if j.id != i + 1 {
                return Err(MotionError::ModelConfig(format!(
                    "关节编号不连续：期望 id={}，实际 id={}",
                    i + 1,
                    j.id
                )));
            }
            validate_finite_slice(&j.pos_mm, &format!("joints[{}].pos_mm", i))?;
            validate_finite_slice(&j.quat_wxyz, &format!("joints[{}].quat_wxyz", i))?;
            validate_finite_slice(&j.axis, &format!("joints[{}].axis", i))?;
            validate_finite_slice(&j.limits_deg, &format!("joints[{}].limits_deg", i))?;

            let quat_norm_sq: f64 = j.quat_wxyz.iter().map(|v| v * v).sum();
            if quat_norm_sq <= 1e-12 {
                return Err(MotionError::ModelConfig(format!(
                    "joints[{}].quat_wxyz 四元数模长不能为零",
                    i
                )));
            }

            let axis_norm_sq: f64 = j.axis.iter().map(|v| v * v).sum();
            if axis_norm_sq <= 1e-12 {
                return Err(MotionError::ModelConfig(format!(
                    "joints[{}].axis 旋转轴不能为零向量",
                    i
                )));
            }

            let min_lim = j.limits_deg[0];
            let max_lim = j.limits_deg[1];
            if min_lim > max_lim {
                return Err(MotionError::ModelConfig(format!(
                    "joints[{}].limits_deg 下限 {} 大于上限 {}",
                    i, min_lim, max_lim
                )));
            }
            let home_val = parsed.home_joints_deg[i];
            if !(min_lim..=max_lim).contains(&home_val) {
                return Err(MotionError::ModelConfig(format!(
                    "home_joints_deg[{}]={} 超出软限位 [{}, {}]",
                    i, home_val, min_lim, max_lim
                )));
            }

            joint_limits_deg[i] = (min_lim, max_lim);
        }

        let joints: [JointSpec; 6] = parsed
            .joints
            .try_into()
            .map_err(|_| MotionError::ModelConfig("关节数量转换失败".to_string()))?;

        Ok(Self {
            schema_version: parsed.schema_version,
            robot_name: parsed.robot_name,
            license: parsed.license,
            base_transform: parsed.base_transform,
            flange_transform: parsed.flange_transform,
            tcp_offset_mm: parsed.tcp_offset_mm,
            home_joints_deg: parsed.home_joints_deg,
            joints,
            joint_limits_deg,
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::PathBuf;

    fn default_robot_model_path() -> PathBuf {
        let candidates = [
            "../../../../runtime/instances/default_cell/config/robot_model.json",
            "../../../../instances/default_cell/config/robot_model.json",
            "../../../runtime/instances/default_cell/config/robot_model.json",
            "../../runtime/instances/default_cell/config/robot_model.json",
        ];
        for rel in candidates {
            let p = Path::new(env!("CARGO_MANIFEST_DIR")).join(rel);
            if p.exists() {
                return p;
            }
        }
        Path::new(env!("CARGO_MANIFEST_DIR"))
            .join("../../../../runtime/instances/default_cell/config/robot_model.json")
    }

    #[test]
    fn test_load_default_ur5e_json_model() {
        let path = default_robot_model_path();
        let spec = RobotChainSpec::load_from_json_file(&path).expect("加载 robot_model.json 失败");
        assert_eq!(spec.robot_name, "UR5e");
        assert_eq!(spec.license, "BSD-3-Clause");
        assert_eq!(spec.home_joints_deg, [-90.0, -90.0, 90.0, -90.0, -90.0, 0.0]);
        assert_eq!(spec.joints[0].axis, [0.0, 0.0, 1.0]);
        assert_eq!(spec.joints[1].axis, [0.0, 1.0, 0.0]);
        assert_eq!(spec.joint_limits_deg[2], (-180.0, 180.0));
    }

    #[test]
    fn test_invalid_robot_model_json_rejected() {
        let valid_str = fs::read_to_string(default_robot_model_path()).unwrap();

        // 1. 畸形 JSON 语法应报错
        assert!(RobotChainSpec::from_json_str("{bad json").is_err());

        // 2. 缺失关节应报错
        let mut missing_joint: serde_json::Value = serde_json::from_str(&valid_str).unwrap();
        missing_joint["joints"].as_array_mut().unwrap().pop();
        assert!(RobotChainSpec::from_json_str(&missing_joint.to_string()).is_err());

        // 3. 零向量旋转轴应报错
        let mut zero_axis: serde_json::Value = serde_json::from_str(&valid_str).unwrap();
        zero_axis["joints"][0]["axis"] = serde_json::json!([0.0, 0.0, 0.0]);
        assert!(RobotChainSpec::from_json_str(&zero_axis.to_string()).is_err());

        // 4. 非法限位 (min > max) 应报错
        let mut bad_limits: serde_json::Value = serde_json::from_str(&valid_str).unwrap();
        bad_limits["joints"][2]["limits_deg"] = serde_json::json!([100.0, -100.0]);
        assert!(RobotChainSpec::from_json_str(&bad_limits.to_string()).is_err());
    }
}
