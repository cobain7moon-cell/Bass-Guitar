use bass_motion::{KinematicsEngine, MotionError, Serial6DofKinematics};
use bass_types::{Joints6D, Pose6D};
use rhai::{
    ASTNode, Dynamic, Engine, Expr, FnCallExpr, OptimizationLevel, Stmt, StmtBlock, AST,
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fmt;
use std::sync::Arc;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "UPPERCASE")]
pub enum DiagnosticSeverity {
    Info,
    Warning,
    Error,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "UPPERCASE")]
pub enum CompileStage {
    Syntax,
    Semantic,
    Lowering,
    Codegen,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CompileDiagnostic {
    pub severity: DiagnosticSeverity,
    pub stage: CompileStage,
    pub line: usize,
    pub column: usize,
    pub message: String,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(tag = "op", rename_all = "snake_case")]
pub enum IrOp {
    DefineSymbol { name: String, value_kind: String },
    MoveJ { target_desc: String, velocity_spec: Option<f64> },
    MoveL { target_desc: String, velocity_spec: Option<f64> },
    Wait { seconds_desc: String },
    SetDO { pin: String, state: String },
    ReadDI { pin: String },
    Log { message_desc: String },
    LoopStart { kind: String, count_hint: Option<usize> },
    IfBranch { condition_desc: String },
    FnCall { name: String, arg_count: usize },
    OtherStmt { kind: String },
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct IrInstruction {
    pub seq: usize,
    pub line: usize,
    pub op: IrOp,
    pub summary: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Default, Serialize, Deserialize)]
pub struct IrStats {
    pub total_instructions: usize,
    pub motion_count: usize,
    pub io_count: usize,
    pub wait_count: usize,
    pub static_ik_checked: usize,
    pub symbol_count: usize,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct RobotProgramIR {
    pub program_name: String,
    pub source_hash: String,
    pub instructions: Vec<IrInstruction>,
    pub stats: IrStats,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct CompileReport {
    pub ok: bool,
    pub program_name: String,
    pub source_hash: String,
    pub diagnostics: Vec<CompileDiagnostic>,
    pub ir: Option<RobotProgramIR>,
}

#[derive(Debug, Clone)]
pub struct CompileFailure {
    pub report: CompileReport,
}

impl CompileFailure {
    pub fn primary_diagnostic(&self) -> Option<&CompileDiagnostic> {
        self.report
            .diagnostics
            .iter()
            .find(|d| d.severity == DiagnosticSeverity::Error)
            .or_else(|| self.report.diagnostics.first())
    }

    pub fn first_error_line(&self) -> Option<usize> {
        self.primary_diagnostic()
            .map(|d| d.line)
            .filter(|&line| line > 0)
    }
}

impl fmt::Display for CompileFailure {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        if let Some(diag) = self.primary_diagnostic() {
            if diag.line > 0 {
                write!(f, "第 {} 行 [{:?}]: {}", diag.line, diag.stage, diag.message)
            } else {
                write!(f, "[{:?}]: {}", diag.stage, diag.message)
            }
        } else {
            write!(f, "程序编译失败")
        }
    }
}

impl std::error::Error for CompileFailure {}

#[derive(Debug, Clone)]
pub struct CompiledProgram {
    pub name: String,
    pub source: String,
    pub source_hash: String,
    pub ir: RobotProgramIR,
    pub diagnostics: Vec<CompileDiagnostic>,
    pub ast: Arc<AST>,
}

impl CompiledProgram {
    pub fn to_report(&self) -> CompileReport {
        CompileReport {
            ok: true,
            program_name: self.name.clone(),
            source_hash: self.source_hash.clone(),
            diagnostics: self.diagnostics.clone(),
            ir: Some(self.ir.clone()),
        }
    }
}

#[derive(Debug, Clone)]
enum ConstVal {
    Number(f64),
    Bool(bool),
    Text(String),
    Pose(Pose6D),
    Joints(Joints6D),
    Map(HashMap<String, ConstVal>),
    Unknown,
}

impl ConstVal {
    fn kind_name(&self) -> &'static str {
        match self {
            ConstVal::Number(_) => "number",
            ConstVal::Bool(_) => "bool",
            ConstVal::Text(_) => "string",
            ConstVal::Pose(_) => "Pose6D",
            ConstVal::Joints(_) => "Joints6D",
            ConstVal::Map(_) => "map",
            ConstVal::Unknown => "dynamic",
        }
    }

    fn as_f64(&self) -> Option<f64> {
        match self {
            ConstVal::Number(v) => Some(*v),
            _ => None,
        }
    }

    fn describe(&self) -> String {
        match self {
            ConstVal::Pose(p) => format!(
                "Pose({:.1}, {:.1}, {:.1}, {:.1}, {:.1}, {:.1})",
                p.x, p.y, p.z, p.a, p.b, p.c
            ),
            ConstVal::Joints(j) => format!(
                "Joints({:.1}, {:.1}, {:.1}, {:.1}, {:.1}, {:.1})",
                j.values[0], j.values[1], j.values[2], j.values[3], j.values[4], j.values[5]
            ),
            ConstVal::Number(v) => format!("{:.3}", v),
            ConstVal::Bool(b) => b.to_string(),
            ConstVal::Text(s) => format!("{:?}", s),
            ConstVal::Map(_) => "#{...}".to_string(),
            ConstVal::Unknown => "<dynamic>".to_string(),
        }
    }
}

/// 纯 Rust 四阶段编译器：语法分析 -> 语义与逆解预检 -> IR 指令转换 -> 执行包生成。
#[derive(Debug, Clone)]
pub struct RobotCompiler {
    kinematics: Serial6DofKinematics,
}

impl RobotCompiler {
    pub fn new(kinematics: Serial6DofKinematics) -> Self {
        Self { kinematics }
    }

    pub fn kinematics(&self) -> &Serial6DofKinematics {
        &self.kinematics
    }

    /// 执行完整的 4 阶段编译流水线。
    pub fn compile(&self, name: &str, source: &str) -> Result<CompiledProgram, CompileFailure> {
        let source_hash = fnv1a_hex(source.as_bytes());
        let mut diagnostics: Vec<CompileDiagnostic> = Vec::new();

        // 阶段 1：语法分析 (Syntax Analysis)
        let ast = match self.stage1_syntax_parse(source) {
            Ok(ast) => ast,
            Err(diag) => {
                diagnostics.push(diag);
                return Err(CompileFailure {
                    report: CompileReport {
                        ok: false,
                        program_name: name.to_string(),
                        source_hash,
                        diagnostics,
                        ir: None,
                    },
                });
            }
        };

        // 阶段 2：语义分析与静态运动学检查 (Semantic Analysis + Joint Limit / IK Pre-check)
        let mut sem_ctx = SemanticContext::new(&self.kinematics);
        sem_ctx.check_ast(&ast);
        let static_ik_checked = sem_ctx.static_ik_checked;
        let symbol_count = sem_ctx.symbol_count;
        diagnostics.extend(sem_ctx.diagnostics);

        let has_errors = diagnostics
            .iter()
            .any(|d| d.severity == DiagnosticSeverity::Error);
        if has_errors {
            return Err(CompileFailure {
                report: CompileReport {
                    ok: false,
                    program_name: name.to_string(),
                    source_hash,
                    diagnostics,
                    ir: None,
                },
            });
        }

        // 阶段 3：指令转换生成结构化中间表示 (Instruction Lowering -> RobotProgramIR)
        let ir = self.stage3_lower_to_ir(
            name,
            &source_hash,
            &ast,
            static_ik_checked,
            symbol_count,
        );

        // 阶段 4：代码生成与可执行封装 (Codegen -> CompiledProgram)
        Ok(self.stage4_codegen(name, source, &source_hash, ir, diagnostics, ast))
    }

    /// 编译并返回统一的 JSON 诊断报告（适用于前端编译面板）。
    pub fn analyze(&self, name: &str, source: &str) -> CompileReport {
        match self.compile(name, source) {
            Ok(prog) => prog.to_report(),
            Err(fail) => fail.report,
        }
    }

    fn stage1_syntax_parse(&self, source: &str) -> Result<AST, CompileDiagnostic> {
        let mut engine = Engine::new();
        engine.set_optimization_level(OptimizationLevel::Simple);
        engine.compile(source).map_err(|err| {
            let line = err.position().line().unwrap_or(1);
            let column = err.position().position().unwrap_or(1);
            CompileDiagnostic {
                severity: DiagnosticSeverity::Error,
                stage: CompileStage::Syntax,
                line,
                column,
                message: format!("语法解析错误: {}", err.err_type()),
            }
        })
    }

    fn stage3_lower_to_ir(
        &self,
        name: &str,
        source_hash: &str,
        ast: &AST,
        static_ik_checked: usize,
        symbol_count: usize,
    ) -> RobotProgramIR {
        let mut lowerer = IrLowerer::new(&self.kinematics);
        lowerer.lower_block(ast.statements());
        let mut stats = lowerer.stats;
        stats.static_ik_checked = static_ik_checked;
        stats.symbol_count = symbol_count;
        stats.total_instructions = lowerer.instructions.len();
        RobotProgramIR {
            program_name: name.to_string(),
            source_hash: source_hash.to_string(),
            instructions: lowerer.instructions,
            stats,
        }
    }

    fn stage4_codegen(
        &self,
        name: &str,
        source: &str,
        source_hash: &str,
        ir: RobotProgramIR,
        diagnostics: Vec<CompileDiagnostic>,
        ast: AST,
    ) -> CompiledProgram {
        CompiledProgram {
            name: name.to_string(),
            source: source.to_string(),
            source_hash: source_hash.to_string(),
            ir,
            diagnostics,
            ast: Arc::new(ast),
        }
    }
}

struct SemanticContext<'a> {
    kinematics: &'a Serial6DofKinematics,
    symbols: HashMap<String, ConstVal>,
    seed_q: Joints6D,
    diagnostics: Vec<CompileDiagnostic>,
    static_ik_checked: usize,
    symbol_count: usize,
}

impl<'a> SemanticContext<'a> {
    fn new(kinematics: &'a Serial6DofKinematics) -> Self {
        let home = kinematics.home_joints();
        let mut symbols = HashMap::new();
        symbols.insert("HOME".to_string(), ConstVal::Joints(home));
        Self {
            kinematics,
            symbols,
            seed_q: home,
            diagnostics: Vec::new(),
            static_ik_checked: 0,
            symbol_count: 1,
        }
    }

    fn push_error(&mut self, line: usize, column: usize, message: impl Into<String>) {
        self.diagnostics.push(CompileDiagnostic {
            severity: DiagnosticSeverity::Error,
            stage: CompileStage::Semantic,
            line,
            column,
            message: message.into(),
        });
    }

    fn check_ast(&mut self, ast: &AST) {
        self.check_stmts(ast.statements());
        // 使用 rhai::AST::walk 遍历（含自定义 fn 函数体内部）捕获禁用符号与越界静态参数
        let mut extra_errors: Vec<(usize, usize, String)> = Vec::new();
        let _ = ast.walk(&mut |path| {
            let call_info = match path.last() {
                Some(ASTNode::Expr(Expr::FnCall(call, pos))) => Some((call, *pos)),
                Some(ASTNode::Stmt(Stmt::FnCall(call, pos))) => Some((call, *pos)),
                _ => None,
            };
            if let Some((call, pos)) = call_info {
                let fn_name = call.name.as_str();
                if matches!(fn_name, "eval") {
                    extra_errors.push((
                        pos.line().unwrap_or(1),
                        pos.position().unwrap_or(1),
                        format!("安全沙箱禁止调用 `{}`", fn_name),
                    ));
                }
            }
            true
        });
        for (line, col, msg) in extra_errors {
            self.push_error(line, col, msg);
        }
    }

    fn check_stmts(&mut self, stmts: &[Stmt]) {
        for stmt in stmts {
            self.check_stmt(stmt);
        }
    }

    fn check_stmt(&mut self, stmt: &Stmt) {
        let pos = stmt.position();
        let line = pos.line().unwrap_or(1);
        let col = pos.position().unwrap_or(1);

        match stmt {
            Stmt::Noop(_) | Stmt::Import(..) | Stmt::Export(..) => {}
            Stmt::Var(inner, _, _) => {
                let (ident, expr, _) = &**inner;
                let val = self.eval_expr_and_check(expr);
                self.symbols.insert(ident.name.to_string(), val);
                self.symbol_count = self.symbols.len();
            }
            Stmt::Assignment(inner) => {
                let (_, bin) = &**inner;
                let _ = self.eval_expr_and_check(&bin.rhs);
                if let Expr::Variable(var_info, _, _) = &bin.lhs {
                    // 被二次赋值的变量在分支/循环中不再视为纯静态常量
                    self.symbols.insert(var_info.1.to_string(), ConstVal::Unknown);
                } else {
                    let _ = self.eval_expr_and_check(&bin.lhs);
                }
            }
            Stmt::FnCall(call, fn_pos) => {
                let fn_line = fn_pos.line().unwrap_or(line);
                let fn_col = fn_pos.position().unwrap_or(col);
                let _ = self.check_fn_call(call, fn_line, fn_col);
            }
            Stmt::Expr(expr) => {
                let _ = self.eval_expr_and_check(expr);
            }
            Stmt::Block(block) => {
                self.check_block(block);
            }
            Stmt::If(fc, _) => {
                let _ = self.eval_expr_and_check(&fc.expr);
                self.check_block(&fc.body);
                self.check_block(&fc.branch);
            }
            Stmt::While(fc, _) => {
                let _ = self.eval_expr_and_check(&fc.expr);
                self.check_block(&fc.body);
            }
            Stmt::Do(fc, _, _) => {
                self.check_block(&fc.body);
                let _ = self.eval_expr_and_check(&fc.expr);
            }
            Stmt::For(inner, _) => {
                let (ident, _, fc) = &**inner;
                let _ = self.eval_expr_and_check(&fc.expr);
                self.symbols.insert(ident.name.to_string(), ConstVal::Unknown);
                self.check_block(&fc.body);
            }
            Stmt::Switch(inner, _) => {
                let _ = self.eval_expr_and_check(&inner.0);
                // 分支语句体在 run 期间决定
            }
            Stmt::TryCatch(fc, _) => {
                self.check_block(&fc.body);
                self.check_block(&fc.branch);
            }
            Stmt::BreakLoop(opt_expr, _, _) | Stmt::Return(opt_expr, _, _) => {
                if let Some(expr) = opt_expr {
                    let _ = self.eval_expr_and_check(expr);
                }
            }
            _ => {}
        }
    }

    fn check_block(&mut self, block: &StmtBlock) {
        self.check_stmts(block.statements());
    }

    fn eval_expr_and_check(&mut self, expr: &Expr) -> ConstVal {
        let pos = expr.start_position();
        let line = pos.line().unwrap_or(1);
        let col = pos.position().unwrap_or(1);

        match expr {
            Expr::DynamicConstant(dyn_val, _) => dynamic_to_const(dyn_val),
            Expr::BoolConstant(b, _) => ConstVal::Bool(*b),
            Expr::IntegerConstant(n, _) => ConstVal::Number(*n as f64),
            Expr::FloatConstant(f, _) => ConstVal::Number(*f.as_ref()),
            Expr::StringConstant(s, _) => ConstVal::Text(s.to_string()),
            Expr::Variable(var_info, _, _) => self
                .symbols
                .get(var_info.1.as_str())
                .cloned()
                .unwrap_or(ConstVal::Unknown),
            Expr::Array(items, _) => {
                for item in items.iter() {
                    let _ = self.eval_expr_and_check(item);
                }
                ConstVal::Unknown
            }
            Expr::InterpolatedString(items, _) => {
                for item in items.iter() {
                    let _ = self.eval_expr_and_check(item);
                }
                ConstVal::Unknown
            }
            Expr::Map(map_info, _) => {
                let (pairs, _) = &**map_info;
                let mut m = HashMap::new();
                for (ident, val_expr) in pairs.iter() {
                    let v = self.eval_expr_and_check(val_expr);
                    m.insert(ident.name.to_string(), v);
                }
                ConstVal::Map(m)
            }
            Expr::FnCall(call, fn_pos) => {
                let fn_line = fn_pos.line().unwrap_or(line);
                let fn_col = fn_pos.position().unwrap_or(col);
                self.check_fn_call(call, fn_line, fn_col)
            }
            Expr::MethodCall(call, fn_pos) => {
                let fn_line = fn_pos.line().unwrap_or(line);
                let fn_col = fn_pos.position().unwrap_or(col);
                for arg in call.args.iter() {
                    let _ = self.eval_expr_and_check(arg);
                }
                if call.name == "eval" {
                    self.push_error(fn_line, fn_col, "安全沙箱禁止调用 `eval`");
                }
                ConstVal::Unknown
            }
            Expr::Stmt(block) => {
                self.check_block(block);
                ConstVal::Unknown
            }
            Expr::Dot(bin, _, _) | Expr::Index(bin, _, _) => {
                let _ = self.eval_expr_and_check(&bin.lhs);
                let _ = self.eval_expr_and_check(&bin.rhs);
                ConstVal::Unknown
            }
            Expr::And(items, _) | Expr::Or(items, _) | Expr::Coalesce(items, _) => {
                for item in items.iter() {
                    let _ = self.eval_expr_and_check(item);
                }
                ConstVal::Unknown
            }
            _ => ConstVal::Unknown,
        }
    }

    fn check_fn_call(&mut self, call: &FnCallExpr, line: usize, col: usize) -> ConstVal {
        let args: Vec<ConstVal> = call
            .args
            .iter()
            .map(|a| self.eval_expr_and_check(a))
            .collect();

        match call.name.as_str() {
            "-" if args.len() == 1 => match args[0] {
                ConstVal::Number(v) => ConstVal::Number(-v),
                _ => ConstVal::Unknown,
            },
            "+" if args.len() == 2 => match (&args[0], &args[1]) {
                (ConstVal::Number(a), ConstVal::Number(b)) => ConstVal::Number(a + b),
                _ => ConstVal::Unknown,
            },
            "-" if args.len() == 2 => match (&args[0], &args[1]) {
                (ConstVal::Number(a), ConstVal::Number(b)) => ConstVal::Number(a - b),
                _ => ConstVal::Unknown,
            },
            "*" if args.len() == 2 => match (&args[0], &args[1]) {
                (ConstVal::Number(a), ConstVal::Number(b)) => ConstVal::Number(a * b),
                _ => ConstVal::Unknown,
            },
            "/" if args.len() == 2 => match (&args[0], &args[1]) {
                (ConstVal::Number(a), ConstVal::Number(b)) if b.abs() > 1e-12 => {
                    ConstVal::Number(a / b)
                }
                _ => ConstVal::Unknown,
            },
            "Pose" => self.check_pose_call(&args, line, col),
            "Joints" => self.check_joints_call(&args, line, col),
            "Offset" => self.check_offset_call(&args, line, col),
            "MoveJ" => {
                self.check_motion_call("MoveJ", &args, line, col);
                ConstVal::Unknown
            }
            "MoveL" => {
                self.check_motion_call("MoveL", &args, line, col);
                ConstVal::Unknown
            }
            "Wait" => {
                if args.len() != 1 {
                    self.push_error(
                        line,
                        col,
                        format!("Wait(sec) 需要 1 个参数，实际传入 {} 个", args.len()),
                    );
                } else if let Some(sec) = args[0].as_f64() {
                    if !sec.is_finite() || sec < 0.0 {
                        self.push_error(
                            line,
                            col,
                            format!("Wait 时间必须为非负有限数值，实际为 {}", sec),
                        );
                    }
                } else if !matches!(args[0], ConstVal::Unknown) {
                    self.push_error(line, col, "Wait(sec) 参数必须为数值类型");
                }
                ConstVal::Unknown
            }
            "DO" => {
                if args.len() != 2 {
                    self.push_error(
                        line,
                        col,
                        format!("DO(pin, state) 需要 2 个参数，实际传入 {} 个", args.len()),
                    );
                } else {
                    if let Some(pin) = args[0].as_f64() {
                        let pin_int = pin.round() as i64;
                        if (pin - pin_int as f64).abs() > 1e-6 || !(1..=8).contains(&pin_int) {
                            self.push_error(
                                line,
                                col,
                                format!("DO 通道号必须为 1..=8 的整数，实际为 {}", pin),
                            );
                        }
                    } else if !matches!(args[0], ConstVal::Unknown) {
                        self.push_error(line, col, "DO 第 1 个参数 (pin) 必须为整数");
                    }

                    if !matches!(args[1], ConstVal::Bool(_) | ConstVal::Unknown) {
                        self.push_error(line, col, "DO 第 2 个参数 (state) 必须为布尔值 true/false");
                    }
                }
                ConstVal::Unknown
            }
            "DI" => {
                if args.len() != 1 {
                    self.push_error(
                        line,
                        col,
                        format!("DI(pin) 需要 1 个参数，实际传入 {} 个", args.len()),
                    );
                } else if let Some(pin) = args[0].as_f64() {
                    let pin_int = pin.round() as i64;
                    if (pin - pin_int as f64).abs() > 1e-6 || !(1..=32).contains(&pin_int) {
                        self.push_error(
                            line,
                            col,
                            format!("DI 通道号必须为 1..=32 的整数，实际为 {}", pin),
                        );
                    }
                } else if !matches!(args[0], ConstVal::Unknown) {
                    self.push_error(line, col, "DI 参数 (pin) 必须为整数");
                }
                ConstVal::Unknown
            }
            "Log" => {
                if args.is_empty() {
                    self.push_error(line, col, "Log(msg) 至少需要 1 个参数");
                }
                ConstVal::Unknown
            }
            _ => ConstVal::Unknown,
        }
    }

    fn check_pose_call(&mut self, args: &[ConstVal], line: usize, col: usize) -> ConstVal {
        if args.len() != 6 {
            self.push_error(
                line,
                col,
                format!("Pose(x, y, z, a, b, c) 需要 6 个参数，实际传入 {} 个", args.len()),
            );
            return ConstVal::Unknown;
        }
        let mut vals = [0.0; 6];
        for (i, arg) in args.iter().enumerate() {
            match arg {
                ConstVal::Number(v) => {
                    if !v.is_finite() {
                        self.push_error(line, col, format!("Pose 第 {} 个参数不是有限数值", i + 1));
                        return ConstVal::Unknown;
                    }
                    vals[i] = *v;
                }
                ConstVal::Unknown => return ConstVal::Unknown,
                other => {
                    self.push_error(
                        line,
                        col,
                        format!("Pose 第 {} 个参数类型无效: {}", i + 1, other.kind_name()),
                    );
                    return ConstVal::Unknown;
                }
            }
        }
        ConstVal::Pose(Pose6D {
            x: vals[0],
            y: vals[1],
            z: vals[2],
            a: vals[3],
            b: vals[4],
            c: vals[5],
        })
    }

    fn check_joints_call(&mut self, args: &[ConstVal], line: usize, col: usize) -> ConstVal {
        if args.len() != 6 {
            self.push_error(
                line,
                col,
                format!("Joints(j1..j6) 需要 6 个参数，实际传入 {} 个", args.len()),
            );
            return ConstVal::Unknown;
        }
        let (min_lim, max_lim) = self.kinematics.joint_limits();
        let mut vals = [0.0; 6];
        for (i, arg) in args.iter().enumerate() {
            match arg {
                ConstVal::Number(v) => {
                    if !v.is_finite() {
                        self.push_error(line, col, format!("Joints 第 {} 轴不是有限数值", i + 1));
                        return ConstVal::Unknown;
                    }
                    if *v < min_lim[i] || *v > max_lim[i] {
                        self.push_error(
                            line,
                            col,
                            format!(
                                "Joints 静态预检超限: J{} = {:.2}° 超出 [{:.1}°, {:.1}°]",
                                i + 1,
                                v,
                                min_lim[i],
                                max_lim[i]
                            ),
                        );
                        return ConstVal::Unknown;
                    }
                    vals[i] = *v;
                }
                ConstVal::Unknown => return ConstVal::Unknown,
                other => {
                    self.push_error(
                        line,
                        col,
                        format!("Joints 第 {} 个参数类型无效: {}", i + 1, other.kind_name()),
                    );
                    return ConstVal::Unknown;
                }
            }
        }
        ConstVal::Joints(Joints6D { values: vals })
    }

    fn check_offset_call(&mut self, args: &[ConstVal], line: usize, col: usize) -> ConstVal {
        if args.len() != 4 && args.len() != 7 {
            self.push_error(
                line,
                col,
                format!("Offset 需要 4 或 7 个参数，实际传入 {} 个", args.len()),
            );
            return ConstVal::Unknown;
        }
        let base_pose = match &args[0] {
            ConstVal::Pose(p) => *p,
            ConstVal::Unknown => return ConstVal::Unknown,
            other => {
                self.push_error(
                    line,
                    col,
                    format!("Offset 第 1 个参数必须是 Pose6D，实际为 {}", other.kind_name()),
                );
                return ConstVal::Unknown;
            }
        };

        let mut deltas = [0.0; 6];
        for (i, arg) in args.iter().skip(1).enumerate() {
            match arg {
                ConstVal::Number(v) => {
                    if !v.is_finite() {
                        self.push_error(line, col, "Offset 偏移量不能为 NaN/Inf");
                        return ConstVal::Unknown;
                    }
                    deltas[i] = *v;
                }
                ConstVal::Unknown => return ConstVal::Unknown,
                other => {
                    self.push_error(
                        line,
                        col,
                        format!("Offset 偏移参数类型无效: {}", other.kind_name()),
                    );
                    return ConstVal::Unknown;
                }
            }
        }

        ConstVal::Pose(Pose6D {
            x: base_pose.x + deltas[0],
            y: base_pose.y + deltas[1],
            z: base_pose.z + deltas[2],
            a: base_pose.a + deltas[3],
            b: base_pose.b + deltas[4],
            c: base_pose.c + deltas[5],
        })
    }

    fn check_motion_call(&mut self, fn_name: &str, args: &[ConstVal], line: usize, col: usize) {
        if args.is_empty() || args.len() > 2 {
            self.push_error(
                line,
                col,
                format!("{} 需要 1 或 2 个参数，实际传入 {} 个", fn_name, args.len()),
            );
            return;
        }

        if let Some(opt) = args.get(1) {
            match opt {
                ConstVal::Number(v) => {
                    if !v.is_finite() || *v <= 0.0 {
                        self.push_error(
                            line,
                            col,
                            format!("{} 速度参数必须大于 0，实际为 {}", fn_name, v),
                        );
                    }
                }
                ConstVal::Map(m) => {
                    if let Some(vel_val) = m.get("vel") {
                        if let Some(v) = vel_val.as_f64() {
                            if !v.is_finite() || v <= 0.0 {
                                self.push_error(
                                    line,
                                    col,
                                    format!("{} opts.vel 必须大于 0，实际为 {}", fn_name, v),
                                );
                            }
                        } else if !matches!(vel_val, ConstVal::Unknown) {
                            self.push_error(line, col, format!("{} opts.vel 必须为数值", fn_name));
                        }
                    }
                }
                ConstVal::Unknown => {}
                other => {
                    self.push_error(
                        line,
                        col,
                        format!(
                            "{} 第 2 个参数必须为速度数值或 #{{ vel: ... }}，实际为 {}",
                            fn_name,
                            other.kind_name()
                        ),
                    );
                }
            }
        }

        match &args[0] {
            ConstVal::Joints(j) => {
                let (min_lim, max_lim) = self.kinematics.joint_limits();
                for i in 0..6 {
                    if !j.values[i].is_finite() || j.values[i] < min_lim[i] || j.values[i] > max_lim[i] {
                        self.push_error(
                            line,
                            col,
                            format!(
                                "{} 目标关节 J{} = {:.2}° 超出软限位 [{:.1}°, {:.1}°]",
                                fn_name,
                                i + 1,
                                j.values[i],
                                min_lim[i],
                                max_lim[i]
                            ),
                        );
                        return;
                    }
                }
                self.seed_q = *j;
                self.static_ik_checked += 1;
            }
            ConstVal::Pose(p) => {
                match self.kinematics.inverse_kinematics(p, &self.seed_q) {
                    Ok(sol) => {
                        self.seed_q = sol;
                        self.static_ik_checked += 1;
                    }
                    Err(MotionError::JointLimitExceeded {
                        axis,
                        value,
                        min,
                        max,
                    }) => {
                        self.push_error(
                            line,
                            col,
                            format!(
                                "{} 静态预检触发限位: J{} = {:.2}° 超出 [{:.1}°, {:.1}°]",
                                fn_name, axis, value, min, max
                            ),
                        );
                    }
                    Err(err) => {
                        self.push_error(
                            line,
                            col,
                            format!(
                                "{} 目标位姿 ({:.1}, {:.1}, {:.1}) 静态逆解不可达: {}",
                                fn_name, p.x, p.y, p.z, err
                            ),
                        );
                    }
                }
            }
            ConstVal::Unknown => {}
            other => {
                self.push_error(
                    line,
                    col,
                    format!(
                        "{} 第 1 个参数必须为 Pose 或 Joints，实际为 {}",
                        fn_name,
                        other.kind_name()
                    ),
                );
            }
        }
    }
}

struct IrLowerer<'a> {
    symbols: HashMap<String, ConstVal>,
    instructions: Vec<IrInstruction>,
    stats: IrStats,
    next_seq: usize,
    _kin: &'a Serial6DofKinematics,
}

impl<'a> IrLowerer<'a> {
    fn new(kin: &'a Serial6DofKinematics) -> Self {
        let mut symbols = HashMap::new();
        symbols.insert("HOME".to_string(), ConstVal::Joints(kin.home_joints()));
        Self {
            symbols,
            instructions: Vec::new(),
            stats: IrStats::default(),
            next_seq: 1,
            _kin: kin,
        }
    }

    fn emit(&mut self, line: usize, op: IrOp, summary: String) {
        let seq = self.next_seq;
        self.next_seq += 1;
        match &op {
            IrOp::MoveJ { .. } | IrOp::MoveL { .. } => self.stats.motion_count += 1,
            IrOp::SetDO { .. } | IrOp::ReadDI { .. } => self.stats.io_count += 1,
            IrOp::Wait { .. } => self.stats.wait_count += 1,
            _ => {}
        }
        self.instructions.push(IrInstruction {
            seq,
            line,
            op,
            summary,
        });
    }

    fn eval_const(&self, expr: &Expr) -> ConstVal {
        match expr {
            Expr::DynamicConstant(dyn_val, _) => dynamic_to_const(dyn_val),
            Expr::BoolConstant(b, _) => ConstVal::Bool(*b),
            Expr::IntegerConstant(n, _) => ConstVal::Number(*n as f64),
            Expr::FloatConstant(f, _) => ConstVal::Number(*f.as_ref()),
            Expr::StringConstant(s, _) => ConstVal::Text(s.to_string()),
            Expr::Variable(var_info, _, _) => self
                .symbols
                .get(var_info.1.as_str())
                .cloned()
                .unwrap_or(ConstVal::Unknown),
            Expr::Map(map_info, _) => {
                let mut m = HashMap::new();
                for (ident, val_expr) in map_info.0.iter() {
                    m.insert(ident.name.to_string(), self.eval_const(val_expr));
                }
                ConstVal::Map(m)
            }
            Expr::FnCall(call, _) => self.eval_call_const(call),
            _ => ConstVal::Unknown,
        }
    }

    fn eval_call_const(&self, call: &FnCallExpr) -> ConstVal {
        let args: Vec<ConstVal> = call.args.iter().map(|a| self.eval_const(a)).collect();
        match call.name.as_str() {
            "-" if args.len() == 1 => args[0].as_f64().map(|v| ConstVal::Number(-v)).unwrap_or(ConstVal::Unknown),
            "+" if args.len() == 2 => match (args[0].as_f64(), args[1].as_f64()) {
                (Some(a), Some(b)) => ConstVal::Number(a + b),
                _ => ConstVal::Unknown,
            },
            "-" if args.len() == 2 => match (args[0].as_f64(), args[1].as_f64()) {
                (Some(a), Some(b)) => ConstVal::Number(a - b),
                _ => ConstVal::Unknown,
            },
            "Pose" if args.len() == 6 => {
                let mut vals = [0.0; 6];
                for (i, v) in args.iter().enumerate() {
                    if let Some(n) = v.as_f64() {
                        vals[i] = n;
                    } else {
                        return ConstVal::Unknown;
                    }
                }
                ConstVal::Pose(Pose6D {
                    x: vals[0],
                    y: vals[1],
                    z: vals[2],
                    a: vals[3],
                    b: vals[4],
                    c: vals[5],
                })
            }
            "Joints" if args.len() == 6 => {
                let mut vals = [0.0; 6];
                for (i, v) in args.iter().enumerate() {
                    if let Some(n) = v.as_f64() {
                        vals[i] = n;
                    } else {
                        return ConstVal::Unknown;
                    }
                }
                ConstVal::Joints(Joints6D { values: vals })
            }
            "Offset" if args.len() == 4 || args.len() == 7 => {
                let ConstVal::Pose(base) = args[0] else {
                    return ConstVal::Unknown;
                };
                let mut d = [0.0; 6];
                for (i, arg) in args.iter().skip(1).enumerate() {
                    if let Some(n) = arg.as_f64() {
                        d[i] = n;
                    } else {
                        return ConstVal::Unknown;
                    }
                }
                ConstVal::Pose(Pose6D {
                    x: base.x + d[0],
                    y: base.y + d[1],
                    z: base.z + d[2],
                    a: base.a + d[3],
                    b: base.b + d[4],
                    c: base.c + d[5],
                })
            }
            _ => ConstVal::Unknown,
        }
    }

    fn extract_vel(&self, opt: Option<&Expr>) -> Option<f64> {
        let expr = opt?;
        match self.eval_const(expr) {
            ConstVal::Number(v) => Some(v),
            ConstVal::Map(m) => m.get("vel").and_then(|v| v.as_f64()),
            _ => None,
        }
    }

    fn lower_block(&mut self, stmts: &[Stmt]) {
        for stmt in stmts {
            let line = stmt.position().line().unwrap_or(1);
            match stmt {
                Stmt::Noop(_) => {}
                Stmt::Var(inner, _, _) => {
                    let (ident, expr, _) = &**inner;
                    let val = self.eval_const(expr);
                    let kind = val.kind_name().to_string();
                    let name = ident.name.to_string();
                    let summary = format!("{} = {}", name, val.describe());
                    self.symbols.insert(name.clone(), val);
                    self.emit(line, IrOp::DefineSymbol { name, value_kind: kind }, summary);
                }
                Stmt::FnCall(call, pos) => {
                    self.lower_fn_call(call, pos.line().unwrap_or(line));
                }
                Stmt::Expr(expr) => {
                    if let Expr::FnCall(call, pos) = &**expr {
                        self.lower_fn_call(call, pos.line().unwrap_or(line));
                    }
                }
                Stmt::For(inner, _) => {
                    let (ident, _, fc) = &**inner;
                    let hint = extract_range_count(&fc.expr);
                    self.symbols.insert(ident.name.to_string(), ConstVal::Unknown);
                    let summary = match hint {
                        Some(n) => format!("for {} (静态次数提示: {})", ident.name, n),
                        None => format!("for {}", ident.name),
                    };
                    self.emit(
                        line,
                        IrOp::LoopStart {
                            kind: "for".to_string(),
                            count_hint: hint,
                        },
                        summary,
                    );
                    self.lower_block(fc.body.statements());
                }
                Stmt::While(fc, _) => {
                    self.emit(
                        line,
                        IrOp::LoopStart {
                            kind: "while".to_string(),
                            count_hint: None,
                        },
                        "while loop".to_string(),
                    );
                    self.lower_block(fc.body.statements());
                }
                Stmt::If(fc, _) => {
                    self.emit(
                        line,
                        IrOp::IfBranch {
                            condition_desc: "<expr>".to_string(),
                        },
                        "if branch".to_string(),
                    );
                    self.lower_block(fc.body.statements());
                    self.lower_block(fc.branch.statements());
                }
                Stmt::Block(block) => {
                    self.lower_block(block.statements());
                }
                Stmt::Assignment(inner) => {
                    if let Expr::Variable(v, _, _) = &inner.1.lhs {
                        self.symbols.insert(v.1.to_string(), ConstVal::Unknown);
                    }
                    self.emit(
                        line,
                        IrOp::OtherStmt {
                            kind: "assignment".to_string(),
                        },
                        "variable assignment".to_string(),
                    );
                }
                _ => {
                    self.emit(
                        line,
                        IrOp::OtherStmt {
                            kind: "stmt".to_string(),
                        },
                        "control flow statement".to_string(),
                    );
                }
            }
        }
    }

    fn lower_fn_call(&mut self, call: &FnCallExpr, line: usize) {
        match call.name.as_str() {
            "MoveJ" => {
                let tgt = call
                    .args
                    .first()
                    .map(|e| self.eval_const(e).describe())
                    .unwrap_or_else(|| "<missing>".to_string());
                let vel = self.extract_vel(call.args.get(1));
                let summary = match vel {
                    Some(v) => format!("MoveJ({}, vel={:.1})", tgt, v),
                    None => format!("MoveJ({})", tgt),
                };
                self.emit(
                    line,
                    IrOp::MoveJ {
                        target_desc: tgt,
                        velocity_spec: vel,
                    },
                    summary,
                );
            }
            "MoveL" => {
                let tgt = call
                    .args
                    .first()
                    .map(|e| self.eval_const(e).describe())
                    .unwrap_or_else(|| "<missing>".to_string());
                let vel = self.extract_vel(call.args.get(1));
                let summary = match vel {
                    Some(v) => format!("MoveL({}, vel={:.1})", tgt, v),
                    None => format!("MoveL({})", tgt),
                };
                self.emit(
                    line,
                    IrOp::MoveL {
                        target_desc: tgt,
                        velocity_spec: vel,
                    },
                    summary,
                );
            }
            "Wait" => {
                let sec = call
                    .args
                    .first()
                    .map(|e| self.eval_const(e).describe())
                    .unwrap_or_else(|| "<dynamic>".to_string());
                self.emit(line, IrOp::Wait { seconds_desc: sec.clone() }, format!("Wait({})", sec));
            }
            "DO" => {
                let pin = call
                    .args
                    .first()
                    .map(|e| self.eval_const(e).describe())
                    .unwrap_or_else(|| "?".to_string());
                let state = call
                    .args
                    .get(1)
                    .map(|e| self.eval_const(e).describe())
                    .unwrap_or_else(|| "?".to_string());
                self.emit(
                    line,
                    IrOp::SetDO {
                        pin: pin.clone(),
                        state: state.clone(),
                    },
                    format!("DO({}, {})", pin, state),
                );
            }
            "DI" => {
                let pin = call
                    .args
                    .first()
                    .map(|e| self.eval_const(e).describe())
                    .unwrap_or_else(|| "?".to_string());
                self.emit(
                    line,
                    IrOp::ReadDI { pin: pin.clone() },
                    format!("DI({})", pin),
                );
            }
            "Log" => {
                let msg = call
                    .args
                    .first()
                    .map(|e| self.eval_const(e).describe())
                    .unwrap_or_else(|| "<msg>".to_string());
                self.emit(line, IrOp::Log { message_desc: msg.clone() }, format!("Log({})", msg));
            }
            other => {
                self.emit(
                    line,
                    IrOp::FnCall {
                        name: other.to_string(),
                        arg_count: call.args.len(),
                    },
                    format!("{}({} args)", other, call.args.len()),
                );
            }
        }
    }
}

fn dynamic_to_const(dyn_val: &Dynamic) -> ConstVal {
    if let Ok(n) = dyn_val.as_int() {
        return ConstVal::Number(n as f64);
    }
    if let Ok(f) = dyn_val.as_float() {
        return ConstVal::Number(f);
    }
    if let Ok(b) = dyn_val.as_bool() {
        return ConstVal::Bool(b);
    }
    if let Some(s) = dyn_val.clone().try_cast::<rhai::ImmutableString>() {
        return ConstVal::Text(s.to_string());
    }
    if let Some(m) = dyn_val.clone().try_cast::<rhai::Map>() {
        let mut out = HashMap::new();
        for (k, v) in m {
            out.insert(k.to_string(), dynamic_to_const(&v));
        }
        return ConstVal::Map(out);
    }
    ConstVal::Unknown
}

fn extract_range_count(expr: &Expr) -> Option<usize> {
    match expr {
        Expr::DynamicConstant(d, _) => {
            if let Some(r) = d.clone().try_cast::<std::ops::Range<rhai::INT>>() {
                let diff = r.end - r.start;
                return Some(if diff >= 0 { diff as usize } else { 0 });
            }
            if let Some(r) = d.clone().try_cast::<std::ops::RangeInclusive<rhai::INT>>() {
                let diff = *r.end() - *r.start() + 1;
                return Some(if diff >= 0 { diff as usize } else { 0 });
            }
            None
        }
        Expr::FnCall(call, _) if matches!(call.name.as_str(), ".." | "..=") && call.args.len() == 2 => {
            let start = match &call.args[0] {
                Expr::IntegerConstant(v, _) => Some(*v),
                Expr::DynamicConstant(d, _) => d.as_int().ok(),
                _ => None,
            }?;
            let end = match &call.args[1] {
                Expr::IntegerConstant(v, _) => Some(*v),
                Expr::DynamicConstant(d, _) => d.as_int().ok(),
                _ => None,
            }?;
            let inclusive = call.name == "..=";
            let diff = if inclusive { end - start + 1 } else { end - start };
            if diff >= 0 {
                Some(diff as usize)
            } else {
                Some(0)
            }
        }
        _ => None,
    }
}

fn fnv1a_hex(data: &[u8]) -> String {
    let mut hash: u64 = 0xcbf29ce484222325;
    for &b in data {
        hash ^= u64::from(b);
        hash = hash.wrapping_mul(0x100000001b3);
    }
    format!("{:016x}", hash)
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::{Path, PathBuf};

    fn test_kinematics() -> Serial6DofKinematics {
        let candidates = [
            "../../../../runtime/instances/default_cell/config/robot_model.json",
            "../../../../instances/default_cell/config/robot_model.json",
            "../../../runtime/instances/default_cell/config/robot_model.json",
            "../../runtime/instances/default_cell/config/robot_model.json",
        ];
        for rel in candidates {
            let p = Path::new(env!("CARGO_MANIFEST_DIR")).join(rel);
            if p.exists() {
                return Serial6DofKinematics::from_json_file(p).unwrap();
            }
        }
        let fallback = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .join("../../../../runtime/instances/default_cell/config/robot_model.json");
        Serial6DofKinematics::from_json_file(fallback).unwrap()
    }

    #[test]
    fn test_stage1_syntax_error_reported_with_line() {
        let compiler = RobotCompiler::new(test_kinematics());
        let bad = "let x = 10;\nMoveJ(HOME\n";
        let err = compiler.compile("bad_syntax.rhai", bad).unwrap_err();
        let diag = err.primary_diagnostic().unwrap();
        assert_eq!(diag.stage, CompileStage::Syntax);
        assert!(diag.line >= 2);
    }

    #[test]
    fn test_stage2_semantic_banned_and_param_checks() {
        let compiler = RobotCompiler::new(test_kinematics());

        let eval_src = r#"eval("1 + 1");"#;
        let eval_err = compiler.compile("eval.rhai", eval_src).unwrap_err();
        assert_eq!(eval_err.primary_diagnostic().unwrap().stage, CompileStage::Semantic);

        let do_src = "DO(99, true);\nWait(-0.5);\n";
        let do_err = compiler.compile("bad_io.rhai", do_src).unwrap_err();
        assert_eq!(do_err.report.diagnostics.len(), 2);
        assert_eq!(do_err.report.diagnostics[0].line, 1);
        assert_eq!(do_err.report.diagnostics[1].line, 2);
    }

    #[test]
    fn test_stage2_static_joint_limit_and_unreachable_ik_caught() {
        let compiler = RobotCompiler::new(test_kinematics());

        // UR5e J3 限位为 [-180, 180]
        let oob_src = "let bad_j = Joints(-90, -90, 210, -90, -90, 0);\nMoveJ(bad_j);\n";
        let oob_err = compiler.compile("oob.rhai", oob_src).unwrap_err();
        assert_eq!(oob_err.primary_diagnostic().unwrap().stage, CompileStage::Semantic);
        assert_eq!(oob_err.first_error_line(), Some(1));

        // 5000mm 远处位姿在编译阶段即可判定不可达
        let ik_src = "let far = Pose(5000.0, 0.0, 500.0, 0.0, 0.0, 180.0);\nMoveL(far, #{ vel: 100.0 });\n";
        let ik_err = compiler.compile("unreachable.rhai", ik_src).unwrap_err();
        assert_eq!(ik_err.primary_diagnostic().unwrap().stage, CompileStage::Semantic);
        assert_eq!(ik_err.first_error_line(), Some(2));
    }

    #[test]
    fn test_four_stage_compile_and_ir_lowering_success() {
        let compiler = RobotCompiler::new(test_kinematics());
        let src = r#"
let p1 = Pose(-220.0, 420.0, 340.0, 0.0, 0.0, 180.0);
let p2 = Offset(p1, 0.0, 140.0, 0.0);
MoveJ(HOME, #{ vel: 50 });
for cycle in 0..3 {
    Log("Cycle start");
    MoveL(p1, #{ vel: 120.0 });
    DO(1, true);
    Wait(0.2);
    MoveL(p2, 120.0);
    DO(1, false);
}
MoveJ(HOME, 50);
"#;
        let compiled = compiler.compile("TestSquare.rhai", src).expect("合法程序应该编译成功");
        assert_eq!(compiled.name, "TestSquare.rhai");
        assert!(compiled.ir.stats.total_instructions >= 10);
        assert_eq!(compiled.ir.stats.motion_count, 4);
        assert_eq!(compiled.ir.stats.io_count, 2);
        assert_eq!(compiled.ir.stats.wait_count, 1);
        assert_eq!(compiled.ir.stats.static_ik_checked, 4);
        assert!(compiled
            .ir
            .instructions
            .iter()
            .any(|ins| matches!(ins.op, IrOp::LoopStart { count_hint: Some(3), .. })));
    }
}
