//! Bass 控制器 gRPC + gRPC-Web 服务与静态前端托管网关 (`grpc.rs`)
//!
//! 在同一端口 (`:8080`) 上同时承载：
//! 1. 原生 gRPC (HTTP/2 h2c `application/grpc`) 与浏览器端 gRPC-Web (`application/grpc-web+proto`)；
//! 2. `ControllerService` / `TaskService` / `LogService` 三组协议服务；
//! 3. Vue 3 示教器静态前端构建产物 (`web_dir`)。

use crate::task_manager::{validate_program_name, TaskControlCommand, TaskHandle};
use axum::http::header::HeaderName;
use axum::response::IntoResponse;
use axum::routing::get_service;
use axum::Router;
use bass_compiler::{
    CompileDiagnostic, CompileStage, DiagnosticSeverity, RobotCompiler,
};
use bass_logger::{LogCategory, LogEntry, LogLevel, LogManager, LogQuery};
use bass_motion_engine::{MotionEngineApi, MotionEvent, MotionTelemetry};
use bass_proto::v1::controller_service_server::{ControllerService, ControllerServiceServer};
use bass_proto::v1::log_service_server::{LogService, LogServiceServer};
use bass_proto::v1::motion_service_server::{MotionService, MotionServiceServer};
use bass_proto::v1::task_service_server::{TaskService, TaskServiceServer};
use bass_proto::v1 as pb;
use bass_types::{
    CoordSystem, InterpreterState, JogCommand, Joints6D, MotionState, MotionTarget, OpMode,
    Pose6D, RobotStateSnapshot,
};
use std::future::Future;
use std::path::PathBuf;
use std::sync::Arc;
use std::time::Duration;
use tokio::sync::{broadcast, mpsc, watch};
use tokio_stream::wrappers::ReceiverStream;
use tonic::{Request, Response, Status};
use tower_http::cors::{Any, CorsLayer};
use tower_http::services::ServeDir;

/// 网关与所有 gRPC 服务共享的应用状态
#[derive(Clone)]
pub struct AppState {
    pub task: TaskHandle,
    pub motion_api: Arc<dyn MotionEngineApi>,
    pub compiler: Arc<RobotCompiler>,
    pub logger: LogManager,
    pub instance_dir: PathBuf,
    pub programs_dir: PathBuf,
    pub web_dir: PathBuf,
}

impl AppState {
    pub fn new(
        task: TaskHandle,
        motion_api: Arc<dyn MotionEngineApi>,
        compiler: Arc<RobotCompiler>,
        logger: LogManager,
        instance_dir: PathBuf,
        programs_dir: PathBuf,
        web_dir: PathBuf,
    ) -> Self {
        Self {
            task,
            motion_api,
            compiler,
            logger,
            instance_dir,
            programs_dir,
            web_dir,
        }
    }
}

/// 统一承载 `ControllerService`、`TaskService`、`LogService` 的 gRPC 服务实现
#[derive(Clone)]
pub struct BassGrpcService {
    state: AppState,
}

impl BassGrpcService {
    pub fn new(state: AppState) -> Self {
        Self { state }
    }
}

#[tonic::async_trait]
impl ControllerService for BassGrpcService {
    async fn get_state(
        &self,
        _request: Request<pb::GetStateRequest>,
    ) -> Result<Response<pb::RobotStateSnapshot>, Status> {
        let snapshot = self.state.task.latest_snapshot();
        Ok(Response::new(to_proto_snapshot(&snapshot)))
    }

    type SubscribeTelemetryStream = ReceiverStream<Result<pb::RobotStateSnapshot, Status>>;

    async fn subscribe_telemetry(
        &self,
        request: Request<pb::SubscribeTelemetryRequest>,
    ) -> Result<Response<Self::SubscribeTelemetryStream>, Status> {
        let req_interval = request.into_inner().interval_ms;
        let interval_ms = if req_interval == 0 {
            40
        } else {
            req_interval.clamp(10, 1000) as u64
        };

        let snapshot_rx = self.state.task.subscribe_snapshot();
        let (tx, rx) = mpsc::channel(32);

        tokio::spawn(async move {
            let initial = to_proto_snapshot(&snapshot_rx.borrow().clone());
            if tx.send(Ok(initial)).await.is_err() {
                return;
            }

            let mut interval = tokio::time::interval(Duration::from_millis(interval_ms));
            interval.set_missed_tick_behavior(tokio::time::MissedTickBehavior::Skip);
            interval.tick().await;

            loop {
                tokio::select! {
                    _ = tx.closed() => break,
                    _ = interval.tick() => {
                        let snap = to_proto_snapshot(&snapshot_rx.borrow().clone());
                        if tx.send(Ok(snap)).await.is_err() {
                            break;
                        }
                    }
                }
            }
        });

        Ok(Response::new(ReceiverStream::new(rx)))
    }

    async fn set_mode(
        &self,
        request: Request<pb::SetModeRequest>,
    ) -> Result<Response<pb::SetModeResponse>, Status> {
        let mode = from_proto_op_mode(request.into_inner().mode)?;
        match self.state.task.set_mode(mode).await {
            Ok(applied) => Ok(Response::new(pb::SetModeResponse {
                ok: true,
                mode: to_proto_op_mode(applied) as i32,
                error: String::new(),
            })),
            Err(err) => Ok(Response::new(pb::SetModeResponse {
                ok: false,
                mode: pb::OpMode::Unspecified as i32,
                error: err,
            })),
        }
    }

    async fn set_drives_power(
        &self,
        request: Request<pb::SetDrivesPowerRequest>,
    ) -> Result<Response<pb::SetDrivesPowerResponse>, Status> {
        let enable = request.into_inner().drives_on;
        match self.state.task.set_drives_power(enable).await {
            Ok(drives_on) => Ok(Response::new(pb::SetDrivesPowerResponse {
                ok: true,
                drives_on,
                error: String::new(),
            })),
            Err(err) => Ok(Response::new(pb::SetDrivesPowerResponse {
                ok: false,
                drives_on: false,
                error: err,
            })),
        }
    }

    async fn set_emergency_stop(
        &self,
        request: Request<pb::SetEmergencyStopRequest>,
    ) -> Result<Response<pb::SetEmergencyStopResponse>, Status> {
        let estop = request.into_inner().emergency_stop;
        match self.state.task.set_emergency_stop(estop).await {
            Ok(active) => Ok(Response::new(pb::SetEmergencyStopResponse {
                ok: true,
                emergency_stop: active,
                error: String::new(),
            })),
            Err(err) => Ok(Response::new(pb::SetEmergencyStopResponse {
                ok: false,
                emergency_stop: estop,
                error: err,
            })),
        }
    }

    async fn set_speed_override(
        &self,
        request: Request<pb::SetSpeedOverrideRequest>,
    ) -> Result<Response<pb::SetSpeedOverrideResponse>, Status> {
        let raw = request.into_inner().speed_override;
        let clamped = raw.clamp(5, 100) as u8;
        match self.state.task.set_speed_override(clamped).await {
            Ok(applied) => Ok(Response::new(pb::SetSpeedOverrideResponse {
                ok: true,
                speed_override: applied as u32,
                error: String::new(),
            })),
            Err(err) => Ok(Response::new(pb::SetSpeedOverrideResponse {
                ok: false,
                speed_override: clamped as u32,
                error: err,
            })),
        }
    }

    async fn set_digital_out(
        &self,
        request: Request<pb::SetDigitalOutRequest>,
    ) -> Result<Response<pb::SetDigitalOutResponse>, Status> {
        let req = request.into_inner();
        let pin = req.pin as usize;
        match self.state.task.set_dout(pin, req.state).await {
            Ok(digital_out) => Ok(Response::new(pb::SetDigitalOutResponse {
                ok: true,
                digital_out: digital_out.to_vec(),
                error: String::new(),
            })),
            Err(err) => Ok(Response::new(pb::SetDigitalOutResponse {
                ok: false,
                digital_out: Vec::new(),
                error: err,
            })),
        }
    }

    async fn jog_step(
        &self,
        request: Request<pb::JogCommand>,
    ) -> Result<Response<pb::SimpleResponse>, Status> {
        let cmd = from_proto_jog_command(request.into_inner())?;
        Ok(Response::new(simple_resp(self.state.task.jog_step(cmd).await)))
    }

    async fn jog_hold(
        &self,
        request: Request<pb::JogCommand>,
    ) -> Result<Response<pb::SimpleResponse>, Status> {
        let cmd = from_proto_jog_command(request.into_inner())?;
        Ok(Response::new(simple_resp(self.state.task.jog_hold(cmd).await)))
    }

    async fn jog_stop(
        &self,
        _request: Request<pb::JogStopRequest>,
    ) -> Result<Response<pb::SimpleResponse>, Status> {
        let _ = self.state.task.jog_stop().await;
        Ok(Response::new(pb::SimpleResponse {
            ok: true,
            error: String::new(),
        }))
    }
}

#[tonic::async_trait]
impl TaskService for BassGrpcService {
    async fn list_programs(
        &self,
        _request: Request<pb::ListProgramsRequest>,
    ) -> Result<Response<pb::ListProgramsResponse>, Status> {
        let mut programs = Vec::new();
        if let Ok(entries) = std::fs::read_dir(&self.state.programs_dir) {
            for entry in entries.flatten() {
                if let Ok(file_type) = entry.file_type() {
                    if file_type.is_file() {
                        let name = entry.file_name().to_string_lossy().to_string();
                        if name.ends_with(".rhai") {
                            programs.push(name);
                        }
                    }
                }
            }
        }
        programs.sort();
        Ok(Response::new(pb::ListProgramsResponse { programs }))
    }

    async fn get_program(
        &self,
        request: Request<pb::GetProgramRequest>,
    ) -> Result<Response<pb::GetProgramResponse>, Status> {
        let name = request.into_inner().name;
        if let Err(err) = validate_program_name(&name) {
            return Err(Status::invalid_argument(err));
        }

        let file_path = self.state.programs_dir.join(&name);
        match std::fs::read_to_string(&file_path) {
            Ok(code) => Ok(Response::new(pb::GetProgramResponse {
                ok: true,
                name,
                code,
                error: String::new(),
            })),
            Err(_) => Err(Status::not_found(format!("程序文件 {} 不存在", name))),
        }
    }

    async fn save_program(
        &self,
        request: Request<pb::SaveProgramRequest>,
    ) -> Result<Response<pb::SaveProgramResponse>, Status> {
        let req = request.into_inner();
        if let Err(err) = validate_program_name(&req.name) {
            return Err(Status::invalid_argument(err));
        }

        let compiled = match self.state.compiler.compile(&req.name, &req.code) {
            Ok(c) => c,
            Err(failure) => {
                let line = failure.first_error_line().unwrap_or(1) as u32;
                let message = failure
                    .primary_diagnostic()
                    .map(|d| d.message.clone())
                    .unwrap_or_else(|| failure.to_string());
                self.state.logger.error(
                    LogCategory::Compiler,
                    "grpc",
                    format!("保存 {} 编译失败 (第 {} 行): {}", req.name, line, message),
                );
                return Ok(Response::new(pb::SaveProgramResponse {
                    ok: false,
                    error_line: line,
                    error_message: message,
                    report: Some(to_proto_compile_report(&failure.report)),
                }));
            }
        };

        let file_path = self.state.programs_dir.join(&req.name);
        if let Err(e) = std::fs::write(&file_path, &req.code) {
            let err_msg = format!("保存程序文件失败: {}", e);
            self.state.logger.error(
                LogCategory::System,
                "grpc",
                format!("保存程序文件 {} 失败: {}", req.name, e),
            );
            return Err(Status::internal(err_msg));
        }

        let report = compiled.to_report();
        self.state.logger.info(
            LogCategory::Compiler,
            "grpc",
            format!(
                "保存并编译通过: {} (IR {} 条指令)",
                req.name, compiled.ir.stats.total_instructions
            ),
        );

        let snap = self.state.task.latest_snapshot();
        let can_reload = !matches!(
            snap.interpreter_state,
            InterpreterState::Running | InterpreterState::Paused
        ) && (snap.active_program.is_empty() || snap.active_program == req.name);
        if can_reload {
            let _ = self
                .state
                .task
                .load_program(req.name.clone(), req.code)
                .await;
        }

        Ok(Response::new(pb::SaveProgramResponse {
            ok: true,
            error_line: 0,
            error_message: String::new(),
            report: Some(to_proto_compile_report(&report)),
        }))
    }

    async fn compile_program(
        &self,
        request: Request<pb::CompileProgramRequest>,
    ) -> Result<Response<pb::CompileReport>, Status> {
        let req = request.into_inner();
        if let Err(err) = validate_program_name(&req.name) {
            return Err(Status::invalid_argument(err));
        }

        let code = match req.code {
            Some(c) => c,
            None => {
                let file_path = self.state.programs_dir.join(&req.name);
                std::fs::read_to_string(&file_path)
                    .map_err(|_| Status::not_found(format!("程序文件 {} 不存在", req.name)))?
            }
        };

        let report = self.state.compiler.analyze(&req.name, &code);
        if report.ok {
            self.state.logger.info(
                LogCategory::Compiler,
                "grpc",
                format!("编译分析通过: {}", req.name),
            );
        } else {
            let primary = report
                .diagnostics
                .first()
                .map(|d| format!("第 {} 行: {}", d.line, d.message))
                .unwrap_or_else(|| "未知编译错误".to_string());
            self.state.logger.warn(
                LogCategory::Compiler,
                "grpc",
                format!("编译检查未通过 {}: {}", req.name, primary),
            );
        }

        Ok(Response::new(to_proto_compile_report(&report)))
    }

    async fn control_task(
        &self,
        request: Request<pb::ControlTaskRequest>,
    ) -> Result<Response<pb::SimpleResponse>, Status> {
        let req = request.into_inner();
        let command = from_proto_task_command(req.command)?;
        let prog_opt = if req.program_name.trim().is_empty() {
            None
        } else {
            if let Err(err) = validate_program_name(&req.program_name) {
                return Err(Status::invalid_argument(err));
            }
            Some(req.program_name)
        };

        Ok(Response::new(simple_resp(
            self.state.task.control_task(command, prog_opt).await,
        )))
    }
}

#[tonic::async_trait]
impl LogService for BassGrpcService {
    async fn query_logs(
        &self,
        request: Request<pb::QueryLogsRequest>,
    ) -> Result<Response<pb::QueryLogsResponse>, Status> {
        let req = request.into_inner();
        let query = LogQuery {
            level: from_proto_log_level(req.level),
            category: from_proto_log_category(req.category),
            q: if req.q.trim().is_empty() {
                None
            } else {
                Some(req.q)
            },
            after_id: req.after_id,
            limit: Some(req.limit.unwrap_or(200).clamp(1, 1000) as usize),
        };

        let (entries, latest_id) = self.state.logger.query(&query);
        let total = entries.len() as u32;
        Ok(Response::new(pb::QueryLogsResponse {
            ok: true,
            latest_id,
            total,
            entries: entries.iter().map(to_proto_log_entry).collect(),
            error: String::new(),
        }))
    }

    async fn export_logs(
        &self,
        request: Request<pb::ExportLogsRequest>,
    ) -> Result<Response<pb::ExportLogsResponse>, Status> {
        let req = request.into_inner();
        let query = LogQuery {
            level: from_proto_log_level(req.level),
            category: from_proto_log_category(req.category),
            q: if req.q.trim().is_empty() {
                None
            } else {
                Some(req.q)
            },
            after_id: None,
            limit: None,
        };

        let is_text = req.format == pb::LogExportFormat::Text as i32;
        let (filename, content_type, content) = if is_text {
            (
                "bass-logs.txt".to_string(),
                "text/plain; charset=utf-8".to_string(),
                self.state.logger.export_text(&query),
            )
        } else {
            (
                "bass-logs.jsonl".to_string(),
                "application/x-ndjson; charset=utf-8".to_string(),
                self.state.logger.export_jsonl(&query),
            )
        };

        Ok(Response::new(pb::ExportLogsResponse {
            ok: true,
            filename,
            content_type,
            content,
            error: String::new(),
        }))
    }

    async fn clear_logs(
        &self,
        _request: Request<pb::ClearLogsRequest>,
    ) -> Result<Response<pb::SimpleResponse>, Status> {
        self.state.logger.clear("grpc");
        Ok(Response::new(pb::SimpleResponse {
            ok: true,
            error: String::new(),
        }))
    }
}

fn ensure_external_motion_allowed(task: &TaskHandle) -> Result<(), String> {
    let snap = task.latest_snapshot();
    if matches!(
        snap.interpreter_state,
        InterpreterState::Running | InterpreterState::Paused
    ) {
        return Err(
            "当前程序正在运行或暂停中，请先通过 TaskService(RESET) 停止任务后再直接调用 MotionService"
                .to_string(),
        );
    }
    Ok(())
}

async fn await_motion_completion(
    motion_id: u64,
    event_rx: &mut broadcast::Receiver<MotionEvent>,
    telem_rx: &mut watch::Receiver<MotionTelemetry>,
) -> Result<(), String> {
    let mut saw_active = telem_rx.borrow().active_motion_id == Some(motion_id);
    loop {
        tokio::select! {
            ev = event_rx.recv() => {
                match ev {
                    Ok(MotionEvent::MotionCompleted { motion_id: mid }) if mid == motion_id => {
                        return Ok(());
                    }
                    Ok(MotionEvent::MotionFailed { motion_id: mid, error }) if mid == motion_id => {
                        return Err(error);
                    }
                    Ok(MotionEvent::SafetyTripped { reason, .. }) => {
                        return Err(format!("运动安全中断: {}", reason));
                    }
                    Ok(_) => {}
                    Err(broadcast::error::RecvError::Lagged(_)) => {
                        let telem = telem_rx.borrow().clone();
                        if telem.active_motion_id == Some(motion_id) {
                            saw_active = true;
                        } else if (saw_active || telem.active_motion_id.is_some_and(|id| id > motion_id))
                            && telem.motion_state == MotionState::Idle
                        {
                            if !telem.drives_enabled || telem.estop_active || !telem.plant_online {
                                return Err("运动安全状态中断".to_string());
                            }
                            return Ok(());
                        }
                    }
                    Err(broadcast::error::RecvError::Closed) => {
                        return Err("实时运动引擎事件通道已关闭".to_string());
                    }
                }
            }
            changed = telem_rx.changed() => {
                if changed.is_err() {
                    return Err("实时运动引擎遥测通道已关闭".to_string());
                }
                while let Ok(ev) = event_rx.try_recv() {
                    match ev {
                        MotionEvent::MotionCompleted { motion_id: mid } if mid == motion_id => {
                            return Ok(());
                        }
                        MotionEvent::MotionFailed { motion_id: mid, error } if mid == motion_id => {
                            return Err(error);
                        }
                        MotionEvent::SafetyTripped { reason, .. } => {
                            return Err(format!("运动安全中断: {}", reason));
                        }
                        _ => {}
                    }
                }
                let telem = telem_rx.borrow().clone();
                if telem.active_motion_id == Some(motion_id) {
                    saw_active = true;
                } else if telem.active_motion_id.is_some_and(|id| id > motion_id)
                    || (saw_active && telem.motion_state == MotionState::Idle)
                {
                    return Err("运动已被停止或中止".to_string());
                }
            }
        }
    }
}

async fn execute_external_motion<Fut>(
    state: &AppState,
    label: &str,
    wait_for_completion: bool,
    dispatch: impl FnOnce() -> Fut,
) -> Result<Response<pb::MoveResponse>, Status>
where
    Fut: Future<Output = Result<u64, String>>,
{
    if let Err(err) = ensure_external_motion_allowed(&state.task) {
        return Ok(Response::new(pb::MoveResponse {
            ok: false,
            motion_id: 0,
            error: err,
        }));
    }

    let mut event_rx = state.motion_api.subscribe_events();
    let mut telem_rx = state.motion_api.subscribe_telemetry();

    let motion_id = match dispatch().await {
        Ok(id) => id,
        Err(err) => {
            state
                .logger
                .warn(LogCategory::Motion, "grpc-motion", format!("{} 被拒绝: {}", label, err));
            return Ok(Response::new(pb::MoveResponse {
                ok: false,
                motion_id: 0,
                error: err,
            }));
        }
    };

    state.logger.info(
        LogCategory::Motion,
        "grpc-motion",
        format!("外部 gRPC 下发 {} (motion_id={}, wait={})", label, motion_id, wait_for_completion),
    );

    if wait_for_completion {
        if let Err(err) = await_motion_completion(motion_id, &mut event_rx, &mut telem_rx).await {
            return Ok(Response::new(pb::MoveResponse {
                ok: false,
                motion_id,
                error: err,
            }));
        }
    }

    Ok(Response::new(pb::MoveResponse {
        ok: true,
        motion_id,
        error: String::new(),
    }))
}

#[tonic::async_trait]
impl MotionService for BassGrpcService {
    async fn get_motion_telemetry(
        &self,
        _request: Request<pb::GetMotionTelemetryRequest>,
    ) -> Result<Response<pb::MotionTelemetry>, Status> {
        let telem = self.state.motion_api.latest_telemetry();
        Ok(Response::new(to_proto_motion_telemetry(&telem)))
    }

    type SubscribeMotionTelemetryStream = ReceiverStream<Result<pb::MotionTelemetry, Status>>;

    async fn subscribe_motion_telemetry(
        &self,
        request: Request<pb::SubscribeTelemetryRequest>,
    ) -> Result<Response<Self::SubscribeMotionTelemetryStream>, Status> {
        let req_interval = request.into_inner().interval_ms;
        let interval_ms = if req_interval == 0 {
            40
        } else {
            req_interval.clamp(10, 1000) as u64
        };

        let telem_rx = self.state.motion_api.subscribe_telemetry();
        let (tx, rx) = mpsc::channel(32);

        tokio::spawn(async move {
            let initial = to_proto_motion_telemetry(&telem_rx.borrow().clone());
            if tx.send(Ok(initial)).await.is_err() {
                return;
            }

            let mut interval = tokio::time::interval(Duration::from_millis(interval_ms));
            interval.set_missed_tick_behavior(tokio::time::MissedTickBehavior::Skip);
            interval.tick().await;

            loop {
                tokio::select! {
                    _ = tx.closed() => break,
                    _ = interval.tick() => {
                        let telem = to_proto_motion_telemetry(&telem_rx.borrow().clone());
                        if tx.send(Ok(telem)).await.is_err() {
                            break;
                        }
                    }
                }
            }
        });

        Ok(Response::new(ReceiverStream::new(rx)))
    }

    type SubscribeMotionEventsStream = ReceiverStream<Result<pb::MotionEvent, Status>>;

    async fn subscribe_motion_events(
        &self,
        _request: Request<pb::SubscribeMotionEventsRequest>,
    ) -> Result<Response<Self::SubscribeMotionEventsStream>, Status> {
        let mut event_rx = self.state.motion_api.subscribe_events();
        let (tx, rx) = mpsc::channel(64);

        tokio::spawn(async move {
            loop {
                tokio::select! {
                    _ = tx.closed() => break,
                    ev = event_rx.recv() => {
                        match ev {
                            Ok(event) => {
                                if tx.send(Ok(to_proto_motion_event(&event))).await.is_err() {
                                    break;
                                }
                            }
                            Err(broadcast::error::RecvError::Lagged(_)) => continue,
                            Err(broadcast::error::RecvError::Closed) => break,
                        }
                    }
                }
            }
        });

        Ok(Response::new(ReceiverStream::new(rx)))
    }

    async fn move_l(
        &self,
        request: Request<pb::MoveLRequest>,
    ) -> Result<Response<pb::MoveResponse>, Status> {
        let req = request.into_inner();
        let target_pb = req
            .target
            .ok_or_else(|| Status::invalid_argument("MoveL 缺少目标位姿 target"))?;
        let target = from_proto_pose(target_pb)?;
        let vel = req.vel_mm_s;
        let wait = req.wait_for_completion;
        let api = self.state.motion_api.clone();

        execute_external_motion(&self.state, "MoveL", wait, move || async move {
            api.move_l(target, vel).await
        })
        .await
    }

    async fn move_j(
        &self,
        request: Request<pb::MoveJRequest>,
    ) -> Result<Response<pb::MoveResponse>, Status> {
        let req = request.into_inner();
        let target = match req.target {
            Some(pb::move_j_request::Target::Pose(p)) => {
                MotionTarget::Pose(from_proto_pose(p)?)
            }
            Some(pb::move_j_request::Target::Joints(j)) => {
                MotionTarget::Joints(from_proto_joints(j)?)
            }
            None => return Err(Status::invalid_argument("MoveJ 缺少目标 pose 或 joints")),
        };
        let vel = req.vel_deg_s;
        let wait = req.wait_for_completion;
        let api = self.state.motion_api.clone();

        execute_external_motion(&self.state, "MoveJ", wait, move || async move {
            api.move_j(target, vel).await
        })
        .await
    }

    async fn jog_step(
        &self,
        request: Request<pb::JogCommand>,
    ) -> Result<Response<pb::MoveResponse>, Status> {
        if let Err(err) = ensure_external_motion_allowed(&self.state.task) {
            return Ok(Response::new(pb::MoveResponse {
                ok: false,
                motion_id: 0,
                error: err,
            }));
        }
        let cmd = from_proto_jog_command(request.into_inner())?;
        match self.state.motion_api.jog_step(cmd).await {
            Ok(motion_id) => Ok(Response::new(pb::MoveResponse {
                ok: true,
                motion_id,
                error: String::new(),
            })),
            Err(error) => Ok(Response::new(pb::MoveResponse {
                ok: false,
                motion_id: 0,
                error,
            })),
        }
    }

    async fn jog_hold(
        &self,
        request: Request<pb::JogCommand>,
    ) -> Result<Response<pb::SimpleResponse>, Status> {
        if let Err(err) = ensure_external_motion_allowed(&self.state.task) {
            return Ok(Response::new(pb::SimpleResponse {
                ok: false,
                error: err,
            }));
        }
        let cmd = from_proto_jog_command(request.into_inner())?;
        Ok(Response::new(simple_resp(
            self.state.motion_api.jog_hold(cmd).await,
        )))
    }

    async fn jog_stop(
        &self,
        _request: Request<pb::JogStopRequest>,
    ) -> Result<Response<pb::SimpleResponse>, Status> {
        Ok(Response::new(simple_resp(
            self.state.motion_api.jog_stop().await,
        )))
    }

    async fn set_motion_paused(
        &self,
        request: Request<pb::SetMotionPausedRequest>,
    ) -> Result<Response<pb::SimpleResponse>, Status> {
        let paused = request.into_inner().paused;
        let snap = self.state.task.latest_snapshot();
        if matches!(
            snap.interpreter_state,
            InterpreterState::Running | InterpreterState::Paused
        ) {
            if paused {
                return Ok(Response::new(simple_resp(
                    self.state
                        .task
                        .control_task(TaskControlCommand::Pause, None)
                        .await,
                )));
            }
            return Ok(Response::new(pb::SimpleResponse {
                ok: false,
                error: "当前有暂停中的脚本任务，请通过 TaskService(RUN) 恢复".to_string(),
            }));
        }
        Ok(Response::new(simple_resp(
            self.state.motion_api.set_motion_paused(paused).await,
        )))
    }

    async fn stop_motion(
        &self,
        _request: Request<pb::StopMotionRequest>,
    ) -> Result<Response<pb::SimpleResponse>, Status> {
        let snap = self.state.task.latest_snapshot();
        if matches!(
            snap.interpreter_state,
            InterpreterState::Running | InterpreterState::Paused
        ) {
            let _ = self
                .state
                .task
                .control_task(TaskControlCommand::Reset, None)
                .await;
        }
        let res = self.state.motion_api.stop_motion().await;
        self.state
            .logger
            .info(LogCategory::Motion, "grpc-motion", "外部 gRPC 触发 StopMotion");
        Ok(Response::new(simple_resp(res)))
    }

    async fn clear_fault(
        &self,
        _request: Request<pb::ClearFaultRequest>,
    ) -> Result<Response<pb::SimpleResponse>, Status> {
        let res = self.state.motion_api.clear_fault().await;
        self.state
            .logger
            .info(LogCategory::Safety, "grpc-motion", "外部 gRPC 触发 ClearFault");
        Ok(Response::new(simple_resp(res)))
    }
}

/// 构造 Axum + tonic/tonic-web 混合服务路由（单端口 `:8080` 同时承载原生 gRPC、gRPC-Web 与静态前端）
pub fn build_app(state: AppState) -> Router {
    let grpc_impl = BassGrpcService::new(state.clone());
    let routes = tonic::service::Routes::new(ControllerServiceServer::new(grpc_impl.clone()))
        .add_service(TaskServiceServer::new(grpc_impl.clone()))
        .add_service(LogServiceServer::new(grpc_impl.clone()))
        .add_service(MotionServiceServer::new(grpc_impl))
        .prepare();

    let grpc_web_service = tower::ServiceBuilder::new()
        .map_request(|req: axum::http::Request<axum::body::Body>| req)
        .map_response(|resp: axum::http::Response<tonic::body::Body>| {
            resp.map(axum::body::Body::new)
        })
        .layer(tonic_web::GrpcWebLayer::new())
        .service(routes);

    let static_service = get_service(
        ServeDir::new(&state.web_dir)
            .append_index_html_on_directories(true)
            .fallback(axum::routing::get(fallback_handler)),
    );
    let robot_config_service = get_service(ServeDir::new(state.instance_dir.join("config")));
    let robot_models_service = get_service(ServeDir::new(state.instance_dir.join("models")));

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any)
        .expose_headers([
            HeaderName::from_static("grpc-status"),
            HeaderName::from_static("grpc-message"),
            HeaderName::from_static("grpc-status-details-bin"),
            HeaderName::from_static("x-grpc-web"),
        ]);

    Router::new()
        .route_service(
            "/bass.controller.v1.ControllerService/{*rest}",
            grpc_web_service.clone(),
        )
        .route_service(
            "/bass.controller.v1.TaskService/{*rest}",
            grpc_web_service.clone(),
        )
        .route_service(
            "/bass.controller.v1.LogService/{*rest}",
            grpc_web_service.clone(),
        )
        .route_service("/bass.controller.v1.MotionService/{*rest}", grpc_web_service)
        .nest_service("/robot-assets/config", robot_config_service)
        .nest_service("/robot-assets/models", robot_models_service)
        .fallback_service(static_service)
        .layer(cors)
        .with_state(state)
}

async fn fallback_handler() -> impl IntoResponse {
    (
        axum::http::StatusCode::NOT_FOUND,
        [(
            axum::http::header::CONTENT_TYPE,
            "text/plain; charset=utf-8",
        )],
        "未找到静态前端资源，请先构建 bass-web 并同步至 runtime/web/",
    )
}

fn simple_resp(res: Result<(), String>) -> pb::SimpleResponse {
    match res {
        Ok(()) => pb::SimpleResponse {
            ok: true,
            error: String::new(),
        },
        Err(error) => pb::SimpleResponse { ok: false, error },
    }
}

fn to_proto_op_mode(m: OpMode) -> pb::OpMode {
    match m {
        OpMode::Manual => pb::OpMode::Manual,
        OpMode::Auto => pb::OpMode::Auto,
    }
}

fn from_proto_op_mode(raw: i32) -> Result<OpMode, Status> {
    match pb::OpMode::try_from(raw) {
        Ok(pb::OpMode::Manual) => Ok(OpMode::Manual),
        Ok(pb::OpMode::Auto) => Ok(OpMode::Auto),
        _ => Err(Status::invalid_argument("无效的操作模式 OpMode")),
    }
}

fn to_proto_interpreter_state(s: InterpreterState) -> pb::InterpreterState {
    match s {
        InterpreterState::Idle => pb::InterpreterState::Idle,
        InterpreterState::Ready => pb::InterpreterState::Ready,
        InterpreterState::Running => pb::InterpreterState::Running,
        InterpreterState::Paused => pb::InterpreterState::Paused,
        InterpreterState::Completed => pb::InterpreterState::Completed,
        InterpreterState::Error => pb::InterpreterState::Error,
    }
}

fn to_proto_motion_state(s: MotionState) -> pb::MotionState {
    match s {
        MotionState::Idle => pb::MotionState::Idle,
        MotionState::MoveL => pb::MotionState::Movel,
        MotionState::MoveJ => pb::MotionState::Movej,
        MotionState::Jog => pb::MotionState::Jog,
    }
}

fn from_proto_task_command(raw: i32) -> Result<TaskControlCommand, Status> {
    match pb::TaskControlCommand::try_from(raw) {
        Ok(pb::TaskControlCommand::Run) => Ok(TaskControlCommand::Run),
        Ok(pb::TaskControlCommand::Step) => Ok(TaskControlCommand::Step),
        Ok(pb::TaskControlCommand::Pause) => Ok(TaskControlCommand::Pause),
        Ok(pb::TaskControlCommand::Reset) => Ok(TaskControlCommand::Reset),
        _ => Err(Status::invalid_argument("无效的任务控制指令 TaskControlCommand")),
    }
}

fn from_proto_jog_command(cmd: pb::JogCommand) -> Result<JogCommand, Status> {
    let coord_system = match pb::CoordSystem::try_from(cmd.coord_system) {
        Ok(pb::CoordSystem::Cartesian) => CoordSystem::Cartesian,
        Ok(pb::CoordSystem::Joint) => CoordSystem::Joint,
        _ => return Err(Status::invalid_argument("无效的坐标系 CoordSystem")),
    };
    Ok(JogCommand {
        coord_system,
        axis: cmd.axis,
        direction: cmd.direction,
        step_size: cmd.step_size,
    })
}

fn from_proto_pose(p: pb::Pose6D) -> Result<Pose6D, Status> {
    if !p.x.is_finite()
        || !p.y.is_finite()
        || !p.z.is_finite()
        || !p.a.is_finite()
        || !p.b.is_finite()
        || !p.c.is_finite()
    {
        return Err(Status::invalid_argument("Pose6D 包含非有限浮点数 (NaN/Inf)"));
    }
    Ok(Pose6D {
        x: p.x,
        y: p.y,
        z: p.z,
        a: p.a,
        b: p.b,
        c: p.c,
    })
}

fn from_proto_joints(j: pb::Joints6D) -> Result<Joints6D, Status> {
    if j.values.len() != 6 {
        return Err(Status::invalid_argument(format!(
            "Joints6D 必须包含 6 个关节角度，实际为 {}",
            j.values.len()
        )));
    }
    if j.values.iter().any(|v| !v.is_finite()) {
        return Err(Status::invalid_argument("Joints6D 包含非有限浮点数 (NaN/Inf)"));
    }
    Ok(Joints6D {
        values: [
            j.values[0],
            j.values[1],
            j.values[2],
            j.values[3],
            j.values[4],
            j.values[5],
        ],
    })
}

fn to_proto_motion_telemetry(t: &MotionTelemetry) -> pb::MotionTelemetry {
    pb::MotionTelemetry {
        drives_enabled: t.drives_enabled,
        estop_active: t.estop_active,
        speed_override: t.speed_override as u32,
        motion_state: to_proto_motion_state(t.motion_state) as i32,
        paused: t.paused,
        active_motion_id: t.active_motion_id,
        joint_actual: t.joint_actual.to_vec(),
        joint_cmd: t.joint_cmd.to_vec(),
        joint_velocity: t.joint_velocity.to_vec(),
        joint_torque: t.joint_torque.to_vec(),
        cart_actual: Some(pb::Pose6D {
            x: t.cart_actual.x,
            y: t.cart_actual.y,
            z: t.cart_actual.z,
            a: t.cart_actual.a,
            b: t.cart_actual.b,
            c: t.cart_actual.c,
        }),
        digital_out: t.digital_out.to_vec(),
        digital_in: t.digital_in,
        plant_online: t.plant_online,
        plant_fault_active: t.plant_fault_active,
        last_fault_code: t.last_fault_code,
        rtt_ms: t.rtt_ms,
        cycle_count: t.cycle_count,
        sim_tick: t.sim_tick,
    }
}

fn to_proto_motion_event(ev: &MotionEvent) -> pb::MotionEvent {
    match ev {
        MotionEvent::MotionCompleted { motion_id } => pb::MotionEvent {
            event_type: pb::MotionEventType::Completed as i32,
            motion_id: *motion_id,
            message: String::new(),
            fault_code: 0,
            was_moving: false,
            plant_online: true,
            sim_tick: 0,
        },
        MotionEvent::MotionFailed { motion_id, error } => pb::MotionEvent {
            event_type: pb::MotionEventType::Failed as i32,
            motion_id: *motion_id,
            message: error.clone(),
            fault_code: 0,
            was_moving: false,
            plant_online: true,
            sim_tick: 0,
        },
        MotionEvent::SafetyTripped {
            reason,
            fault_code,
            was_moving,
        } => pb::MotionEvent {
            event_type: pb::MotionEventType::SafetyTripped as i32,
            motion_id: 0,
            message: reason.clone(),
            fault_code: *fault_code,
            was_moving: *was_moving,
            plant_online: true,
            sim_tick: 0,
        },
        MotionEvent::PlantOnlineChanged { online, sim_tick } => pb::MotionEvent {
            event_type: pb::MotionEventType::PlantOnlineChanged as i32,
            motion_id: 0,
            message: String::new(),
            fault_code: 0,
            was_moving: false,
            plant_online: *online,
            sim_tick: *sim_tick,
        },
        MotionEvent::FaultCleared => pb::MotionEvent {
            event_type: pb::MotionEventType::FaultCleared as i32,
            motion_id: 0,
            message: String::new(),
            fault_code: 0,
            was_moving: false,
            plant_online: true,
            sim_tick: 0,
        },
    }
}

fn to_proto_snapshot(snap: &RobotStateSnapshot) -> pb::RobotStateSnapshot {
    pb::RobotStateSnapshot {
        op_mode: to_proto_op_mode(snap.op_mode) as i32,
        drives_on: snap.drives_on,
        emergency_stop: snap.emergency_stop,
        speed_override: snap.speed_override as u32,
        interpreter_state: to_proto_interpreter_state(snap.interpreter_state) as i32,
        motion_state: to_proto_motion_state(snap.motion_state) as i32,
        active_program: snap.active_program.clone(),
        current_line: snap.current_line as u32,
        joint_actual: snap.joint_actual.to_vec(),
        joint_torque: snap.joint_torque.to_vec(),
        cart_actual: Some(pb::Pose6D {
            x: snap.cart_actual.x,
            y: snap.cart_actual.y,
            z: snap.cart_actual.z,
            a: snap.cart_actual.a,
            b: snap.cart_actual.b,
            c: snap.cart_actual.c,
        }),
        digital_out: snap.digital_out.to_vec(),
        plant_online: snap.plant_online,
        rtt_ms: snap.rtt_ms,
        cycle_count: snap.cycle_count,
        sim_tick: snap.sim_tick,
        status_message: snap.status_message.clone(),
    }
}

fn to_proto_diagnostic(d: &CompileDiagnostic) -> pb::CompileDiagnostic {
    let severity = match d.severity {
        DiagnosticSeverity::Info => pb::DiagnosticSeverity::Info,
        DiagnosticSeverity::Warning => pb::DiagnosticSeverity::Warning,
        DiagnosticSeverity::Error => pb::DiagnosticSeverity::Error,
    };
    let stage = match d.stage {
        CompileStage::Syntax => pb::CompileStage::Syntax,
        CompileStage::Semantic => pb::CompileStage::Semantic,
        CompileStage::Lowering => pb::CompileStage::Lowering,
        CompileStage::Codegen => pb::CompileStage::Codegen,
    };
    pb::CompileDiagnostic {
        severity: severity as i32,
        stage: stage as i32,
        line: d.line as u32,
        column: d.column as u32,
        message: d.message.clone(),
    }
}

fn to_proto_compile_report(r: &bass_compiler::CompileReport) -> pb::CompileReport {
    let ir = r.ir.as_ref().map(|ir| pb::RobotProgramIr {
        program_name: ir.program_name.clone(),
        source_hash: ir.source_hash.clone(),
        instructions: ir
            .instructions
            .iter()
            .map(|inst| pb::IrInstruction {
                seq: inst.seq as u32,
                line: inst.line as u32,
                summary: inst.summary.clone(),
                op_json: serde_json::to_string(&inst.op).unwrap_or_default(),
            })
            .collect(),
        stats: Some(pb::IrStats {
            total_instructions: ir.stats.total_instructions as u32,
            motion_count: ir.stats.motion_count as u32,
            io_count: ir.stats.io_count as u32,
            wait_count: ir.stats.wait_count as u32,
            static_ik_checked: ir.stats.static_ik_checked as u32,
            symbol_count: ir.stats.symbol_count as u32,
        }),
    });

    pb::CompileReport {
        ok: r.ok,
        program_name: r.program_name.clone(),
        source_hash: r.source_hash.clone(),
        diagnostics: r.diagnostics.iter().map(to_proto_diagnostic).collect(),
        ir,
    }
}

fn from_proto_log_level(raw: i32) -> Option<LogLevel> {
    match pb::LogLevel::try_from(raw) {
        Ok(pb::LogLevel::Info) => Some(LogLevel::Info),
        Ok(pb::LogLevel::Warn) => Some(LogLevel::Warn),
        Ok(pb::LogLevel::Error) => Some(LogLevel::Error),
        _ => None,
    }
}

fn from_proto_log_category(raw: i32) -> Option<LogCategory> {
    match pb::LogCategory::try_from(raw) {
        Ok(pb::LogCategory::System) => Some(LogCategory::System),
        Ok(pb::LogCategory::Safety) => Some(LogCategory::Safety),
        Ok(pb::LogCategory::Motion) => Some(LogCategory::Motion),
        Ok(pb::LogCategory::Fieldbus) => Some(LogCategory::Fieldbus),
        Ok(pb::LogCategory::Compiler) => Some(LogCategory::Compiler),
        Ok(pb::LogCategory::Script) => Some(LogCategory::Script),
        _ => None,
    }
}

fn to_proto_log_entry(e: &LogEntry) -> pb::LogEntry {
    let level = match e.level {
        LogLevel::Info => pb::LogLevel::Info,
        LogLevel::Warn => pb::LogLevel::Warn,
        LogLevel::Error => pb::LogLevel::Error,
    };
    let category = match e.category {
        LogCategory::System => pb::LogCategory::System,
        LogCategory::Safety => pb::LogCategory::Safety,
        LogCategory::Motion => pb::LogCategory::Motion,
        LogCategory::Fieldbus => pb::LogCategory::Fieldbus,
        LogCategory::Compiler => pb::LogCategory::Compiler,
        LogCategory::Script => pb::LogCategory::Script,
    };
    pb::LogEntry {
        id: e.id,
        timestamp_ms: e.timestamp_ms,
        timestamp_iso: e.timestamp_iso.clone(),
        level: level as i32,
        category: category as i32,
        source: e.source.clone(),
        message: e.message.clone(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::task_manager::TaskManager;
    use axum::body::Body;
    use axum::http::{header, Request, StatusCode};
    use bass_hal::MockFieldbusTransport;
    use bass_motion::Serial6DofKinematics;
    use bass_motion_engine::{MotionEngine, MotionEngineApi};
    use bass_proto::v1::controller_service_client::ControllerServiceClient;
    use bass_proto::v1::log_service_client::LogServiceClient;
    use bass_proto::v1::motion_service_client::MotionServiceClient;
    use bass_proto::v1::task_service_client::TaskServiceClient;
    use bass_types::{Joints6D, TxPdo, STAT_DRIVES_ENABLED, STAT_PLANT_READY};
    use http_body_util::BodyExt;
    use prost::Message;
    use std::path::Path;
    use std::time::Instant;
    use tokio::net::TcpListener;
    use tokio_stream::StreamExt;
    use tower::ServiceExt as TowerServiceExt;

    fn test_instance_dir() -> PathBuf {
        Path::new(env!("CARGO_MANIFEST_DIR")).join("../../../../runtime/instances/default_cell")
    }

    fn test_web_dir() -> PathBuf {
        Path::new(env!("CARGO_MANIFEST_DIR")).join("../../../bass-web/dist")
    }

    fn setup_runtime_router() -> Router {
        let inst_dir = test_instance_dir();
        let kin =
            Serial6DofKinematics::from_json_file(inst_dir.join("config/robot_model.json")).unwrap();
        let mock = MockFieldbusTransport::new();
        let logger = LogManager::in_memory(500);
        let compiler = Arc::new(RobotCompiler::new(kin.clone()));
        let programs_dir = inst_dir.join("programs");

        let (mut mk, mk_client) = MotionEngine::new(kin.clone(), mock, logger.clone());
        // 预先注入物理端在线帧并启用伺服，便于端点联动验证
        let home = Joints6D::home().values;
        mk.transport.push_tx_pdo(TxPdo {
            status_word: STAT_PLANT_READY | STAT_DRIVES_ENABLED,
            echo_seq: 0,
            sim_tick: 1,
            q_act_deg: home,
            qd_act_deg_s: [0.0; 6],
            tau_act_nm: [0.0; 6],
            digital_in: 0,
            fault_code: 0,
        });
        mk.step_once(Instant::now());

        let motion_api: Arc<dyn MotionEngineApi> = Arc::new(mk_client);
        let (tm, task_handle) = TaskManager::with_compiler(
            motion_api.clone(),
            &kin,
            compiler.clone(),
            logger.clone(),
            &programs_dir,
        )
        .unwrap();

        std::thread::spawn(move || {
            let mut now = Instant::now();
            for tick in 2..10_000u64 {
                now += Duration::from_millis(bass_motion_engine::MOTION_CYCLE_MS);
                let seq = mk.seq;
                let q = mk.q_cmd.values;
                mk.transport.push_tx_pdo(TxPdo {
                    status_word: STAT_PLANT_READY | STAT_DRIVES_ENABLED,
                    echo_seq: seq,
                    sim_tick: tick,
                    q_act_deg: q,
                    qd_act_deg_s: [0.0; 6],
                    tau_act_nm: [0.0; 6],
                    digital_in: 0,
                    fault_code: 0,
                });
                mk.step_once(now);
                std::thread::sleep(Duration::from_millis(1));
            }
        });

        tokio::spawn(tm.run_loop());

        let state = AppState::new(
            task_handle,
            motion_api,
            compiler,
            logger,
            inst_dir,
            programs_dir,
            test_web_dir(),
        );
        build_app(state)
    }

    async fn spawn_test_server() -> String {
        let app = setup_runtime_router();
        let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
        let addr = listener.local_addr().unwrap();
        tokio::spawn(async move {
            let _ = axum::serve(listener, app).await;
        });
        format!("http://{}", addr)
    }

    fn encode_grpc_web_frame<M: Message>(msg: &M) -> Vec<u8> {
        let payload = msg.encode_to_vec();
        let mut frame = Vec::with_capacity(5 + payload.len());
        frame.push(0u8);
        frame.extend_from_slice(&(payload.len() as u32).to_be_bytes());
        frame.extend_from_slice(&payload);
        frame
    }

    fn decode_grpc_web_first_frame<M: Message + Default>(bytes: &[u8]) -> M {
        assert!(bytes.len() >= 5, "gRPC-Web response too short: {}", bytes.len());
        assert_eq!(bytes[0], 0u8, "expected data frame flag 0x00");
        let len = u32::from_be_bytes([bytes[1], bytes[2], bytes[3], bytes[4]]) as usize;
        assert!(bytes.len() >= 5 + len);
        M::decode(&bytes[5..5 + len]).unwrap()
    }

    #[tokio::test]
    async fn test_grpc_controller_and_task_native_client() {
        let endpoint = spawn_test_server().await;
        let mut ctrl = ControllerServiceClient::connect(endpoint.clone())
            .await
            .unwrap();
        let mut task = TaskServiceClient::connect(endpoint).await.unwrap();

        // 1. GetState & SubscribeTelemetry (Server Streaming)
        let snap = ctrl.get_state(pb::GetStateRequest {}).await.unwrap().into_inner();
        assert_eq!(snap.op_mode, pb::OpMode::Manual as i32);
        assert_eq!(snap.speed_override, 100);
        assert!(snap.plant_online);

        let mut stream = ctrl
            .subscribe_telemetry(pb::SubscribeTelemetryRequest { interval_ms: 20 })
            .await
            .unwrap()
            .into_inner();
        let first_tick = stream.next().await.unwrap().unwrap();
        let second_tick = stream.next().await.unwrap().unwrap();
        assert!(second_tick.sim_tick >= first_tick.sim_tick);

        // 2. Mode, Override, E-STOP, Drives Power
        let mode_resp = ctrl
            .set_mode(pb::SetModeRequest {
                mode: pb::OpMode::Auto as i32,
            })
            .await
            .unwrap()
            .into_inner();
        assert!(mode_resp.ok);
        assert_eq!(mode_resp.mode, pb::OpMode::Auto as i32);

        let ovr_resp = ctrl
            .set_speed_override(pb::SetSpeedOverrideRequest { speed_override: 65 })
            .await
            .unwrap()
            .into_inner();
        assert_eq!(ovr_resp.speed_override, 65);

        ctrl.set_emergency_stop(pb::SetEmergencyStopRequest {
            emergency_stop: true,
        })
        .await
        .unwrap();

        let pwr_fail = ctrl
            .set_drives_power(pb::SetDrivesPowerRequest { drives_on: true })
            .await
            .unwrap()
            .into_inner();
        assert!(!pwr_fail.ok);

        ctrl.set_emergency_stop(pb::SetEmergencyStopRequest {
            emergency_stop: false,
        })
        .await
        .unwrap();
        let pwr_ok = ctrl
            .set_drives_power(pb::SetDrivesPowerRequest { drives_on: true })
            .await
            .unwrap()
            .into_inner();
        assert!(pwr_ok.ok);
        assert!(pwr_ok.drives_on);

        // 3. ListPrograms & CompileProgram
        let progs = task
            .list_programs(pb::ListProgramsRequest {})
            .await
            .unwrap()
            .into_inner()
            .programs;
        assert!(progs.contains(&"MoveSquare.rhai".to_string()));
        assert!(progs.contains(&"PickAndPlace.rhai".to_string()));

        let report = task
            .compile_program(pb::CompileProgramRequest {
                name: "MoveSquare.rhai".to_string(),
                code: None,
            })
            .await
            .unwrap()
            .into_inner();
        assert!(report.ok);
        assert!(report.ir.unwrap().stats.unwrap().motion_count >= 5);
    }

    #[tokio::test]
    async fn test_grpc_save_program_errors_and_logs_service() {
        let endpoint = spawn_test_server().await;
        let mut task = TaskServiceClient::connect(endpoint.clone()).await.unwrap();
        let mut logs = LogServiceClient::connect(endpoint).await.unwrap();

        // 1. 语法错误检测（不写入磁盘，返回行号 3）
        let bad_syntax = task
            .save_program(pb::SaveProgramRequest {
                name: "BadSyntax.rhai".to_string(),
                code: "let a = 1;\nlet b = 2;\nlet c = );\na + b".to_string(),
            })
            .await
            .unwrap()
            .into_inner();
        assert!(!bad_syntax.ok);
        assert_eq!(bad_syntax.error_line, 3);
        assert!(!bad_syntax.report.unwrap().diagnostics.is_empty());

        // 2. 语义越界 IK 检测 + LogService 检索/导出/清空
        let bad_ik = task
            .save_program(pb::SaveProgramRequest {
                name: "BadIk.rhai".to_string(),
                code: "MoveL(Pose(5000, 0, 5000, 0, 0, 180), #{ vel: 100 });".to_string(),
            })
            .await
            .unwrap()
            .into_inner();
        assert!(!bad_ik.ok);

        let queried = logs
            .query_logs(pb::QueryLogsRequest {
                level: pb::LogLevel::Error as i32,
                category: pb::LogCategory::Compiler as i32,
                q: String::new(),
                after_id: None,
                limit: Some(50),
            })
            .await
            .unwrap()
            .into_inner();
        assert!(queried.ok);
        assert!(!queried.entries.is_empty());

        let exported = logs
            .export_logs(pb::ExportLogsRequest {
                level: pb::LogLevel::Unspecified as i32,
                category: pb::LogCategory::Unspecified as i32,
                q: String::new(),
                format: pb::LogExportFormat::Jsonl as i32,
            })
            .await
            .unwrap()
            .into_inner();
        assert!(exported.ok);
        assert!(exported.content.contains("BadIk.rhai"));

        let cleared = logs
            .clear_logs(pb::ClearLogsRequest {})
            .await
            .unwrap()
            .into_inner();
        assert!(cleared.ok);
    }

    #[tokio::test]
    async fn test_grpc_path_traversal_and_non_rhai_rejected() {
        let endpoint = spawn_test_server().await;
        let mut task = TaskServiceClient::connect(endpoint).await.unwrap();

        let err_trav = task
            .get_program(pb::GetProgramRequest {
                name: "../../secret.rhai".to_string(),
            })
            .await
            .unwrap_err();
        assert_eq!(err_trav.code(), tonic::Code::InvalidArgument);

        let err_get_ext = task
            .get_program(pb::GetProgramRequest {
                name: "test.txt".to_string(),
            })
            .await
            .unwrap_err();
        assert_eq!(err_get_ext.code(), tonic::Code::InvalidArgument);

        let err_save_ext = task
            .save_program(pb::SaveProgramRequest {
                name: "test.py".to_string(),
                code: "print('hello')".to_string(),
            })
            .await
            .unwrap_err();
        assert_eq!(err_save_ext.code(), tonic::Code::InvalidArgument);

        let err_ctrl_ext = task
            .control_task(pb::ControlTaskRequest {
                command: pb::TaskControlCommand::Run as i32,
                program_name: "test.sh".to_string(),
            })
            .await
            .unwrap_err();
        assert_eq!(err_ctrl_ext.code(), tonic::Code::InvalidArgument);
    }

    #[tokio::test]
    async fn test_grpc_web_http1_browser_protocol_and_static_fallback() {
        let app = setup_runtime_router();

        // 1. gRPC-Web HTTP/1.1 POST GetState
        let req_grpc_web = Request::builder()
            .method("POST")
            .uri("/bass.controller.v1.ControllerService/GetState")
            .header(header::CONTENT_TYPE, "application/grpc-web+proto")
            .header("x-grpc-web", "1")
            .body(Body::from(encode_grpc_web_frame(&pb::GetStateRequest {})))
            .unwrap();

        let resp = app.clone().oneshot(req_grpc_web).await.unwrap();
        assert_eq!(resp.status(), StatusCode::OK);
        let bytes = resp.into_body().collect().await.unwrap().to_bytes();
        let snap: pb::RobotStateSnapshot = decode_grpc_web_first_frame(&bytes);
        assert_eq!(snap.op_mode, pb::OpMode::Manual as i32);
        assert_eq!(snap.speed_override, 100);

        // 2. gRPC-Web HTTP/1.1 POST ListPrograms
        let req_list = Request::builder()
            .method("POST")
            .uri("/bass.controller.v1.TaskService/ListPrograms")
            .header(header::CONTENT_TYPE, "application/grpc-web+proto")
            .header("x-grpc-web", "1")
            .body(Body::from(encode_grpc_web_frame(&pb::ListProgramsRequest {})))
            .unwrap();
        let resp_list = app.clone().oneshot(req_list).await.unwrap();
        assert_eq!(resp_list.status(), StatusCode::OK);
        let list_bytes = resp_list.into_body().collect().await.unwrap().to_bytes();
        let list_pb: pb::ListProgramsResponse = decode_grpc_web_first_frame(&list_bytes);
        assert!(list_pb.programs.contains(&"MoveSquare.rhai".to_string()));

        // 2b. gRPC-Web HTTP/1.1 POST MotionService/GetMotionTelemetry
        let req_motion = Request::builder()
            .method("POST")
            .uri("/bass.controller.v1.MotionService/GetMotionTelemetry")
            .header(header::CONTENT_TYPE, "application/grpc-web+proto")
            .header("x-grpc-web", "1")
            .body(Body::from(encode_grpc_web_frame(
                &pb::GetMotionTelemetryRequest {},
            )))
            .unwrap();
        let resp_motion = app.clone().oneshot(req_motion).await.unwrap();
        assert_eq!(resp_motion.status(), StatusCode::OK);
        let motion_bytes = resp_motion.into_body().collect().await.unwrap().to_bytes();
        let telem_pb: pb::MotionTelemetry = decode_grpc_web_first_frame(&motion_bytes);
        assert!(telem_pb.plant_online);
        assert_eq!(telem_pb.joint_actual.len(), 6);

        // 3. 普通 HTTP/1.1 GET 请求不应被 gRPC-Web 拦截返回 400
        let req_static = Request::builder()
            .method("GET")
            .uri("/nonexistent-asset.txt")
            .body(Body::empty())
            .unwrap();
        let resp_static = app.clone().oneshot(req_static).await.unwrap();
        assert_ne!(resp_static.status(), StatusCode::BAD_REQUEST);
    }

    #[tokio::test]
    async fn test_grpc_motion_service_direct_move_and_task_interlock() {
        let endpoint = spawn_test_server().await;
        let mut ctrl = ControllerServiceClient::connect(endpoint.clone())
            .await
            .unwrap();
        let mut task = TaskServiceClient::connect(endpoint.clone()).await.unwrap();
        let mut motion = MotionServiceClient::connect(endpoint).await.unwrap();

        let telem0 = motion
            .get_motion_telemetry(pb::GetMotionTelemetryRequest {})
            .await
            .unwrap()
            .into_inner();
        assert!(telem0.plant_online);
        assert_eq!(telem0.joint_actual.len(), 6);

        ctrl.set_drives_power(pb::SetDrivesPowerRequest { drives_on: true })
            .await
            .unwrap();

        let mut ev_stream = motion
            .subscribe_motion_events(pb::SubscribeMotionEventsRequest {})
            .await
            .unwrap()
            .into_inner();

        let mut telem_stream = motion
            .subscribe_motion_telemetry(pb::SubscribeTelemetryRequest { interval_ms: 20 })
            .await
            .unwrap()
            .into_inner();
        let t1 = telem_stream.next().await.unwrap().unwrap();
        assert!(t1.drives_enabled);

        // 1. 外部 gRPC 直调 MoveJ (同步等待完成)
        let mut target_joints = telem0.joint_actual.clone();
        target_joints[0] += 3.0;
        let move_j_resp = motion
            .move_j(pb::MoveJRequest {
                target: Some(pb::move_j_request::Target::Joints(pb::Joints6D {
                    values: target_joints.clone(),
                })),
                vel_deg_s: 60.0,
                wait_for_completion: true,
            })
            .await
            .unwrap()
            .into_inner();
        assert!(move_j_resp.ok, "MoveJ 失败: {}", move_j_resp.error);
        assert!(move_j_resp.motion_id > 0);

        let completed_ev = ev_stream.next().await.unwrap().unwrap();
        assert_eq!(completed_ev.event_type, pb::MotionEventType::Completed as i32);
        assert_eq!(completed_ev.motion_id, move_j_resp.motion_id);

        let telem1 = motion
            .get_motion_telemetry(pb::GetMotionTelemetryRequest {})
            .await
            .unwrap()
            .into_inner();
        assert!((telem1.joint_actual[0] - target_joints[0]).abs() < 0.1);

        // 2. 外部 gRPC 直调 MoveL
        let home_pose = telem0.cart_actual.unwrap();
        let move_l_resp = motion
            .move_l(pb::MoveLRequest {
                target: Some(pb::Pose6D {
                    x: home_pose.x + 20.0,
                    y: home_pose.y,
                    z: home_pose.z,
                    a: home_pose.a,
                    b: home_pose.b,
                    c: home_pose.c,
                }),
                vel_mm_s: 200.0,
                wait_for_completion: true,
            })
            .await
            .unwrap()
            .into_inner();
        assert!(move_l_resp.ok, "MoveL 失败: {}", move_l_resp.error);

        // 3. 安全互锁校验：脚本运行期间禁止外部直接下发 MoveL，且 StopMotion 可安全复位任务
        ctrl.set_mode(pb::SetModeRequest {
            mode: pb::OpMode::Auto as i32,
        })
        .await
        .unwrap();
        let run_resp = task
            .control_task(pb::ControlTaskRequest {
                command: pb::TaskControlCommand::Run as i32,
                program_name: "MoveSquare.rhai".to_string(),
            })
            .await
            .unwrap()
            .into_inner();
        assert!(run_resp.ok);

        let blocked_resp = motion
            .move_l(pb::MoveLRequest {
                target: Some(home_pose),
                vel_mm_s: 100.0,
                wait_for_completion: false,
            })
            .await
            .unwrap()
            .into_inner();
        assert!(!blocked_resp.ok);
        assert!(blocked_resp.error.contains("当前程序正在运行或暂停中"));

        let stop_resp = motion
            .stop_motion(pb::StopMotionRequest {})
            .await
            .unwrap()
            .into_inner();
        assert!(stop_resp.ok);

        let clear_resp = motion
            .clear_fault(pb::ClearFaultRequest {})
            .await
            .unwrap()
            .into_inner();
        assert!(clear_resp.ok);
    }

    #[tokio::test]
    async fn test_robot_assets_static_serving() {
        let app = setup_runtime_router();
        let req = Request::builder()
            .uri("/robot-assets/config/robot_model.json")
            .body(Body::empty())
            .unwrap();
        let resp = app.clone().oneshot(req).await.unwrap();
        assert_eq!(resp.status(), StatusCode::OK);
        let body = resp.into_body().collect().await.unwrap().to_bytes();
        let text = String::from_utf8_lossy(&body);
        assert!(text.contains("\"robot_name\": \"UR5e\""));

        let obj_req = Request::builder()
            .uri("/robot-assets/models/ur5e/assets/base_0.obj")
            .body(Body::empty())
            .unwrap();
        let obj_resp = app.oneshot(obj_req).await.unwrap();
        assert_eq!(obj_resp.status(), StatusCode::OK);
    }
}
