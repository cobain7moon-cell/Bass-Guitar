use crate::chain::{euler_zyx_deg_to_rot, rot_to_euler_zyx_deg};
use crate::error::MotionError;
use crate::kinematics::KinematicsEngine;
use bass_types::{CoordSystem, JogCommand, Joints6D, MotionState, MotionTarget, Pose6D};
use nalgebra::{UnitQuaternion, Vector3};
use std::f64::consts::PI;

const MAX_ANGULAR_VEL_DEG_S: f64 = 90.0;

#[derive(Debug, Clone, PartialEq)]
pub struct StepOutput {
    pub q_cmd: Joints6D,
    pub done: bool,
    pub motion_state: MotionState,
}

pub trait MotionPlanner: Send + Sync {
    fn plan_movel(
        &mut self,
        current_q: &Joints6D,
        target: &Pose6D,
        vel_mm_s: f64,
    ) -> Result<(), MotionError>;
    fn plan_movej(
        &mut self,
        current_q: &Joints6D,
        target: MotionTarget,
        vel_deg_s: f64,
    ) -> Result<(), MotionError>;
    fn start_jog(&mut self, current_q: &Joints6D, cmd: &JogCommand) -> Result<(), MotionError>;
    fn step_jog(&self, current_q: &Joints6D, cmd: &JogCommand) -> Result<Joints6D, MotionError>;
    fn stop(&mut self);
    fn step(
        &mut self,
        dt_s: f64,
        override_pct: u8,
        current_q: &Joints6D,
    ) -> Result<StepOutput, MotionError>;
    fn motion_state(&self) -> MotionState;
    fn is_busy(&self) -> bool;
}

enum Trajectory {
    MoveL {
        start_pos: Vector3<f64>,
        target_pos: Vector3<f64>,
        start_rot: UnitQuaternion<f64>,
        target_rot: UnitQuaternion<f64>,
        duration: f64,
        target_pose: Pose6D,
    },
    MoveJ {
        start_q: [f64; 6],
        target_q: [f64; 6],
        duration: f64,
    },
}

pub struct LinearTrapezoidPlanner<K: KinematicsEngine> {
    pub kinematics: K,
    pub motion_state: MotionState,
    trajectory: Option<Trajectory>,
    elapsed_time: f64,
}

impl<K: KinematicsEngine> LinearTrapezoidPlanner<K> {
    pub fn new(kinematics: K) -> Self {
        Self {
            kinematics,
            motion_state: MotionState::Idle,
            trajectory: None,
            elapsed_time: 0.0,
        }
    }
}

impl<K: KinematicsEngine> MotionPlanner for LinearTrapezoidPlanner<K> {
    fn plan_movel(
        &mut self,
        current_q: &Joints6D,
        target: &Pose6D,
        vel_mm_s: f64,
    ) -> Result<(), MotionError> {
        if !vel_mm_s.is_finite() || vel_mm_s <= 0.0 {
            return Err(MotionError::InvalidParameter(
                "MoveL 速度必须为有限正数".to_string(),
            ));
        }
        if !target.x.is_finite()
            || !target.y.is_finite()
            || !target.z.is_finite()
            || !target.a.is_finite()
            || !target.b.is_finite()
            || !target.c.is_finite()
        {
            return Err(MotionError::InvalidParameter(
                "MoveL 目标位姿包含非有限浮点数 (NaN/Inf)".to_string(),
            ));
        }
        for (i, v) in current_q.values.iter().enumerate() {
            if !v.is_finite() {
                return Err(MotionError::InvalidParameter(format!(
                    "current_q J{} 包含非有限浮点数",
                    i + 1
                )));
            }
        }

        let start_pose = self.kinematics.forward_kinematics(current_q);
        let start_pos = Vector3::new(start_pose.x, start_pose.y, start_pose.z);
        let target_pos = Vector3::new(target.x, target.y, target.z);
        let start_rot = euler_zyx_deg_to_rot(start_pose.a, start_pose.b, start_pose.c);
        let target_rot = euler_zyx_deg_to_rot(target.a, target.b, target.c);

        let dist_mm = (target_pos - start_pos).norm();
        let mut rot_diff = target_rot * start_rot.inverse();
        if rot_diff.w < 0.0 {
            rot_diff = UnitQuaternion::new_unchecked(-rot_diff.into_inner());
        }
        let rot_deg = rot_diff.angle().to_degrees();

        let t_trans = dist_mm / vel_mm_s;
        let t_rot = rot_deg / MAX_ANGULAR_VEL_DEG_S;
        let duration = t_trans.max(t_rot).max(0.01);

        // 沿直线均匀预采样校验全路径可达性与关节限位（每 25mm 或 10° 至少一点，至少 10 点）
        let n_samples_dist = (dist_mm / 25.0).ceil() as usize;
        let n_samples_rot = (rot_deg / 10.0).ceil() as usize;
        let n_samples = n_samples_dist.max(n_samples_rot).max(10);
        let mut check_seed = *current_q;
        for i in 1..=n_samples {
            let u = i as f64 / n_samples as f64;
            let s = 0.5 * (1.0 - (PI * u).cos());
            let p = start_pos + (target_pos - start_pos) * s;
            let r = start_rot.slerp(&target_rot, s);
            let (a, b, c) = rot_to_euler_zyx_deg(&r);
            let pose = Pose6D {
                x: p.x,
                y: p.y,
                z: p.z,
                a,
                b,
                c,
            };
            check_seed = self.kinematics.inverse_kinematics(&pose, &check_seed)?;
        }

        self.trajectory = Some(Trajectory::MoveL {
            start_pos,
            target_pos,
            start_rot,
            target_rot,
            duration,
            target_pose: *target,
        });
        self.elapsed_time = 0.0;
        self.motion_state = MotionState::MoveL;
        Ok(())
    }

    fn plan_movej(
        &mut self,
        current_q: &Joints6D,
        target: MotionTarget,
        vel_deg_s: f64,
    ) -> Result<(), MotionError> {
        if !vel_deg_s.is_finite() || vel_deg_s <= 0.0 {
            return Err(MotionError::InvalidParameter(
                "MoveJ 速度必须为有限正数".to_string(),
            ));
        }
        for (i, v) in current_q.values.iter().enumerate() {
            if !v.is_finite() {
                return Err(MotionError::InvalidParameter(format!(
                    "current_q J{} 包含非有限浮点数",
                    i + 1
                )));
            }
        }

        let target_q = match target {
            MotionTarget::Joints(j) => {
                let (min_lim, max_lim) = self.kinematics.joint_limits();
                for i in 0..6 {
                    if !j.values[i].is_finite() {
                        return Err(MotionError::InvalidParameter(format!(
                            "目标关节 J{} 包含非有限浮点数",
                            i + 1
                        )));
                    }
                    if !(min_lim[i]..=max_lim[i]).contains(&j.values[i]) {
                        return Err(MotionError::JointLimitExceeded {
                            axis: i + 1,
                            value: j.values[i],
                            min: min_lim[i],
                            max: max_lim[i],
                        });
                    }
                }
                j
            }
            MotionTarget::Pose(p) => {
                if !p.x.is_finite()
                    || !p.y.is_finite()
                    || !p.z.is_finite()
                    || !p.a.is_finite()
                    || !p.b.is_finite()
                    || !p.c.is_finite()
                {
                    return Err(MotionError::InvalidParameter(
                        "MoveJ 目标位姿包含非有限浮点数 (NaN/Inf)".to_string(),
                    ));
                }
                self.kinematics.inverse_kinematics(&p, current_q)?
            }
        };

        let mut max_delta = 0.0f64;
        for i in 0..6 {
            max_delta = max_delta.max((target_q.values[i] - current_q.values[i]).abs());
        }
        let duration = if max_delta < 1e-4 {
            0.01
        } else {
            (max_delta / vel_deg_s).max(0.01)
        };

        self.trajectory = Some(Trajectory::MoveJ {
            start_q: current_q.values,
            target_q: target_q.values,
            duration,
        });
        self.elapsed_time = 0.0;
        self.motion_state = MotionState::MoveJ;
        Ok(())
    }

    fn start_jog(&mut self, current_q: &Joints6D, cmd: &JogCommand) -> Result<(), MotionError> {
        let target_q = self.step_jog(current_q, cmd)?;
        let mut max_delta = 0.0f64;
        for i in 0..6 {
            max_delta = max_delta.max((target_q.values[i] - current_q.values[i]).abs());
        }
        let duration = (max_delta / 30.0).max(0.01);

        self.trajectory = Some(Trajectory::MoveJ {
            start_q: current_q.values,
            target_q: target_q.values,
            duration,
        });
        self.elapsed_time = 0.0;
        self.motion_state = MotionState::Jog;
        Ok(())
    }

    fn step_jog(&self, current_q: &Joints6D, cmd: &JogCommand) -> Result<Joints6D, MotionError> {
        if !cmd.step_size.is_finite() || cmd.step_size <= 0.0 {
            return Err(MotionError::InvalidParameter(
                "点动步长必须为有限正数".to_string(),
            ));
        }
        if !cmd.direction.is_finite() || cmd.direction.abs() < 1e-9 {
            return Err(MotionError::InvalidParameter(
                "点动方向不能为 0 或 NaN".to_string(),
            ));
        }
        for (i, v) in current_q.values.iter().enumerate() {
            if !v.is_finite() {
                return Err(MotionError::InvalidParameter(format!(
                    "current_q J{} 包含非有限浮点数",
                    i + 1
                )));
            }
        }

        match cmd.coord_system {
            CoordSystem::Joint => {
                let axis_idx = match cmd.axis.trim().to_uppercase().as_str() {
                    "J1" | "1" => 0,
                    "J2" | "2" => 1,
                    "J3" | "3" => 2,
                    "J4" | "4" => 3,
                    "J5" | "5" => 4,
                    "J6" | "6" => 5,
                    _ => return Err(MotionError::UnknownAxis(cmd.axis.clone())),
                };
                let dir = cmd.direction.signum();
                let delta = dir * cmd.step_size.abs();
                let new_val = current_q.values[axis_idx] + delta;
                let (min_lim, max_lim) = self.kinematics.joint_limits();
                if !(min_lim[axis_idx]..=max_lim[axis_idx]).contains(&new_val) {
                    return Err(MotionError::JointLimitExceeded {
                        axis: axis_idx + 1,
                        value: new_val,
                        min: min_lim[axis_idx],
                        max: max_lim[axis_idx],
                    });
                }
                let mut out_q = *current_q;
                out_q.values[axis_idx] = new_val;
                Ok(out_q)
            }
            CoordSystem::Cartesian => {
                let mut pose = self.kinematics.forward_kinematics(current_q);
                let dir = cmd.direction.signum();
                let delta = dir * cmd.step_size.abs();
                match cmd.axis.trim().to_uppercase().as_str() {
                    "X" => pose.x += delta,
                    "Y" => pose.y += delta,
                    "Z" => pose.z += delta,
                    "A" => pose.a += delta,
                    "B" => pose.b += delta,
                    "C" => pose.c += delta,
                    _ => return Err(MotionError::UnknownAxis(cmd.axis.clone())),
                }
                self.kinematics.inverse_kinematics(&pose, current_q)
            }
        }
    }

    fn stop(&mut self) {
        self.motion_state = MotionState::Idle;
        self.trajectory = None;
    }

    fn step(
        &mut self,
        dt_s: f64,
        override_pct: u8,
        current_q: &Joints6D,
    ) -> Result<StepOutput, MotionError> {
        if !dt_s.is_finite() || dt_s < 0.0 {
            return Err(MotionError::InvalidParameter(
                "dt_s 必须为有限非负数".to_string(),
            ));
        }
        for (i, v) in current_q.values.iter().enumerate() {
            if !v.is_finite() {
                return Err(MotionError::InvalidParameter(format!(
                    "current_q J{} 包含非有限浮点数",
                    i + 1
                )));
            }
        }

        if self.motion_state == MotionState::Idle {
            return Ok(StepOutput {
                q_cmd: *current_q,
                done: true,
                motion_state: MotionState::Idle,
            });
        }

        let effective_dt = dt_s * (override_pct as f64 / 100.0).clamp(0.0, 1.0);
        self.elapsed_time += effective_dt;

        match &self.trajectory {
            Some(Trajectory::MoveL {
                start_pos,
                target_pos,
                start_rot,
                target_rot,
                duration,
                target_pose,
            }) => {
                let u = if *duration > 1e-6 {
                    (self.elapsed_time / *duration).clamp(0.0, 1.0)
                } else {
                    1.0
                };
                let s = 0.5 * (1.0 - (PI * u).cos());

                let cur_pose = if u >= 1.0 {
                    *target_pose
                } else {
                    let p = start_pos + (target_pos - start_pos) * s;
                    let r = start_rot.slerp(target_rot, s);
                    let (a, b, c) = rot_to_euler_zyx_deg(&r);
                    Pose6D {
                        x: p.x,
                        y: p.y,
                        z: p.z,
                        a,
                        b,
                        c,
                    }
                };

                let q_cmd = match self.kinematics.inverse_kinematics(&cur_pose, current_q) {
                    Ok(q) => q,
                    Err(e) => {
                        self.stop();
                        return Err(e);
                    }
                };

                let done = u >= 1.0;
                let final_state = if done {
                    self.motion_state = MotionState::Idle;
                    self.trajectory = None;
                    MotionState::Idle
                } else {
                    self.motion_state
                };

                Ok(StepOutput {
                    q_cmd,
                    done,
                    motion_state: final_state,
                })
            }
            Some(Trajectory::MoveJ {
                start_q,
                target_q,
                duration,
            }) => {
                let u = if *duration > 1e-6 {
                    (self.elapsed_time / *duration).clamp(0.0, 1.0)
                } else {
                    1.0
                };
                let s = 0.5 * (1.0 - (PI * u).cos());

                let mut q_vals = [0.0; 6];
                for i in 0..6 {
                    q_vals[i] = start_q[i] + (target_q[i] - start_q[i]) * s;
                }
                let q_cmd = Joints6D { values: q_vals };

                let done = u >= 1.0;
                let final_state = if done {
                    self.motion_state = MotionState::Idle;
                    self.trajectory = None;
                    MotionState::Idle
                } else {
                    self.motion_state
                };

                Ok(StepOutput {
                    q_cmd,
                    done,
                    motion_state: final_state,
                })
            }
            None => {
                self.motion_state = MotionState::Idle;
                Ok(StepOutput {
                    q_cmd: *current_q,
                    done: true,
                    motion_state: MotionState::Idle,
                })
            }
        }
    }

    fn motion_state(&self) -> MotionState {
        self.motion_state
    }

    fn is_busy(&self) -> bool {
        self.motion_state != MotionState::Idle
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::kinematics::Serial6DofKinematics;
    use bass_types::{CoordSystem, JogCommand};
    use std::path::{Path, PathBuf};

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
    fn test_movel_interpolation_straightness() {
        let model_path = default_robot_model_path();
        let kin = Serial6DofKinematics::from_json_file(model_path)
            .expect("加载 robot_model.json 失败");
        let home = kin.home_joints();
        let home_pose = kin.forward_kinematics(&home);

        let target_pose = Pose6D {
            x: home_pose.x - 50.0,
            y: home_pose.y + 80.0,
            z: home_pose.z - 40.0,
            a: home_pose.a,
            b: home_pose.b,
            c: home_pose.c,
        };

        let mut planner = LinearTrapezoidPlanner::new(kin.clone());
        planner
            .plan_movel(&home, &target_pose, 100.0)
            .expect("MoveL 规划失败");

        let p_start = [home_pose.x, home_pose.y, home_pose.z];
        let p_end = [target_pose.x, target_pose.y, target_pose.z];
        let line_vec = [
            p_end[0] - p_start[0],
            p_end[1] - p_start[1],
            p_end[2] - p_start[2],
        ];
        let line_len =
            (line_vec[0] * line_vec[0] + line_vec[1] * line_vec[1] + line_vec[2] * line_vec[2])
                .sqrt();
        let line_dir = [
            line_vec[0] / line_len,
            line_vec[1] / line_len,
            line_vec[2] / line_len,
        ];

        let mut curr_q = home;
        let mut steps = 0;
        let dt = 0.002;

        loop {
            let out = planner.step(dt, 100, &curr_q).expect("MoveL 步进失败");
            curr_q = out.q_cmd;
            steps += 1;

            let pose = kin.forward_kinematics(&curr_q);
            let v = [
                pose.x - p_start[0],
                pose.y - p_start[1],
                pose.z - p_start[2],
            ];
            let proj = v[0] * line_dir[0] + v[1] * line_dir[1] + v[2] * line_dir[2];
            let perp = [
                v[0] - proj * line_dir[0],
                v[1] - proj * line_dir[1],
                v[2] - proj * line_dir[2],
            ];
            let dist_to_line = (perp[0] * perp[0] + perp[1] * perp[1] + perp[2] * perp[2]).sqrt();

            assert!(
                dist_to_line < 0.05,
                "第 {} 步点到直线垂直距离超标: {} mm (阈值 0.05 mm)",
                steps,
                dist_to_line
            );

            if out.done {
                break;
            }
            assert!(steps < 5000, "MoveL 步数异常过多，陷入死循环");
        }

        assert!(steps > 10, "MoveL 应该经历多次插补步进，实际步数: {}", steps);
        let final_pose = kin.forward_kinematics(&curr_q);
        let end_err = ((final_pose.x - target_pose.x).powi(2)
            + (final_pose.y - target_pose.y).powi(2)
            + (final_pose.z - target_pose.z).powi(2))
        .sqrt();
        assert!(
            end_err < 0.1,
            "终点到位误差应 < 0.1 mm, 实际: {} mm",
            end_err
        );
    }

    #[test]
    fn test_jog_cartesian_and_joint_limits() {
        let model_path = default_robot_model_path();
        let kin = Serial6DofKinematics::from_json_file(model_path)
            .expect("加载 robot_model.json 失败");
        let planner = LinearTrapezoidPlanner::new(kin.clone());
        let home = kin.home_joints();

        // 1. Joint jog exceeding limit should error or clamp
        let cmd_exceed = JogCommand {
            coord_system: CoordSystem::Joint,
            axis: "J3".to_string(),
            direction: 1.0,
            step_size: 120.0, // UR5e J3 上限 180°，home J3 = 90°，90 + 120 = 210 > 180
        };
        let res = planner.step_jog(&home, &cmd_exceed);
        assert!(res.is_err(), "J3 超限点动应该返回 Err");

        // 2. Cartesian jog normal step
        let cmd_cart = JogCommand {
            coord_system: CoordSystem::Cartesian,
            axis: "X".to_string(),
            direction: 1.0,
            step_size: 10.0,
        };
        let new_q = planner
            .step_jog(&home, &cmd_cart)
            .expect("笛卡尔 X 点动失败");
        let orig_pose = kin.forward_kinematics(&home);
        let new_pose = kin.forward_kinematics(&new_q);
        let dx = new_pose.x - orig_pose.x;
        assert!((dx - 10.0).abs() < 0.2, "X 轴点动 10mm 实际位移: {} mm", dx);
    }

    #[test]
    fn test_movej_interpolation_joints() {
        let model_path = default_robot_model_path();
        let kin = Serial6DofKinematics::from_json_file(model_path)
            .expect("加载 robot_model.json 失败");
        let mut planner = LinearTrapezoidPlanner::new(kin.clone());
        let home = kin.home_joints();

        let target_joints = Joints6D {
            values: [-80.0, -82.0, 82.0, -85.0, -88.0, 5.0],
        };

        planner
            .plan_movej(&home, MotionTarget::Joints(target_joints), 60.0)
            .expect("MoveJ 规划失败");

        assert!(planner.is_busy());
        assert_eq!(planner.motion_state(), MotionState::MoveJ);

        let mut curr_q = home;
        let dt = 0.002;
        let mut steps = 0;

        loop {
            let out = planner.step(dt, 100, &curr_q).expect("MoveJ 步进失败");
            curr_q = out.q_cmd;
            steps += 1;
            if out.done {
                assert_eq!(out.motion_state, MotionState::Idle);
                break;
            }
            assert!(steps < 2000, "MoveJ 超时");
        }

        assert!(steps > 10, "MoveJ 插补步数应大于 10");
        for i in 0..6 {
            assert!(
                (curr_q.values[i] - target_joints.values[i]).abs() < 1e-3,
                "关节 {} 未精准到达目标",
                i + 1
            );
        }
        assert!(!planner.is_busy());
    }

    #[test]
    fn test_start_jog_and_step() {
        let model_path = default_robot_model_path();
        let kin = Serial6DofKinematics::from_json_file(model_path)
            .expect("加载 robot_model.json 失败");
        let mut planner = LinearTrapezoidPlanner::new(kin.clone());
        let home = kin.home_joints();

        let jog_cmd = JogCommand {
            coord_system: CoordSystem::Joint,
            axis: "J1".to_string(),
            direction: 1.0,
            step_size: 5.0,
        };

        planner
            .start_jog(&home, &jog_cmd)
            .expect("启动 J1 点动失败");
        assert!(planner.is_busy());
        assert_eq!(planner.motion_state(), MotionState::Jog);

        let mut curr_q = home;
        let dt = 0.002;
        let mut steps = 0;

        loop {
            let out = planner.step(dt, 100, &curr_q).expect("点动步进失败");
            curr_q = out.q_cmd;
            steps += 1;
            if out.done {
                break;
            }
            assert!(steps < 1000, "点动超时");
        }

        assert!((curr_q.values[0] - (-85.0)).abs() < 1e-3, "J1 点动 +5° 后应为 -85.0°");
    }

    #[test]
    fn test_stop_and_override_zero() {
        let model_path = default_robot_model_path();
        let kin = Serial6DofKinematics::from_json_file(model_path)
            .expect("加载 robot_model.json 失败");
        let mut planner = LinearTrapezoidPlanner::new(kin.clone());
        let home = kin.home_joints();

        let target_joints = Joints6D {
            values: [-70.0, -90.0, 90.0, -90.0, -90.0, 0.0],
        };

        planner
            .plan_movej(&home, MotionTarget::Joints(target_joints), 60.0)
            .unwrap();

        // override = 0 应该静止
        let out_zero = planner.step(0.002, 0, &home).expect("倍率 0 步进失败");
        assert!(!out_zero.done);
        assert_eq!(out_zero.motion_state, MotionState::MoveJ);
        assert!((out_zero.q_cmd.values[0] - home.values[0]).abs() < 1e-6);

        // stop
        planner.stop();
        assert!(!planner.is_busy());
        assert_eq!(planner.motion_state(), MotionState::Idle);

        let out_after_stop = planner.step(0.002, 100, &home).expect("停止后步进失败");
        assert!(out_after_stop.done);
        assert_eq!(out_after_stop.motion_state, MotionState::Idle);
    }

    #[test]
    fn test_movel_pure_rotation_duration() {
        let model_path = default_robot_model_path();
        let kin = Serial6DofKinematics::from_json_file(model_path)
            .expect("加载 robot_model.json 失败");
        let mut planner = LinearTrapezoidPlanner::new(kin.clone());
        let home = kin.home_joints();
        let home_pose = kin.forward_kinematics(&home);

        // 纯姿态旋转 90°，平移距离 = 0.0 mm
        let target_pose = Pose6D {
            x: home_pose.x,
            y: home_pose.y,
            z: home_pose.z,
            a: home_pose.a + 90.0,
            b: home_pose.b,
            c: home_pose.c,
        };

        planner
            .plan_movel(&home, &target_pose, 100.0)
            .expect("纯旋转 MoveL 规划失败");

        let mut curr_q = home;
        let dt = 0.002;
        let mut steps = 0;

        loop {
            let out = planner.step(dt, 100, &curr_q).expect("纯旋转 MoveL 步进失败");
            curr_q = out.q_cmd;
            steps += 1;
            if out.done {
                break;
            }
            assert!(steps < 5000, "死循环");
        }

        // 90° 旋转在 90°/s 下应至少 1.0 秒，即 500 步以上
        assert!(
            steps >= 480,
            "纯姿态 90° 旋转不应退化为短时间，实际步数: {}",
            steps
        );
        let final_pose = kin.forward_kinematics(&curr_q);
        let q_target = euler_zyx_deg_to_rot(target_pose.a, target_pose.b, target_pose.c);
        let q_final = euler_zyx_deg_to_rot(final_pose.a, final_pose.b, final_pose.c);
        let rot_err = (q_target.inverse() * q_final).angle().to_degrees();
        assert!(
            rot_err < 0.1,
            "纯旋转终点姿态误差应 < 0.1°, 实际为: {}",
            rot_err
        );
    }

    #[test]
    fn test_step_jog_zero_or_nan_direction_rejected() {
        let model_path = default_robot_model_path();
        let kin = Serial6DofKinematics::from_json_file(model_path)
            .expect("加载 robot_model.json 失败");
        let planner = LinearTrapezoidPlanner::new(kin.clone());
        let home = kin.home_joints();

        let cmd_zero = JogCommand {
            coord_system: CoordSystem::Joint,
            axis: "J1".to_string(),
            direction: 0.0,
            step_size: 1.0,
        };
        assert!(matches!(
            planner.step_jog(&home, &cmd_zero),
            Err(MotionError::InvalidParameter(_))
        ));

        let cmd_nan = JogCommand {
            coord_system: CoordSystem::Cartesian,
            axis: "X".to_string(),
            direction: f64::NAN,
            step_size: 1.0,
        };
        assert!(matches!(
            planner.step_jog(&home, &cmd_nan),
            Err(MotionError::InvalidParameter(_))
        ));
    }

    #[test]
    fn test_movel_unreachable_intermediate_rejected() {
        let model_path = default_robot_model_path();
        let kin = Serial6DofKinematics::from_json_file(model_path)
            .expect("加载 robot_model.json 失败");
        let mut planner = LinearTrapezoidPlanner::new(kin.clone());
        let home = kin.home_joints();

        // 遥远不可达的目标
        let target_unreachable = Pose6D {
            x: 5000.0,
            y: 5000.0,
            z: 5000.0,
            a: 0.0,
            b: 0.0,
            c: 0.0,
        };

        let res = planner.plan_movel(&home, &target_unreachable, 100.0);
        assert!(res.is_err(), "不可达目标的 MoveL 规划必须在规划阶段返回 Err");
    }
}
