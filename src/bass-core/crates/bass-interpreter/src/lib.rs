use bass_compiler::CompiledProgram;
use bass_types::{InterpreterState, Joints6D, MotionTarget, Pose6D};
use rhai::debugger::{DebuggerCommand, DebuggerEvent};
use rhai::{ASTNode, Dynamic, Engine, EvalAltResult, ImmutableString, Map, Scope, Stmt, AST};
use serde::{Deserialize, Serialize};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::mpsc::{self, Receiver, SyncSender};
use std::sync::{Arc, Mutex};
use std::thread::{self, JoinHandle};
use thiserror::Error;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "UPPERCASE")]
pub enum MotionType {
    Linear,
    Joint,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum InterpreterEvent {
    SetDigitalOut { pin: usize, state: bool },
    Log(String),
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum StepOutcome {
    YieldedMotion {
        target: MotionTarget,
        vel: f64,
        motion_type: MotionType,
    },
    YieldedWait {
        duration_secs: f64,
    },
    YieldedStep {
        line: usize,
    },
    Completed,
    Error {
        line: Option<usize>,
        message: String,
    },
}

#[derive(Debug, Error)]
pub enum InterpreterError {
    #[error("Rhai 引擎错误: {0}")]
    Engine(String),
    #[error("编译失败 (第 {line} 行): {message}")]
    Compile { line: usize, message: String },
    #[error("未加载已编译程序")]
    NoProgramLoaded,
    #[error("运行时错误 (第 {line:?} 行): {message}")]
    Runtime {
        line: Option<usize>,
        message: String,
    },
    #[error("无效参数: {0}")]
    InvalidArgument(String),
}

#[derive(Debug, Default)]
struct SharedBridge {
    current_line: usize,
    single_step: bool,
    digital_inputs: u32,
    events: Vec<InterpreterEvent>,
    executed_non_yielding: bool,
}

#[derive(Debug, Clone, Copy)]
enum WorkerCmd {
    Continue,
    Abort,
}

struct WorkerSession {
    cmd_tx: Option<SyncSender<WorkerCmd>>,
    out_rx: Option<Receiver<StepOutcome>>,
    cancel: Arc<AtomicBool>,
    handle: Option<JoinHandle<()>>,
}

impl WorkerSession {
    fn shutdown(mut self) {
        self.cancel.store(true, Ordering::Release);
        if let Some(tx) = self.cmd_tx.take() {
            let _ = tx.try_send(WorkerCmd::Abort);
            drop(tx);
        }
        drop(self.out_rx.take());
        if let Some(handle) = self.handle.take() {
            let _ = handle.join();
        }
    }
}

/// 纯 Rust Rhai 机器人程序解释执行引擎，仅消费 `bass-compiler` 产出的 `CompiledProgram`。
pub struct RhaiInterpreter {
    home_joints: Joints6D,
    bridge: Arc<Mutex<SharedBridge>>,
    compiled: Option<CompiledProgram>,
    worker: Option<WorkerSession>,
    state: InterpreterState,
}

impl Drop for RhaiInterpreter {
    fn drop(&mut self) {
        if let Some(worker) = self.worker.take() {
            worker.shutdown();
        }
    }
}

fn dyn_to_f64(val: &Dynamic, ctx: &str) -> Result<f64, Box<EvalAltResult>> {
    if let Ok(f) = val.as_float() {
        if f.is_finite() {
            return Ok(f);
        }
        return Err(format!("{}: 包含非有限浮点数", ctx).into());
    }
    if let Ok(i) = val.as_int() {
        return Ok(i as f64);
    }
    Err(format!("{}: 期望数值，实际类型 {}", ctx, val.type_name()).into())
}

fn dyn_to_usize(val: &Dynamic, ctx: &str) -> Result<usize, Box<EvalAltResult>> {
    if let Ok(i) = val.as_int() {
        if i >= 0 {
            return Ok(i as usize);
        }
        return Err(format!("{}: 不能为负数 {}", ctx, i).into());
    }
    if let Ok(f) = val.as_float() {
        if f.is_finite() && f >= 0.0 && (f - f.round()).abs() < 1e-6 {
            return Ok(f.round() as usize);
        }
    }
    Err(format!("{}: 期望正整数", ctx).into())
}

fn parse_target_dynamic(val: &Dynamic) -> Result<MotionTarget, Box<EvalAltResult>> {
    if let Some(pose) = val.clone().try_cast::<Pose6D>() {
        return Ok(MotionTarget::Pose(pose));
    }
    if let Some(joints) = val.clone().try_cast::<Joints6D>() {
        return Ok(MotionTarget::Joints(joints));
    }
    Err(format!("目标必须为 Pose 或 Joints，实际类型: {}", val.type_name()).into())
}

fn parse_optional_velocity(opts: &Dynamic, default_vel: f64) -> Result<f64, Box<EvalAltResult>> {
    if opts.is_unit() {
        return Ok(default_vel);
    }
    if let Some(m) = opts.clone().try_cast::<Map>() {
        if let Some(v) = m.get("vel") {
            let vel = dyn_to_f64(v, "opts.vel")?;
            if vel <= 0.0 {
                return Err(format!("opts.vel 必须大于 0，实际为 {}", vel).into());
            }
            return Ok(vel);
        }
        return Ok(default_vel);
    }
    let vel = dyn_to_f64(opts, "vel")?;
    if vel <= 0.0 {
        return Err(format!("速度参数必须大于 0，实际为 {}", vel).into());
    }
    Ok(vel)
}

fn yield_to_kernel(
    outcome: StepOutcome,
    out_tx: &SyncSender<StepOutcome>,
    cmd_rx: &Receiver<WorkerCmd>,
    cancel: &AtomicBool,
    pos: rhai::Position,
) -> Result<(), Box<EvalAltResult>> {
    if cancel.load(Ordering::Acquire) {
        return Err(Box::new(EvalAltResult::ErrorTerminated(Dynamic::UNIT, pos)));
    }
    if out_tx.send(outcome).is_err() {
        return Err(Box::new(EvalAltResult::ErrorTerminated(Dynamic::UNIT, pos)));
    }
    match cmd_rx.recv() {
        Ok(WorkerCmd::Continue) if !cancel.load(Ordering::Acquire) => Ok(()),
        _ => Err(Box::new(EvalAltResult::ErrorTerminated(Dynamic::UNIT, pos))),
    }
}

#[allow(deprecated)]
fn resolve_stmt_line(pos: rhai::Position, stmt: &Stmt) -> Option<usize> {
    // Prefer the AST statement's own position over the debugger frame `pos`, because
    // inside `for` / `while` loops `pos` can retain the enclosing loop header line.
    stmt.position()
        .line()
        .or_else(|| match stmt {
            Stmt::Expr(expr) => expr.position().line(),
            _ => None,
        })
        .or_else(|| pos.line())
}

#[allow(deprecated)]
fn create_robot_engine(
    bridge: Arc<Mutex<SharedBridge>>,
    out_tx: SyncSender<StepOutcome>,
    cmd_rx: Arc<Mutex<Receiver<WorkerCmd>>>,
    cancel: Arc<AtomicBool>,
) -> Engine {
    let mut engine = Engine::new();
    engine.set_max_expr_depths(64, 64);
    engine.disable_symbol("eval");

    engine.register_type_with_name::<Pose6D>("Pose6D");
    engine.register_get("x", |p: &mut Pose6D| p.x);
    engine.register_get("y", |p: &mut Pose6D| p.y);
    engine.register_get("z", |p: &mut Pose6D| p.z);
    engine.register_get("a", |p: &mut Pose6D| p.a);
    engine.register_get("b", |p: &mut Pose6D| p.b);
    engine.register_get("c", |p: &mut Pose6D| p.c);

    engine.register_type_with_name::<Joints6D>("Joints6D");

    engine.register_fn(
        "Pose",
        |x: Dynamic, y: Dynamic, z: Dynamic, a: Dynamic, b: Dynamic, c: Dynamic| -> Result<Pose6D, Box<EvalAltResult>> {
            Ok(Pose6D {
                x: dyn_to_f64(&x, "Pose.x")?,
                y: dyn_to_f64(&y, "Pose.y")?,
                z: dyn_to_f64(&z, "Pose.z")?,
                a: dyn_to_f64(&a, "Pose.a")?,
                b: dyn_to_f64(&b, "Pose.b")?,
                c: dyn_to_f64(&c, "Pose.c")?,
            })
        },
    );

    engine.register_fn(
        "Joints",
        |j1: Dynamic, j2: Dynamic, j3: Dynamic, j4: Dynamic, j5: Dynamic, j6: Dynamic| -> Result<Joints6D, Box<EvalAltResult>> {
            Ok(Joints6D {
                values: [
                    dyn_to_f64(&j1, "Joints.j1")?,
                    dyn_to_f64(&j2, "Joints.j2")?,
                    dyn_to_f64(&j3, "Joints.j3")?,
                    dyn_to_f64(&j4, "Joints.j4")?,
                    dyn_to_f64(&j5, "Joints.j5")?,
                    dyn_to_f64(&j6, "Joints.j6")?,
                ],
            })
        },
    );

    engine.register_fn(
        "Offset",
        |base: Pose6D, dx: Dynamic, dy: Dynamic, dz: Dynamic| -> Result<Pose6D, Box<EvalAltResult>> {
            Ok(Pose6D {
                x: base.x + dyn_to_f64(&dx, "Offset.dx")?,
                y: base.y + dyn_to_f64(&dy, "Offset.dy")?,
                z: base.z + dyn_to_f64(&dz, "Offset.dz")?,
                a: base.a,
                b: base.b,
                c: base.c,
            })
        },
    );

    engine.register_fn(
        "Offset",
        |base: Pose6D,
         dx: Dynamic,
         dy: Dynamic,
         dz: Dynamic,
         da: Dynamic,
         db: Dynamic,
         dc: Dynamic|
         -> Result<Pose6D, Box<EvalAltResult>> {
            Ok(Pose6D {
                x: base.x + dyn_to_f64(&dx, "Offset.dx")?,
                y: base.y + dyn_to_f64(&dy, "Offset.dy")?,
                z: base.z + dyn_to_f64(&dz, "Offset.dz")?,
                a: base.a + dyn_to_f64(&da, "Offset.da")?,
                b: base.b + dyn_to_f64(&db, "Offset.db")?,
                c: base.c + dyn_to_f64(&dc, "Offset.dc")?,
            })
        },
    );

    // MoveL (1 参 & 2 参重载)
    for has_opts in [false, true] {
        let otx = out_tx.clone();
        let crx = Arc::clone(&cmd_rx);
        let cnl = Arc::clone(&cancel);
        if !has_opts {
            engine.register_fn("MoveL", move |target: Dynamic| -> Result<(), Box<EvalAltResult>> {
                let parsed = parse_target_dynamic(&target)?;
                // 保持 executed_non_yielding = true，使单步模式下运动完成后能在下一条指令前暂停
                let rx_guard = crx.lock().unwrap();
                yield_to_kernel(
                    StepOutcome::YieldedMotion {
                        target: parsed,
                        vel: 250.0,
                        motion_type: MotionType::Linear,
                    },
                    &otx,
                    &rx_guard,
                    &cnl,
                    rhai::Position::NONE,
                )
            });
        } else {
            engine.register_fn(
                "MoveL",
                move |target: Dynamic, opts: Dynamic| -> Result<(), Box<EvalAltResult>> {
                    let parsed = parse_target_dynamic(&target)?;
                    let vel = parse_optional_velocity(&opts, 250.0)?;
                    let rx_guard = crx.lock().unwrap();
                    yield_to_kernel(
                        StepOutcome::YieldedMotion {
                            target: parsed,
                            vel,
                            motion_type: MotionType::Linear,
                        },
                        &otx,
                        &rx_guard,
                        &cnl,
                        rhai::Position::NONE,
                    )
                },
            );
        }
    }

    // MoveJ (1 参 & 2 参重载)
    for has_opts in [false, true] {
        let otx = out_tx.clone();
        let crx = Arc::clone(&cmd_rx);
        let cnl = Arc::clone(&cancel);
        if !has_opts {
            engine.register_fn("MoveJ", move |target: Dynamic| -> Result<(), Box<EvalAltResult>> {
                let parsed = parse_target_dynamic(&target)?;
                let rx_guard = crx.lock().unwrap();
                yield_to_kernel(
                    StepOutcome::YieldedMotion {
                        target: parsed,
                        vel: 60.0,
                        motion_type: MotionType::Joint,
                    },
                    &otx,
                    &rx_guard,
                    &cnl,
                    rhai::Position::NONE,
                )
            });
        } else {
            engine.register_fn(
                "MoveJ",
                move |target: Dynamic, opts: Dynamic| -> Result<(), Box<EvalAltResult>> {
                    let parsed = parse_target_dynamic(&target)?;
                    let vel = parse_optional_velocity(&opts, 60.0)?;
                    let rx_guard = crx.lock().unwrap();
                    yield_to_kernel(
                        StepOutcome::YieldedMotion {
                            target: parsed,
                            vel,
                            motion_type: MotionType::Joint,
                        },
                        &otx,
                        &rx_guard,
                        &cnl,
                        rhai::Position::NONE,
                    )
                },
            );
        }
    }

    // Wait(sec)
    {
        let otx = out_tx.clone();
        let crx = Arc::clone(&cmd_rx);
        let cnl = Arc::clone(&cancel);
        engine.register_fn("Wait", move |sec: Dynamic| -> Result<(), Box<EvalAltResult>> {
            let s = dyn_to_f64(&sec, "Wait.sec")?.max(0.0);
            let rx_guard = crx.lock().unwrap();
            yield_to_kernel(
                StepOutcome::YieldedWait { duration_secs: s },
                &otx,
                &rx_guard,
                &cnl,
                rhai::Position::NONE,
            )
        });
    }

    // DO(pin, state)
    {
        let br = Arc::clone(&bridge);
        engine.register_fn("DO", move |pin: Dynamic, state: bool| -> Result<(), Box<EvalAltResult>> {
            let p = dyn_to_usize(&pin, "DO.pin")?;
            let mut b = br.lock().unwrap();
            b.events.push(InterpreterEvent::SetDigitalOut { pin: p, state });
            Ok(())
        });
    }

    // DI(pin)
    {
        let br = Arc::clone(&bridge);
        engine.register_fn("DI", move |pin: Dynamic| -> Result<bool, Box<EvalAltResult>> {
            let p = dyn_to_usize(&pin, "DI.pin")?;
            let b = br.lock().unwrap();
            let bit = if (1..=32).contains(&p) {
                (b.digital_inputs & (1 << (p - 1))) != 0
            } else {
                false
            };
            Ok(bit)
        });
    }

    // Log(msg)
    {
        let br = Arc::clone(&bridge);
        engine.register_fn("Log", move |msg: Dynamic| {
            let text = if let Some(s) = msg.clone().try_cast::<ImmutableString>() {
                s.to_string()
            } else {
                msg.to_string()
            };
            let mut b = br.lock().unwrap();
            b.events.push(InterpreterEvent::Log(text));
        });
    }

    // 取消检查守卫：即使脚本处于密集计算循环也能即时停止
    {
        let cnl = Arc::clone(&cancel);
        engine.on_progress(move |_| {
            if cnl.load(Ordering::Acquire) {
                Some(Dynamic::UNIT)
            } else {
                None
            }
        });
    }

    // 语句级调试器：精确更新 current_line 并支持 STEP 单步逐句暂停
    {
        let br = Arc::clone(&bridge);
        let otx = out_tx;
        let crx = cmd_rx;
        let cnl = cancel;
        engine.register_debugger(
            |_engine, debugger| debugger,
            move |_ctx, event, node, _source, pos| {
                if cnl.load(Ordering::Acquire) {
                    return Err(Box::new(EvalAltResult::ErrorTerminated(Dynamic::UNIT, pos)));
                }
                match event {
                    DebuggerEvent::Start => {
                        let mut b = br.lock().unwrap();
                        if let Some(line) = pos.line() {
                            b.current_line = line;
                        }
                        b.executed_non_yielding = true;
                        Ok(DebuggerCommand::StepInto)
                    }
                    DebuggerEvent::Step => {
                        if let ASTNode::Stmt(stmt) = node {
                            if matches!(stmt, Stmt::Noop(_) | Stmt::Block(_)) {
                                return Ok(DebuggerCommand::StepInto);
                            }
                            let resolved_line = resolve_stmt_line(pos, stmt);

                            let should_pause = {
                                let b = br.lock().unwrap();
                                b.single_step && b.executed_non_yielding
                            };

                            if should_pause {
                                let step_line = {
                                    let mut b = br.lock().unwrap();
                                    b.executed_non_yielding = false;
                                    if let Some(line) = resolved_line {
                                        b.current_line = line;
                                    }
                                    b.current_line.max(1)
                                };
                                let rx_guard = crx.lock().unwrap();
                                yield_to_kernel(
                                    StepOutcome::YieldedStep { line: step_line },
                                    &otx,
                                    &rx_guard,
                                    &cnl,
                                    pos,
                                )?;
                            }

                            let mut b = br.lock().unwrap();
                            if let Some(line) = resolved_line {
                                b.current_line = line;
                            }
                            b.executed_non_yielding = true;
                        } else if let ASTNode::Expr(expr) = node {
                            if matches!(expr, rhai::Expr::FnCall(_, _)) {
                                if let Some(line) = expr.position().line().or_else(|| pos.line()) {
                                    let mut b = br.lock().unwrap();
                                    b.current_line = line;
                                }
                            }
                        }
                        Ok(DebuggerCommand::StepInto)
                    }
                    _ => Ok(DebuggerCommand::StepInto),
                }
            },
        );
    }

    engine
}

impl RhaiInterpreter {
    pub fn new() -> Result<Self, InterpreterError> {
        Self::with_home(Joints6D::home())
    }

    pub fn with_home(home_joints: Joints6D) -> Result<Self, InterpreterError> {
        Ok(Self {
            home_joints,
            bridge: Arc::new(Mutex::new(SharedBridge {
                current_line: 1,
                ..Default::default()
            })),
            compiled: None,
            worker: None,
            state: InterpreterState::Idle,
        })
    }

    pub fn set_home_joints(&mut self, home_joints: Joints6D) {
        self.home_joints = home_joints;
    }

    /// 装载由 `bass-compiler` 产出的 `CompiledProgram`。
    pub fn load_program(&mut self, program: CompiledProgram) -> Result<(), InterpreterError> {
        if let Some(worker) = self.worker.take() {
            worker.shutdown();
        }
        {
            let mut b = self.bridge.lock().unwrap();
            b.current_line = 1;
            b.events.clear();
            b.executed_non_yielding = false;
        }
        self.compiled = Some(program);
        self.state = InterpreterState::Ready;
        Ok(())
    }

    fn spawn_worker(&mut self, ast: Arc<AST>) -> Result<(), InterpreterError> {
        let (cmd_tx, cmd_rx) = mpsc::sync_channel::<WorkerCmd>(1);
        let (out_tx, out_rx) = mpsc::sync_channel::<StepOutcome>(1);
        let cancel = Arc::new(AtomicBool::new(false));
        let bridge = Arc::clone(&self.bridge);
        let home_joints = self.home_joints;

        {
            let mut b = bridge.lock().unwrap();
            b.current_line = 1;
            b.executed_non_yielding = false;
        }

        let worker_cancel = Arc::clone(&cancel);
        let worker_out = out_tx.clone();
        let cmd_rx = Arc::new(Mutex::new(cmd_rx));

        let handle = thread::Builder::new()
            .name("bass-rhai-vm".to_string())
            .spawn(move || {
                let engine = create_robot_engine(
                    Arc::clone(&bridge),
                    worker_out.clone(),
                    cmd_rx,
                    Arc::clone(&worker_cancel),
                );
                let mut scope = Scope::new();
                scope.push_constant("HOME", Dynamic::from(home_joints));

                let eval_res = engine.eval_ast_with_scope::<Dynamic>(&mut scope, &ast);
                if worker_cancel.load(Ordering::Acquire) {
                    return;
                }
                match eval_res {
                    Ok(_) => {
                        let _ = worker_out.send(StepOutcome::Completed);
                    }
                    Err(err) => {
                        if matches!(*err, EvalAltResult::ErrorTerminated(..))
                            && worker_cancel.load(Ordering::Acquire)
                        {
                            return;
                        }
                        let line = err
                            .position()
                            .line()
                            .or_else(|| Some(bridge.lock().unwrap().current_line));
                        let _ = worker_out.send(StepOutcome::Error {
                            line,
                            message: err.to_string(),
                        });
                    }
                }
            })
            .map_err(|e| InterpreterError::Engine(format!("启动 Rhai 执行线程失败: {}", e)))?;

        self.worker = Some(WorkerSession {
            cmd_tx: Some(cmd_tx),
            out_rx: Some(out_rx),
            cancel,
            handle: Some(handle),
        });
        Ok(())
    }

    pub fn step_instruction(&mut self) -> Result<StepOutcome, InterpreterError> {
        let Some(compiled) = self.compiled.clone() else {
            return Err(InterpreterError::NoProgramLoaded);
        };

        if self.worker.is_none() {
            self.spawn_worker(Arc::clone(&compiled.ast))?;
        } else if let Some(ref worker) = self.worker {
            if let Some(ref tx) = worker.cmd_tx {
                if tx.send(WorkerCmd::Continue).is_err() {
                    self.worker.take().map(WorkerSession::shutdown);
                    self.state = InterpreterState::Completed;
                    return Ok(StepOutcome::Completed);
                }
            }
        }

        let outcome = {
            let worker = self.worker.as_ref().ok_or(InterpreterError::NoProgramLoaded)?;
            let rx = worker
                .out_rx
                .as_ref()
                .ok_or_else(|| InterpreterError::Runtime {
                    line: None,
                    message: "执行通道已关闭".to_string(),
                })?;
            rx.recv().map_err(|_| InterpreterError::Runtime {
                line: Some(self.current_line()),
                message: "Rhai 工作线程意外中断".to_string(),
            })?
        };

        match &outcome {
            StepOutcome::YieldedMotion { .. } | StepOutcome::YieldedWait { .. } => {
                self.state = InterpreterState::Running;
            }
            StepOutcome::YieldedStep { .. } => {
                self.state = InterpreterState::Paused;
            }
            StepOutcome::Completed => {
                self.state = InterpreterState::Completed;
                if let Some(worker) = self.worker.take() {
                    worker.shutdown();
                }
            }
            StepOutcome::Error { .. } => {
                self.state = InterpreterState::Error;
                if let Some(worker) = self.worker.take() {
                    worker.shutdown();
                }
            }
        }

        Ok(outcome)
    }

    pub fn reset(&mut self) {
        if let Some(worker) = self.worker.take() {
            worker.shutdown();
        }
        {
            let mut b = self.bridge.lock().unwrap();
            b.current_line = 1;
            b.events.clear();
            b.executed_non_yielding = false;
        }
        self.state = if self.compiled.is_some() {
            InterpreterState::Ready
        } else {
            InterpreterState::Idle
        };
    }

    pub fn set_single_step(&mut self, enabled: bool) {
        let mut b = self.bridge.lock().unwrap();
        b.single_step = enabled;
    }

    pub fn is_single_step(&self) -> bool {
        self.bridge.lock().unwrap().single_step
    }

    pub fn current_line(&self) -> usize {
        self.bridge.lock().unwrap().current_line
    }

    pub fn set_digital_inputs(&mut self, mask: u32) {
        let mut b = self.bridge.lock().unwrap();
        b.digital_inputs = mask;
    }

    pub fn state(&self) -> InterpreterState {
        self.state
    }

    pub fn set_state(&mut self, state: InterpreterState) {
        self.state = state;
    }

    pub fn drain_events(&mut self) -> Vec<InterpreterEvent> {
        let mut b = self.bridge.lock().unwrap();
        std::mem::take(&mut b.events)
    }

    pub fn loaded_program_name(&self) -> Option<&str> {
        self.compiled.as_ref().map(|c| c.name.as_str())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use bass_compiler::RobotCompiler;
    use bass_motion::Serial6DofKinematics;
    use std::path::{Path, PathBuf};

    fn test_runtime_cell_dir() -> PathBuf {
        let candidates = [
            "../../../../runtime/instances/default_cell",
            "../../../../instances/default_cell",
            "../../../runtime/instances/default_cell",
            "../../runtime/instances/default_cell",
        ];
        for rel in candidates {
            let p = Path::new(env!("CARGO_MANIFEST_DIR")).join(rel);
            if p.exists() {
                return p;
            }
        }
        PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../../../../runtime/instances/default_cell")
    }

    fn test_compiler() -> RobotCompiler {
        let model_path = test_runtime_cell_dir().join("config/robot_model.json");
        RobotCompiler::new(Serial6DofKinematics::from_json_file(model_path).unwrap())
    }

    fn _assert_send<T: Send>() {}

    #[test]
    fn test_interpreter_is_send() {
        _assert_send::<RhaiInterpreter>();
    }

    #[test]
    fn test_dsl_int_float_coercion_and_offset() {
        let compiler = test_compiler();
        let src = r#"
let p = Pose(-220, 420.0, 340, 0, 0.0, 180);
let q = Offset(p, 0, 140, 0);
MoveJ(HOME, 50);
MoveL(q, #{ vel: 120 });
"#;
        let prog = compiler.compile("Coerce.rhai", src).unwrap();
        let mut interp = RhaiInterpreter::new().unwrap();
        interp.load_program(prog).unwrap();

        match interp.step_instruction().unwrap() {
            StepOutcome::YieldedMotion {
                target: MotionTarget::Joints(j),
                vel,
                motion_type: MotionType::Joint,
            } => {
                assert_eq!(j, Joints6D::home());
                assert!((vel - 50.0).abs() < 1e-6);
            }
            other => panic!("预期 HOME MoveJ，实际 {:?}", other),
        }

        match interp.step_instruction().unwrap() {
            StepOutcome::YieldedMotion {
                target: MotionTarget::Pose(p),
                vel,
                motion_type: MotionType::Linear,
            } => {
                assert!((p.x - (-220.0)).abs() < 1e-6);
                assert!((p.y - 560.0).abs() < 1e-6);
                assert!((p.z - 340.0).abs() < 1e-6);
                assert!((vel - 120.0).abs() < 1e-6);
            }
            other => panic!("预期 Offset MoveL，实际 {:?}", other),
        }

        assert!(matches!(interp.step_instruction().unwrap(), StepOutcome::Completed));
    }

    #[test]
    fn test_do_di_wait_and_log_execution() {
        let compiler = test_compiler();
        let src = r#"
DO(1, true);
if DI(2) {
    Log("DI2 high");
}
Wait(0.25);
DO(1, false);
"#;
        let prog = compiler.compile("IoLoop.rhai", src).unwrap();
        let mut interp = RhaiInterpreter::new().unwrap();
        interp.set_digital_inputs(0b0010); // DI 2 = true
        interp.load_program(prog).unwrap();

        match interp.step_instruction().unwrap() {
            StepOutcome::YieldedWait { duration_secs } => assert!((duration_secs - 0.25).abs() < 1e-6),
            other => panic!("预期 YieldedWait，实际 {:?}", other),
        }

        let events = interp.drain_events();
        assert!(events.contains(&InterpreterEvent::SetDigitalOut { pin: 1, state: true }));
        assert!(events.contains(&InterpreterEvent::Log("DI2 high".to_string())));

        assert!(matches!(interp.step_instruction().unwrap(), StepOutcome::Completed));
        let events2 = interp.drain_events();
        assert!(events2.contains(&InterpreterEvent::SetDigitalOut { pin: 1, state: false }));
    }

    #[test]
    fn test_single_step_line_by_line_and_reset() {
        let compiler = test_compiler();
        let src = r#"let p = Pose(-220.0, 420.0, 340.0, 0.0, 0.0, 180.0);
DO(1, true);
MoveL(p, 100);
Log("done");
"#;
        let prog = compiler.compile("StepDemo.rhai", src).unwrap();
        let mut interp = RhaiInterpreter::new().unwrap();
        interp.load_program(prog).unwrap();
        interp.set_single_step(true);

        // 第 1 步执行 `let p = ...`，在下一条 DO(1, true) 前暂停
        let s1 = interp.step_instruction().unwrap();
        assert_eq!(s1, StepOutcome::YieldedStep { line: 2 });
        assert_eq!(interp.state(), InterpreterState::Paused);

        // 第 2 步执行 DO(1, true)，在 MoveL 前暂停
        let s2 = interp.step_instruction().unwrap();
        assert!(matches!(s2, StepOutcome::YieldedStep { line: 3 }));

        // 第 3 步执行 MoveL，返回 YieldedMotion
        let s3 = interp.step_instruction().unwrap();
        assert!(matches!(s3, StepOutcome::YieldedMotion { .. }));

        // 执行中途 Reset 应干净终止线程并回到 Ready
        interp.reset();
        assert_eq!(interp.state(), InterpreterState::Ready);

        // Reset 后可从头重新连续运行直至 Completed
        interp.set_single_step(false);
        let r1 = interp.step_instruction().unwrap();
        assert!(matches!(r1, StepOutcome::YieldedMotion { .. }));
        let r2 = interp.step_instruction().unwrap();
        assert!(matches!(r2, StepOutcome::Completed));
    }

    #[test]
    fn test_running_pointer_tracks_movesquare_and_loop_lines() {
        let compiler = test_compiler();
        let cell_dir = test_runtime_cell_dir();
        let move_square_src =
            std::fs::read_to_string(cell_dir.join("programs/MoveSquare.rhai")).unwrap();
        let prog = compiler.compile("MoveSquare.rhai", &move_square_src).unwrap();

        let mut interp = RhaiInterpreter::new().unwrap();
        interp.load_program(prog).unwrap();
        interp.set_single_step(false);

        let mut observed_lines = Vec::new();
        loop {
            let out = interp.step_instruction().unwrap();
            match out {
                StepOutcome::YieldedMotion { .. } | StepOutcome::YieldedWait { .. } => {
                    observed_lines.push(interp.current_line());
                }
                StepOutcome::Completed => break,
                other => panic!("意外执行结果: {:?}", other),
            }
        }
        assert_eq!(observed_lines, vec![8, 11, 15, 16, 17, 18, 21, 22]);

        let pick_place_src =
            std::fs::read_to_string(cell_dir.join("programs/PickAndPlace.rhai")).unwrap();
        let prog2 = compiler
            .compile("PickAndPlace.rhai", &pick_place_src)
            .unwrap();
        interp.load_program(prog2).unwrap();
        interp.set_single_step(false);

        let mut loop_lines = Vec::new();
        loop {
            let out = interp.step_instruction().unwrap();
            match out {
                StepOutcome::YieldedMotion { .. } | StepOutcome::YieldedWait { .. } => {
                    loop_lines.push(interp.current_line());
                }
                StepOutcome::Completed => break,
                other => panic!("意外循环执行结果: {:?}", other),
            }
        }
        assert_eq!(
            loop_lines,
            vec![
                7,
                14, 17, 19, 22, 26, 29, 31, 34,
                14, 17, 19, 22, 26, 29, 31, 34,
                14, 17, 19, 22, 26, 29, 31, 34,
                38
            ]
        );
    }
}
