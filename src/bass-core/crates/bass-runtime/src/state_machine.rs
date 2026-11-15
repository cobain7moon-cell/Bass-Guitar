//! 控制器安全与运行状态机模块 (`ControllerStateMachine`)
//!
//! 负责维护控制器运行模式 (Manual/Auto)、伺服驱动使能状态、急停开关状态、
//! 速度倍率、数字输出 (DOUT) 以及下位机物理进程在线心跳状态。
//! 严格保障工业机器人运动安全联锁逻辑。

use bass_types::OpMode;

/// 控制器状态机
#[derive(Debug, Clone, PartialEq)]
pub struct ControllerStateMachine {
    /// 当前操作模式（手动 / 自动）
    pub op_mode: OpMode,
    /// 伺服驱动器使能状态
    pub drives_on: bool,
    /// 急停按钮触发状态
    pub emergency_stop: bool,
    /// 速度倍率（百分比，范围 5..=100）
    pub speed_override: u8,
    /// 数字输出引脚状态 (DOUT[1..8]，对应索引 0..7)
    pub digital_out: [bool; 8],
    /// 下位机物理仿真/驱动器是否在线
    pub plant_online: bool,
    /// 控制器当前状态信息（向示教器展示）
    pub status_message: String,
}

impl Default for ControllerStateMachine {
    fn default() -> Self {
        Self {
            op_mode: OpMode::Manual,
            drives_on: false,
            emergency_stop: false,
            speed_override: 100,
            digital_out: [false; 8],
            plant_online: false,
            status_message: "就绪".to_string(),
        }
    }
}

impl ControllerStateMachine {
    /// 创建初始状态机实例
    pub fn new() -> Self {
        Self::default()
    }

    /// 校验当前是否允许进行任何轴或笛卡尔运动
    ///
    /// 必须同时满足：伺服使能开启、未处于急停状态、且下位机物理端在线。
    #[inline]
    pub fn can_move(&self) -> bool {
        self.drives_on && !self.emergency_stop && self.plant_online
    }

    /// 切换运行模式（Manual / Auto）
    ///
    /// 返回模式是否发生真实变化。模式切换应取消活跃点动并暂停连续运行程序。
    pub fn set_mode(&mut self, new_mode: OpMode) -> bool {
        if self.op_mode != new_mode {
            self.op_mode = new_mode;
            self.status_message = format!("模式切换为: {:?}", new_mode);
            true
        } else {
            false
        }
    }

    /// 设置伺服驱动电源使能
    ///
    /// 当处于急停状态时，拒绝开启使能并返回错误；关闭使能始终允许。
    pub fn set_drives_power(&mut self, enable: bool) -> Result<(), &'static str> {
        if enable {
            if self.emergency_stop {
                self.status_message = "急停被触发，无法使能电机".to_string();
                return Err("急停被触发，无法使能电机");
            }
            self.drives_on = true;
            self.status_message = "伺服使能已开启".to_string();
            Ok(())
        } else {
            self.drives_on = false;
            self.status_message = "伺服使能已关闭".to_string();
            Ok(())
        }
    }

    /// 设置急停状态
    ///
    /// 触发急停 (true) 时强制立即切断伺服驱动使能 (`drives_on = false`)；
    /// 释放急停 (false) 后，伺服使能保持关闭，需操作员显式重新开启使能。
    pub fn set_emergency_stop(&mut self, estop: bool) {
        self.emergency_stop = estop;
        if estop {
            self.drives_on = false;
            self.status_message = "急停被触发".to_string();
        } else {
            self.status_message = "急停已复位 (电机保持下电，请手动重新使能)".to_string();
        }
    }

    /// 设置速度倍率（整型，限制在 5..=100）
    pub fn set_speed_override(&mut self, val: u8) {
        self.speed_override = val.clamp(5, 100);
    }

    /// 设置速度倍率（浮点型，带有 NaN/Inf 守卫与 5.0..=100.0 限制）
    pub fn set_speed_override_f64(&mut self, val: f64) {
        if !val.is_finite() {
            return;
        }
        self.speed_override = val.round().clamp(5.0, 100.0) as u8;
    }

    /// 设置数字输出 DOUT（1-based 引脚号 1..=8）
    ///
    /// 严格限制：仅在 `OpMode::Manual` 手动模式下允许外部/示教器强置！
    pub fn set_dout(&mut self, pin_1based: usize, value: bool) -> Result<(), &'static str> {
        if self.op_mode != OpMode::Manual {
            return Err("仅在 MANUAL 手动模式下允许手动设置数字输出");
        }
        if !(1..=8).contains(&pin_1based) {
            return Err("数字输出引脚超出范围 (有效范围 1..=8)");
        }
        self.digital_out[pin_1based - 1] = value;
        Ok(())
    }

    /// 设置数字输出 DOUT（0-based 索引号 0..=7）
    pub fn set_dout_index(&mut self, index_0based: usize, value: bool) -> Result<(), &'static str> {
        self.set_dout(index_0based + 1, value)
    }

    /// 由内部程序（如 Rhai 解释器 DO 指令）设置数字输出
    ///
    /// 内部脚本执行时不受手动模式约束，仅校验引脚范围 1..=8。
    pub fn set_dout_internal(
        &mut self,
        pin_1based: usize,
        value: bool,
    ) -> Result<(), &'static str> {
        if !(1..=8).contains(&pin_1based) {
            return Err("数字输出引脚超出范围 (有效范围 1..=8)");
        }
        self.digital_out[pin_1based - 1] = value;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_initial_state() {
        let sm = ControllerStateMachine::new();
        assert_eq!(sm.op_mode, OpMode::Manual);
        assert!(!sm.drives_on);
        assert!(!sm.emergency_stop);
        assert_eq!(sm.speed_override, 100);
        assert_eq!(sm.digital_out, [false; 8]);
        assert!(!sm.plant_online);
        assert!(!sm.can_move());
    }

    #[test]
    fn test_can_move_truth_table() {
        let mut sm = ControllerStateMachine::new();
        // 初始: false, false, false -> can_move false
        assert!(!sm.can_move());

        // plant online but drives off
        sm.plant_online = true;
        assert!(!sm.can_move());

        // drives on, plant online, estop off -> can_move true
        sm.drives_on = true;
        assert!(sm.can_move());

        // estop triggered -> can_move false
        sm.emergency_stop = true;
        assert!(!sm.can_move());

        // plant offline -> can_move false
        sm.emergency_stop = false;
        sm.plant_online = false;
        assert!(!sm.can_move());
    }

    #[test]
    fn test_mode_transitions() {
        let mut sm = ControllerStateMachine::new();
        assert_eq!(sm.op_mode, OpMode::Manual);

        let changed = sm.set_mode(OpMode::Auto);
        assert!(changed);
        assert_eq!(sm.op_mode, OpMode::Auto);

        let changed_same = sm.set_mode(OpMode::Auto);
        assert!(!changed_same);
        assert_eq!(sm.op_mode, OpMode::Auto);

        let changed_back = sm.set_mode(OpMode::Manual);
        assert!(changed_back);
        assert_eq!(sm.op_mode, OpMode::Manual);
    }

    #[test]
    fn test_drives_power_and_estop_lockout() {
        let mut sm = ControllerStateMachine::new();

        // 正常使能与去使能
        assert!(sm.set_drives_power(true).is_ok());
        assert!(sm.drives_on);
        assert!(sm.set_drives_power(false).is_ok());
        assert!(!sm.drives_on);

        // 触发急停：drives_on 强制变为 false
        sm.set_drives_power(true).unwrap();
        assert!(sm.drives_on);
        sm.set_emergency_stop(true);
        assert!(sm.emergency_stop);
        assert!(!sm.drives_on);

        // 急停状态下尝试使能驱动器必须被拒绝
        let err = sm.set_drives_power(true);
        assert!(err.is_err());
        assert!(!sm.drives_on);

        // 释放急停后，电机依然保持下电状态，直到显式重新使能
        sm.set_emergency_stop(false);
        assert!(!sm.emergency_stop);
        assert!(!sm.drives_on);

        assert!(sm.set_drives_power(true).is_ok());
        assert!(sm.drives_on);
    }

    #[test]
    fn test_speed_override_clamping_and_nan_guard() {
        let mut sm = ControllerStateMachine::new();

        sm.set_speed_override(120);
        assert_eq!(sm.speed_override, 100);

        sm.set_speed_override(2);
        assert_eq!(sm.speed_override, 5);

        sm.set_speed_override(50);
        assert_eq!(sm.speed_override, 50);

        // 浮点与 NaN/Inf 测试
        sm.set_speed_override_f64(f64::NAN);
        assert_eq!(sm.speed_override, 50);

        sm.set_speed_override_f64(f64::INFINITY);
        assert_eq!(sm.speed_override, 50);

        sm.set_speed_override_f64(0.0);
        assert_eq!(sm.speed_override, 5);

        sm.set_speed_override_f64(88.4);
        assert_eq!(sm.speed_override, 88);
    }

    #[test]
    fn test_set_dout_manual_guard_and_pins() {
        let mut sm = ControllerStateMachine::new();
        assert_eq!(sm.op_mode, OpMode::Manual);

        // 手动模式下设置合法 pin 1..=8
        assert!(sm.set_dout(1, true).is_ok());
        assert!(sm.digital_out[0]);
        assert!(sm.set_dout(8, true).is_ok());
        assert!(sm.digital_out[7]);

        // 0-based 索引辅助方法
        assert!(sm.set_dout_index(2, true).is_ok());
        assert!(sm.digital_out[2]);

        // 超出范围的 pin
        assert!(sm.set_dout(0, true).is_err());
        assert!(sm.set_dout(9, true).is_err());
        assert!(sm.set_dout_index(8, true).is_err());

        // 切换为 Auto 自动模式后，拒绝手动设置 DOUT
        sm.set_mode(OpMode::Auto);
        assert!(sm.set_dout(1, false).is_err());
        // 之前的值保持不变
        assert!(sm.digital_out[0]);

        // 但内部脚本指令始终允许
        assert!(sm.set_dout_internal(1, false).is_ok());
        assert!(!sm.digital_out[0]);
    }
}
