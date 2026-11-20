//! Bass 1.1 工业机器人软控制器主入口 (`bass-runtime`)
//!
//! 初始化解耦实时运动引擎 (`bass-motion-engine`) 与内置 MuJoCo 4.0.1 C FFI 物理引擎 (`MujocoFfiDriver`)、
//! 任务与状态管理核心 (`TaskManager`)、4 阶段语义编译器与 Rhai 解释器，
//! 并启动基于 `:8080` 的 gRPC + gRPC-Web 与单页 Web UI（含 3D 机械臂视窗）网关。

use bass_compiler::RobotCompiler;
use bass_logger::{LogCategory, LogManager, LogManagerConfig};
use bass_motion::Serial6DofKinematics;
use bass_motion_engine::{
    open_mujoco_motion_engine, open_udp_motion_engine, spawn_realtime_loop, MotionEngineApi,
};
use bass_runtime::{build_app, AppState, TaskManager};
use clap::{Parser, ValueEnum};
use std::path::{Path, PathBuf};
use std::sync::Arc;

#[derive(ValueEnum, Clone, Copy, Debug, PartialEq, Eq)]
pub enum PlantMode {
    /// 进程内 C FFI 直接驱动 MuJoCo 4.0.1 物理引擎（默认推荐，零外部进程延迟）
    Ffi,
    /// 通过定长二进制 UDP 现场总线连接外部仿真物理进程（兼容 Python 调试）
    Udp,
}

#[derive(Parser, Debug)]
#[command(
    name = "bass-runtime",
    author = "Bass Team",
    version,
    about = "Bass 1.1 工业机器人控制器管理核心、gRPC/gRPC-Web 服务端、实时运动引擎与内置 MuJoCo 4.0.1 仿真"
)]
pub struct CliArgs {
    /// 机器人工作站实例目录路径
    #[arg(long, default_value = "instances/default_cell")]
    pub instance: PathBuf,

    /// 前端 Vue 3 + Three.js 静态编译资源目录路径
    #[arg(long, default_value = "web")]
    pub web_dir: PathBuf,

    /// gRPC / gRPC-Web 与前端静态资源混合监听端口
    #[arg(long, default_value_t = 8080)]
    pub http_port: u16,

    /// 物理引擎接入模式：ffi（内置 MuJoCo 4.0.1 DLL/SO 直驱）或 udp（外部物理进程）
    #[arg(long, value_enum, default_value_t = PlantMode::Ffi)]
    pub plant_mode: PlantMode,

    /// 手动指定 MuJoCo 4.0.1 动态库路径（可选，默认自动从 bin/ 或 BASS_MUJOCO_LIB 发现）
    #[arg(long)]
    pub mujoco_lib: Option<PathBuf>,

    /// 控制器本地接收 TxPDO 报文的 UDP 绑定地址（仅 --plant-mode udp 使用）
    #[arg(long, default_value = "127.0.0.1:25001")]
    pub udp_bind: String,

    /// 物理仿真进程/执行器监听 RxPDO 报文的远端 UDP 地址（仅 --plant-mode udp 使用）
    #[arg(long, default_value = "127.0.0.1:25000")]
    pub udp_remote: String,
}

fn resolve_runtime_path(raw: PathBuf, default_rel: &str) -> PathBuf {
    if raw.exists() {
        return raw;
    }
    if raw == Path::new(default_rel) {
        let under_runtime = PathBuf::from("runtime").join(default_rel);
        if under_runtime.exists() {
            return under_runtime;
        }
        if let Ok(exe) = std::env::current_exe() {
            if let Some(bin_dir) = exe.parent() {
                if let Some(pkg_root) = bin_dir.parent() {
                    let candidate = pkg_root.join(default_rel);
                    if candidate.exists() {
                        return candidate;
                    }
                }
            }
        }
    }
    raw
}

fn find_default_program(programs_dir: &Path) -> Option<String> {
    if programs_dir.join("MoveSquare.rhai").exists() {
        return Some("MoveSquare.rhai".to_string());
    }
    let mut names: Vec<String> = std::fs::read_dir(programs_dir)
        .ok()?
        .filter_map(Result::ok)
        .filter_map(|e| {
            let p = e.path();
            if p.is_file() && p.extension().and_then(|s| s.to_str()) == Some("rhai") {
                e.file_name().into_string().ok()
            } else {
                None
            }
        })
        .collect();
    names.sort();
    names.into_iter().next()
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // 1. 初始化日志子系统
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| tracing_subscriber::EnvFilter::new("info")),
        )
        .init();

    let mut args = CliArgs::parse();
    args.instance = resolve_runtime_path(args.instance, "instances/default_cell");
    args.web_dir = resolve_runtime_path(args.web_dir, "web");
    let logs_dir = args.instance.join("logs");
    let logger = LogManager::new(LogManagerConfig {
        log_dir: Some(logs_dir.clone()),
        max_memory_entries: 2000,
        max_file_bytes: 5 * 1024 * 1024,
        max_files: 7,
    });

    tracing::info!("🚀 正在启动 Bass 1.1 软控制器...");
    tracing::info!("   - 工作站实例路径: {:?}", args.instance);
    tracing::info!("   - 前端静态文件:   {:?}", args.web_dir);
    tracing::info!("   - 日志存储目录:   {:?}", logs_dir);
    tracing::info!("   - gRPC/Web 端口:  {}", args.http_port);
    tracing::info!("   - 物理仿真模式:   {:?}", args.plant_mode);
    if args.plant_mode == PlantMode::Udp {
        tracing::info!("   - UDP 本地绑定:   {}", args.udp_bind);
        tracing::info!("   - UDP 物理远端:   {}", args.udp_remote);
    }

    logger.info(
        LogCategory::System,
        "runtime",
        format!(
            "Bass 1.1 软控制器启动 (实例 {:?}, 模式 {:?}, gRPC/Web :{})",
            args.instance, args.plant_mode, args.http_port
        ),
    );

    // 2. 加载机械臂 JSON 运动学模型配置
    let model_path = args.instance.join("config/robot_model.json");
    if !model_path.exists() {
        let msg = format!("找不到运动学配置文件: {:?}", model_path);
        tracing::error!("❌ {}", msg);
        logger.error(LogCategory::System, "runtime", &msg);
        logger.flush();
        return Err(msg.into());
    }
    let kinematics = Serial6DofKinematics::from_json_file(&model_path).map_err(|e| {
        let msg = format!("解析 robot_model.json 失败: {}", e);
        logger.error(LogCategory::System, "runtime", &msg);
        logger.flush();
        msg
    })?;
    tracing::info!("✅ 成功载入 6 轴机械臂运动学模型: {:?}", model_path);
    logger.info(
        LogCategory::System,
        "runtime",
        format!("已载入运动学模型: {:?}", model_path),
    );

    // 3. 初始化解耦实时运动引擎 (`bass-motion-engine`) 并启动 2ms 确定性实时线程
    let (motion_api, _motion_thread): (Arc<dyn MotionEngineApi>, _) = match args.plant_mode {
        PlantMode::Ffi => {
            let (motion_engine, motion_client, mj_info) = open_mujoco_motion_engine(
                kinematics.clone(),
                &model_path,
                args.mujoco_lib.as_deref(),
                logger.clone(),
            )
            .map_err(|e| {
                logger.error(LogCategory::Fieldbus, "runtime", &e);
                logger.flush();
                e
            })?;
            tracing::info!("✅ 内置 C FFI 物理引擎与独立实时运动引擎已就绪 ({})", mj_info);
            let thread = spawn_realtime_loop(motion_engine, logger.clone()).map_err(|e| {
                logger.error(LogCategory::Motion, "runtime", &e);
                logger.flush();
                e
            })?;
            (Arc::new(motion_client), thread)
        }
        PlantMode::Udp => {
            let (motion_engine, motion_client) = open_udp_motion_engine(
                kinematics.clone(),
                &args.udp_bind,
                &args.udp_remote,
                logger.clone(),
            )
            .map_err(|e| {
                logger.error(LogCategory::Fieldbus, "runtime", &e);
                logger.flush();
                e
            })?;
            tracing::info!(
                "✅ UDP 现场总线与独立实时运动引擎已就绪 (本地 {}, 远端 {})",
                args.udp_bind,
                args.udp_remote
            );
            let thread = spawn_realtime_loop(motion_engine, logger.clone()).map_err(|e| {
                logger.error(LogCategory::Motion, "runtime", &e);
                logger.flush();
                e
            })?;
            (Arc::new(motion_client), thread)
        }
    };

    // 4. 初始化语义编译器、控制器任务/状态管理核心 (`TaskManager`)
    let programs_dir = args.instance.join("programs");
    if !programs_dir.exists() {
        let _ = std::fs::create_dir_all(&programs_dir);
    }

    let compiler = Arc::new(RobotCompiler::new(kinematics.clone()));
    let (mut task_manager, task_handle) = TaskManager::with_compiler(
        motion_api.clone(),
        &kinematics,
        compiler.clone(),
        logger.clone(),
        &programs_dir,
    )
    .map_err(|e| {
        let msg = format!("任务管理核心初始化失败: {}", e);
        logger.error(LogCategory::System, "runtime", &msg);
        logger.flush();
        msg
    })?;

    if let Some(default_prog) = find_default_program(&programs_dir) {
        if let Err(err) = task_manager.load_program_file(&default_prog).await {
            tracing::warn!("预加载默认程序 {} 失败: {}", default_prog, err);
        }
    }

    tokio::spawn(task_manager.run_loop());
    tracing::info!("🧠 控制器任务与状态管理核心已启动 (异步调度 + gRPC 服务数据源)");

    // 5. 构造 gRPC / gRPC-Web 与静态前端（含机器人 3D 模型资产）混合服务网关并启动监听
    let state = AppState::new(
        task_handle,
        motion_api,
        compiler,
        logger.clone(),
        args.instance,
        programs_dir,
        args.web_dir,
    );
    let app = build_app(state);

    let listen_addr = format!("0.0.0.0:{}", args.http_port);
    let listener = tokio::net::TcpListener::bind(&listen_addr).await?;
    tracing::info!(
        "🌐 gRPC / gRPC-Web 网关已成功监听 http://127.0.0.1:{}",
        args.http_port
    );
    logger.info(
        LogCategory::System,
        "grpc",
        format!(
            "gRPC / gRPC-Web 网关监听 http://127.0.0.1:{}",
            args.http_port
        ),
    );

    axum::serve(listener, app).await?;
    logger.flush();

    Ok(())
}
