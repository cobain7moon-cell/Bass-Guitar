use crate::chain::{euler_zyx_deg_to_rot, rot_to_euler_zyx_deg, RobotChainSpec};
use crate::error::MotionError;
use bass_types::{Joints6D, Pose6D};
use nalgebra::{Isometry3, Matrix6, Translation3, UnitQuaternion, Vector3, Vector6};
use std::path::Path;

pub trait KinematicsEngine: Send + Sync {
    fn forward_kinematics(&self, q_deg: &Joints6D) -> Pose6D;
    fn inverse_kinematics(
        &self,
        target: &Pose6D,
        seed_q_deg: &Joints6D,
    ) -> Result<Joints6D, MotionError>;
    fn joint_limits(&self) -> ([f64; 6], [f64; 6]);
}

#[derive(Debug, Clone)]
pub struct Serial6DofKinematics {
    pub spec: RobotChainSpec,
}

impl Serial6DofKinematics {
    pub fn new(spec: RobotChainSpec) -> Self {
        Self { spec }
    }

    pub fn from_json_file<P: AsRef<Path>>(path: P) -> Result<Self, MotionError> {
        let spec = RobotChainSpec::load_from_json_file(path)?;
        Ok(Self::new(spec))
    }

    pub fn home_joints(&self) -> Joints6D {
        Joints6D {
            values: self.spec.home_joints_deg,
        }
    }

    pub fn forward_kinematics_iso(&self, q_deg: &Joints6D) -> Isometry3<f64> {
        let mut q_rad = [0.0; 6];
        for (i, val) in q_rad.iter_mut().enumerate() {
            *val = q_deg.values[i].to_radians();
        }
        let (_, _, t_tcp) = self.compute_chain_frames(&q_rad);
        t_tcp
    }

    /// 计算各关节世界旋转轴、位置与 TCP 变换，支持任意单轴方向向量 (`axis`) 与 `quat_wxyz` 链式装配。
    fn compute_chain_frames(
        &self,
        q_rad: &[f64; 6],
    ) -> ([Vector3<f64>; 6], [Vector3<f64>; 6], Isometry3<f64>) {
        let mut joint_axes = [Vector3::zeros(); 6];
        let mut joint_positions = [Vector3::zeros(); 6];

        let mut t_curr = self.spec.base_transform.to_isometry();
        for i in 0..6 {
            let joint = &self.spec.joints[i];
            let f_i = t_curr * joint.to_isometry();
            let local_axis = joint.unit_axis();
            joint_axes[i] = f_i.rotation * local_axis.into_inner();
            joint_positions[i] = f_i.translation.vector;
            let r_q = UnitQuaternion::from_axis_angle(&local_axis, q_rad[i]);
            t_curr = f_i * r_q;
        }
        t_curr *= self.spec.flange_transform.to_isometry();
        let tool = Isometry3::from_parts(
            Translation3::new(
                self.spec.tcp_offset_mm[0],
                self.spec.tcp_offset_mm[1],
                self.spec.tcp_offset_mm[2],
            ),
            UnitQuaternion::identity(),
        );
        let t_tcp = t_curr * tool;
        (joint_axes, joint_positions, t_tcp)
    }
}

impl KinematicsEngine for Serial6DofKinematics {
    fn forward_kinematics(&self, q_deg: &Joints6D) -> Pose6D {
        let iso = self.forward_kinematics_iso(q_deg);
        let trans = iso.translation.vector;
        let (a, b, c) = rot_to_euler_zyx_deg(&iso.rotation);
        Pose6D {
            x: trans.x,
            y: trans.y,
            z: trans.z,
            a,
            b,
            c,
        }
    }

    fn inverse_kinematics(
        &self,
        target: &Pose6D,
        seed_q_deg: &Joints6D,
    ) -> Result<Joints6D, MotionError> {
        if !target.x.is_finite()
            || !target.y.is_finite()
            || !target.z.is_finite()
            || !target.a.is_finite()
            || !target.b.is_finite()
            || !target.c.is_finite()
        {
            return Err(MotionError::InvalidParameter(
                "目标位姿包含非有限浮点数 (NaN/Inf)".to_string(),
            ));
        }
        for (i, v) in seed_q_deg.values.iter().enumerate() {
            if !v.is_finite() {
                return Err(MotionError::InvalidParameter(format!(
                    "种子关节 J{} 包含非有限浮点数",
                    i + 1
                )));
            }
        }

        let target_p_m = Vector3::new(target.x, target.y, target.z) / 1000.0;
        let target_rot = euler_zyx_deg_to_rot(target.a, target.b, target.c);

        let mut q_rad = [0.0; 6];
        for (i, val) in q_rad.iter_mut().enumerate() {
            *val = seed_q_deg.values[i].to_radians();
        }

        let lambda = 0.03;
        let lambda_sq = lambda * lambda;
        let max_step_rad = 0.25;
        let max_iters = 100;

        for _iter in 0..max_iters {
            let (joint_axes, joint_positions, t_tcp) = self.compute_chain_frames(&q_rad);
            let tcp_p_mm = t_tcp.translation.vector;
            let tcp_p_m = tcp_p_mm / 1000.0;
            let tcp_rot = t_tcp.rotation;

            let pos_err_m = target_p_m - tcp_p_m;
            let pos_err_mm = pos_err_m * 1000.0;
            let pos_err_norm_mm = pos_err_mm.norm();

            let mut rot_diff = target_rot * tcp_rot.inverse();
            if rot_diff.w < 0.0 {
                rot_diff = UnitQuaternion::new_unchecked(-rot_diff.into_inner());
            }
            let rot_err_angle_rad = rot_diff.angle();
            let rot_err_angle_deg = rot_err_angle_rad.to_degrees();

            if pos_err_norm_mm < 0.05 && rot_err_angle_deg < 0.05 {
                let mut sol_deg = [0.0; 6];
                for i in 0..6 {
                    let mut deg = q_rad[i].to_degrees();
                    let (min_lim, max_lim) = self.spec.joint_limits_deg[i];
                    let seed_deg = seed_q_deg.values[i];
                    // 仅当数值迭代偏离 seed 超过 180° 时，才尝试折叠回最接近 seed 的连续分支
                    let diff = deg - seed_deg;
                    if diff > 180.0 && deg - 360.0 >= min_lim {
                        deg -= 360.0;
                    } else if diff < -180.0 && deg + 360.0 <= max_lim {
                        deg += 360.0;
                    }
                    if !(min_lim..=max_lim).contains(&deg) {
                        return Err(MotionError::JointLimitExceeded {
                            axis: i + 1,
                            value: deg,
                            min: min_lim,
                            max: max_lim,
                        });
                    }
                    sol_deg[i] = deg;
                }
                return Ok(Joints6D { values: sol_deg });
            }

            // 构造几何雅可比 (米制)
            let rot_err_vec = rot_diff.scaled_axis();
            let mut j = Matrix6::zeros();
            for i in 0..6 {
                let j_pos = joint_axes[i].cross(&(tcp_p_m - joint_positions[i] / 1000.0));
                let j_rot = joint_axes[i];
                j[(0, i)] = j_pos.x;
                j[(1, i)] = j_pos.y;
                j[(2, i)] = j_pos.z;
                j[(3, i)] = j_rot.x;
                j[(4, i)] = j_rot.y;
                j[(5, i)] = j_rot.z;
            }

            let e = Vector6::new(
                pos_err_m.x,
                pos_err_m.y,
                pos_err_m.z,
                rot_err_vec.x,
                rot_err_vec.y,
                rot_err_vec.z,
            );

            // DLS: (J^T * J + lambda^2 * I) * dq = J^T * e
            let jt = j.transpose();
            let a = jt * j + Matrix6::identity() * lambda_sq;
            let b = jt * e;

            let dq = match a.lu().solve(&b) {
                Some(dq) => dq,
                None => {
                    return Err(MotionError::IkConvergenceFailed {
                        x: target.x,
                        y: target.y,
                        z: target.z,
                    });
                }
            };

            let max_dq = dq.iter().map(|v| v.abs()).fold(0.0, f64::max);
            let dq_clamped = if max_dq > max_step_rad {
                dq * (max_step_rad / max_dq)
            } else {
                dq
            };

            for i in 0..6 {
                q_rad[i] += dq_clamped[i];
            }
        }

        Err(MotionError::IkConvergenceFailed {
            x: target.x,
            y: target.y,
            z: target.z,
        })
    }

    fn joint_limits(&self) -> ([f64; 6], [f64; 6]) {
        let mut min = [0.0; 6];
        let mut max = [0.0; 6];
        for i in 0..6 {
            min[i] = self.spec.joint_limits_deg[i].0;
            max[i] = self.spec.joint_limits_deg[i].1;
        }
        (min, max)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::chain::{euler_zyx_deg_to_rot, rot_to_euler_zyx_deg};
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
    fn test_euler_zyx_roundtrip() {
        let angles = [
            (0.0, 0.0, 0.0),
            (30.0, 45.0, 60.0),
            (-90.0, 20.0, 150.0),
            (180.0, 45.0, 180.0),
            (-45.0, -30.0, 75.0),
        ];

        for (a, b, c) in angles {
            let q1 = euler_zyx_deg_to_rot(a, b, c);
            let (ra, rb, rc) = rot_to_euler_zyx_deg(&q1);
            let q2 = euler_zyx_deg_to_rot(ra, rb, rc);
            let diff = (q1.inverse() * q2).angle();
            assert!(
                diff < 1e-6,
                "Rot mismatch for ({}, {}, {}): diff angle = {}",
                a,
                b,
                c,
                diff
            );
        }
    }

    #[test]
    fn test_load_robot_model_json_and_fk_home() {
        let model_path = default_robot_model_path();
        let kin =
            Serial6DofKinematics::from_json_file(model_path).expect("加载 robot_model.json 失败");
        let home = kin.home_joints();
        let pose = kin.forward_kinematics(&home);
        assert!(
            (pose.x - (-134.0)).abs() < 0.01,
            "UR5e HOME TCP X 应接近 -134.0 mm，实际 {}",
            pose.x
        );
        assert!(
            (pose.y - 492.0).abs() < 0.01,
            "UR5e HOME TCP Y 应接近 492.0 mm，实际 {}",
            pose.y
        );
        assert!(
            (pose.z - 423.0).abs() < 0.01,
            "UR5e HOME TCP Z 应接近 423.0 mm，实际 {}",
            pose.z
        );
    }

    #[test]
    fn test_fk_ik_accuracy_under_0_1_mm() {
        let model_path = default_robot_model_path();
        let kin =
            Serial6DofKinematics::from_json_file(model_path).expect("加载 robot_model.json 失败");
        let home = kin.home_joints();
        let home_pose = kin.forward_kinematics(&home);

        let target = Pose6D {
            x: -220.0,
            y: 560.0,
            z: 340.0,
            a: home_pose.a,
            b: home_pose.b,
            c: home_pose.c,
        };

        let q_sol = kin.inverse_kinematics(&target, &home).expect("IK 求解失败");
        let reached = kin.forward_kinematics(&q_sol);

        let dx = (reached.x - target.x).abs();
        let dy = (reached.y - target.y).abs();
        let dz = (reached.z - target.z).abs();
        let dist = (dx * dx + dy * dy + dz * dz).sqrt();

        assert!(
            dist < 0.1,
            "三轴位置误差应 < 0.1mm, 实际: dx={}, dy={}, dz={}, dist={}",
            dx,
            dy,
            dz,
            dist
        );

        let q_target_rot = euler_zyx_deg_to_rot(target.a, target.b, target.c);
        let q_reached_rot = euler_zyx_deg_to_rot(reached.a, reached.b, reached.c);
        let rot_err_deg = (q_target_rot.inverse() * q_reached_rot)
            .angle()
            .to_degrees();
        assert!(
            rot_err_deg < 0.1,
            "姿态误差应 < 0.1 deg, 实际: {} deg",
            rot_err_deg
        );
    }

    #[test]
    fn test_j3_boundary_no_jump() {
        let model_path = default_robot_model_path();
        let kin =
            Serial6DofKinematics::from_json_file(model_path).expect("加载 robot_model.json 失败");

        // UR5e J3 (elbow_joint) 限位为 [-180, 180]
        let seed = Joints6D {
            values: [-90.0, -90.0, -175.0, -90.0, -90.0, 0.0],
        };

        let out_of_bounds = Joints6D {
            values: [-90.0, -90.0, -185.0, -90.0, -90.0, 0.0],
        };
        let target_pose = kin.forward_kinematics(&out_of_bounds);

        let res = kin.inverse_kinematics(&target_pose, &seed);
        assert!(
            res.is_err(),
            "J3 越界到 -185° 应返回 Err，而不能跳变到非法分支！实际得到: {:?}",
            res
        );
        match res.err().unwrap() {
            MotionError::JointLimitExceeded { axis, value, .. } => {
                assert_eq!(axis, 3);
                assert!(value < -180.0, "越界值应在负极限侧，实际为 {}", value);
            }
            MotionError::IkConvergenceFailed { .. } => {}
            other => panic!(
                "预期 JointLimitExceeded 或 IkConvergenceFailed，实际为 {:?}",
                other
            ),
        }
    }

    #[test]
    fn test_ik_rejects_nan() {
        let model_path = default_robot_model_path();
        let kin =
            Serial6DofKinematics::from_json_file(model_path).expect("加载 robot_model.json 失败");
        let home = kin.home_joints();

        let mut bad_target = kin.forward_kinematics(&home);
        bad_target.x = f64::NAN;
        assert!(matches!(
            kin.inverse_kinematics(&bad_target, &home),
            Err(MotionError::InvalidParameter(_))
        ));

        let mut bad_seed = home;
        bad_seed.values[0] = f64::NAN;
        let good_target = kin.forward_kinematics(&home);
        assert!(matches!(
            kin.inverse_kinematics(&good_target, &bad_seed),
            Err(MotionError::InvalidParameter(_))
        ));
    }
}
