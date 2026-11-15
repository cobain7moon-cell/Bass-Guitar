use chrono::Local;
use serde::{Deserialize, Serialize};
use std::collections::VecDeque;
use std::fs::{self, File, OpenOptions};
use std::io::{BufRead, BufReader, BufWriter, Write};
use std::path::{Path, PathBuf};
use std::str::FromStr;
use std::sync::mpsc::{self, SyncSender};
use std::sync::{Arc, Mutex};
use std::thread::{self, JoinHandle};

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
#[serde(rename_all = "UPPERCASE")]
pub enum LogLevel {
    Info,
    Warn,
    Error,
}

impl LogLevel {
    pub fn as_str(self) -> &'static str {
        match self {
            LogLevel::Info => "INFO",
            LogLevel::Warn => "WARN",
            LogLevel::Error => "ERROR",
        }
    }
}

impl FromStr for LogLevel {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.trim().to_ascii_uppercase().as_str() {
            "INFO" => Ok(LogLevel::Info),
            "WARN" | "WARNING" => Ok(LogLevel::Warn),
            "ERROR" | "ERR" => Ok(LogLevel::Error),
            other => Err(format!("未知日志级别: {}", other)),
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "UPPERCASE")]
pub enum LogCategory {
    System,
    Safety,
    Motion,
    Fieldbus,
    Compiler,
    Script,
}

impl LogCategory {
    pub fn as_str(self) -> &'static str {
        match self {
            LogCategory::System => "SYSTEM",
            LogCategory::Safety => "SAFETY",
            LogCategory::Motion => "MOTION",
            LogCategory::Fieldbus => "FIELDBUS",
            LogCategory::Compiler => "COMPILER",
            LogCategory::Script => "SCRIPT",
        }
    }
}

impl FromStr for LogCategory {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.trim().to_ascii_uppercase().as_str() {
            "SYSTEM" => Ok(LogCategory::System),
            "SAFETY" => Ok(LogCategory::Safety),
            "MOTION" => Ok(LogCategory::Motion),
            "FIELDBUS" => Ok(LogCategory::Fieldbus),
            "COMPILER" => Ok(LogCategory::Compiler),
            "SCRIPT" => Ok(LogCategory::Script),
            other => Err(format!("未知日志分类: {}", other)),
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct LogEntry {
    pub id: u64,
    pub timestamp_ms: u64,
    pub timestamp_iso: String,
    pub level: LogLevel,
    pub category: LogCategory,
    pub source: String,
    pub message: String,
}

#[derive(Debug, Clone, Default)]
pub struct LogQuery {
    pub level: Option<LogLevel>,
    pub category: Option<LogCategory>,
    pub q: Option<String>,
    pub after_id: Option<u64>,
    pub limit: Option<usize>,
}

#[derive(Debug, Clone)]
pub struct LogManagerConfig {
    pub log_dir: Option<PathBuf>,
    pub max_memory_entries: usize,
    pub max_file_bytes: u64,
    pub max_files: usize,
}

impl Default for LogManagerConfig {
    fn default() -> Self {
        Self {
            log_dir: None,
            max_memory_entries: 2000,
            max_file_bytes: 5 * 1024 * 1024,
            max_files: 7,
        }
    }
}

#[derive(Debug)]
struct RingState {
    next_id: u64,
    max_entries: usize,
    entries: VecDeque<LogEntry>,
}

impl RingState {
    fn push(&mut self, entry: LogEntry) {
        if self.max_entries == 0 {
            return;
        }
        if self.entries.len() >= self.max_entries {
            self.entries.pop_front();
        }
        self.entries.push_back(entry);
    }
}

enum WriterCmd {
    Write(LogEntry),
    Flush(SyncSender<()>),
    Shutdown,
}

struct DiskWriterInner {
    tx: SyncSender<WriterCmd>,
    handle: Mutex<Option<JoinHandle<()>>>,
}

impl Drop for DiskWriterInner {
    fn drop(&mut self) {
        let _ = self.tx.try_send(WriterCmd::Shutdown);
        if let Ok(mut guard) = self.handle.lock() {
            if let Some(h) = guard.take() {
                let _ = h.join();
            }
        }
    }
}

/// 线程安全日志管理器：实时环形内存缓冲 + 后台非阻塞 JSONL 轮转落盘。
#[derive(Clone)]
pub struct LogManager {
    ring: Arc<Mutex<RingState>>,
    writer: Option<Arc<DiskWriterInner>>,
}

impl std::fmt::Debug for LogManager {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("LogManager")
            .field("latest_id", &self.latest_id())
            .field("disk_enabled", &self.writer.is_some())
            .finish()
    }
}

impl LogManager {
    pub fn in_memory(max_memory_entries: usize) -> Self {
        Self::new(LogManagerConfig {
            log_dir: None,
            max_memory_entries,
            ..Default::default()
        })
    }

    pub fn new(config: LogManagerConfig) -> Self {
        let max_entries = config.max_memory_entries.max(1);
        let mut state = RingState {
            next_id: 1,
            max_entries,
            entries: VecDeque::with_capacity(max_entries.min(256)),
        };

        let writer = if let Some(dir) = config.log_dir {
            if let Err(err) = fs::create_dir_all(&dir) {
                eprintln!("[bass-logger] 创建日志目录失败 ({}): {}", dir.display(), err);
                None
            } else {
                // 启动时加载当天历史日志尾部以保留上下文
                let today_file = active_log_path(&dir, &Local::now().format("%Y-%m-%d").to_string());
                if today_file.exists() {
                    if let Ok(loaded) = load_tail_jsonl(&today_file, max_entries) {
                        for entry in loaded {
                            state.next_id = state.next_id.max(entry.id + 1);
                            state.push(entry);
                        }
                    }
                }

                let (tx, rx) = mpsc::sync_channel::<WriterCmd>(4096);
                let max_bytes = config.max_file_bytes.max(512);
                let max_files = config.max_files.max(1);
                let handle = thread::Builder::new()
                    .name("bass-log-writer".to_string())
                    .spawn(move || run_disk_writer(dir, max_bytes, max_files, rx))
                    .ok();

                handle.map(|h| {
                    Arc::new(DiskWriterInner {
                        tx,
                        handle: Mutex::new(Some(h)),
                    })
                })
            }
        } else {
            None
        };

        Self {
            ring: Arc::new(Mutex::new(state)),
            writer,
        }
    }

    /// 写入一条结构化日志并投递至异步落盘队列（不会阻塞实时线程）。
    pub fn record(
        &self,
        level: LogLevel,
        category: LogCategory,
        source: impl Into<String>,
        message: impl Into<String>,
    ) -> u64 {
        let now = Local::now();
        let timestamp_ms = now.timestamp_millis().max(0) as u64;
        let timestamp_iso = now.format("%Y-%m-%dT%H:%M:%S%.3f%:z").to_string();

        let entry = {
            let mut guard = self.ring.lock().unwrap_or_else(|e| e.into_inner());
            let id = guard.next_id;
            guard.next_id += 1;
            let entry = LogEntry {
                id,
                timestamp_ms,
                timestamp_iso,
                level,
                category,
                source: source.into(),
                message: message.into(),
            };
            guard.push(entry.clone());
            entry
        };

        if let Some(writer) = &self.writer {
            // 使用 try_send 保证 2ms 控制循环绝对不会因 I/O 阻塞
            let _ = writer.tx.try_send(WriterCmd::Write(entry.clone()));
        }

        entry.id
    }

    pub fn info(
        &self,
        category: LogCategory,
        source: impl Into<String>,
        message: impl Into<String>,
    ) -> u64 {
        self.record(LogLevel::Info, category, source, message)
    }

    pub fn warn(
        &self,
        category: LogCategory,
        source: impl Into<String>,
        message: impl Into<String>,
    ) -> u64 {
        self.record(LogLevel::Warn, category, source, message)
    }

    pub fn error(
        &self,
        category: LogCategory,
        source: impl Into<String>,
        message: impl Into<String>,
    ) -> u64 {
        self.record(LogLevel::Error, category, source, message)
    }

    pub fn latest_id(&self) -> u64 {
        let guard = self.ring.lock().unwrap_or_else(|e| e.into_inner());
        guard.next_id.saturating_sub(1)
    }

    pub fn query(&self, query: &LogQuery) -> (Vec<LogEntry>, u64) {
        let guard = self.ring.lock().unwrap_or_else(|e| e.into_inner());
        let latest_id = guard.next_id.saturating_sub(1);
        let q_lower = query
            .q
            .as_deref()
            .map(str::trim)
            .filter(|s| !s.is_empty())
            .map(|s| s.to_lowercase());

        let mut filtered: Vec<LogEntry> = guard
            .entries
            .iter()
            .filter(|e| {
                if let Some(after) = query.after_id {
                    if e.id <= after {
                        return false;
                    }
                }
                if let Some(lvl) = query.level {
                    if e.level != lvl {
                        return false;
                    }
                }
                if let Some(cat) = query.category {
                    if e.category != cat {
                        return false;
                    }
                }
                if let Some(ref kw) = q_lower {
                    let hit = e.message.to_lowercase().contains(kw)
                        || e.source.to_lowercase().contains(kw)
                        || e.category.as_str().to_lowercase().contains(kw);
                    if !hit {
                        return false;
                    }
                }
                true
            })
            .cloned()
            .collect();

        if let Some(limit) = query.limit {
            if filtered.len() > limit {
                let start = filtered.len() - limit;
                filtered = filtered.split_off(start);
            }
        }

        (filtered, latest_id)
    }

    pub fn export_jsonl(&self, query: &LogQuery) -> String {
        let (entries, _) = self.query(query);
        let mut out = String::new();
        for entry in entries {
            if let Ok(line) = serde_json::to_string(&entry) {
                out.push_str(&line);
                out.push('\n');
            }
        }
        out
    }

    pub fn export_text(&self, query: &LogQuery) -> String {
        let (entries, _) = self.query(query);
        let mut out = String::new();
        for entry in entries {
            out.push_str(&format!(
                "[#{}] {} [{}] [{}] ({}) {}\n",
                entry.id,
                entry.timestamp_iso,
                entry.level.as_str(),
                entry.category.as_str(),
                entry.source,
                entry.message
            ));
        }
        out
    }

    pub fn clear(&self, source: impl Into<String>) -> u64 {
        {
            let mut guard = self.ring.lock().unwrap_or_else(|e| e.into_inner());
            guard.entries.clear();
        }
        self.info(LogCategory::System, source, "内存日志缓冲区已清空")
    }

    pub fn flush(&self) {
        if let Some(writer) = &self.writer {
            let (tx, rx) = mpsc::sync_channel(1);
            if writer.tx.send(WriterCmd::Flush(tx)).is_ok() {
                let _ = rx.recv_timeout(std::time::Duration::from_secs(2));
            }
        }
    }
}

fn active_log_path(dir: &Path, date_str: &str) -> PathBuf {
    dir.join(format!("bass-{}.jsonl", date_str))
}

fn load_tail_jsonl(path: &Path, max_entries: usize) -> std::io::Result<Vec<LogEntry>> {
    let file = File::open(path)?;
    let reader = BufReader::new(file);
    let mut ring = VecDeque::with_capacity(max_entries.min(256));
    for line in reader.lines().map_while(Result::ok) {
        let trimmed = line.trim();
        if trimmed.is_empty() {
            continue;
        }
        if let Ok(entry) = serde_json::from_str::<LogEntry>(trimmed) {
            if ring.len() >= max_entries {
                ring.pop_front();
            }
            ring.push_back(entry);
        }
    }
    Ok(ring.into_iter().collect())
}

fn run_disk_writer(
    dir: PathBuf,
    max_file_bytes: u64,
    max_files: usize,
    rx: mpsc::Receiver<WriterCmd>,
) {
    let mut current_date = String::new();
    let mut current_writer: Option<BufWriter<File>> = None;
    let mut current_bytes: u64 = 0;

    while let Ok(cmd) = rx.recv() {
        match cmd {
            WriterCmd::Write(entry) => {
                let date_str = entry
                    .timestamp_iso
                    .get(0..10)
                    .unwrap_or("unknown")
                    .to_string();

                if current_date != date_str || current_writer.is_none() {
                    if let Some(mut w) = current_writer.take() {
                        let _ = w.flush();
                    }
                    let path = active_log_path(&dir, &date_str);
                    if let Ok((w, len)) = open_append_writer(&path) {
                        current_writer = Some(w);
                        current_bytes = len;
                        current_date = date_str.clone();
                        prune_old_logs(&dir, max_files, Some(&path));
                    } else {
                        continue;
                    }
                }

                if let Ok(line) = serde_json::to_string(&entry) {
                    let needed = line.len() as u64 + 1;
                    if current_bytes + needed > max_file_bytes && current_bytes > 0 {
                        if let Some(mut w) = current_writer.take() {
                            let _ = w.flush();
                        }
                        rotate_active_file(&dir, &current_date);
                        let path = active_log_path(&dir, &current_date);
                        if let Ok((w, len)) = open_append_writer(&path) {
                            current_writer = Some(w);
                            current_bytes = len;
                            prune_old_logs(&dir, max_files, Some(&path));
                        } else {
                            continue;
                        }
                    }

                    if let Some(ref mut w) = current_writer {
                        if w.write_all(line.as_bytes()).is_ok() && w.write_all(b"\n").is_ok() {
                            current_bytes += needed;
                            let _ = w.flush();
                        }
                    }
                }
            }
            WriterCmd::Flush(ack) => {
                if let Some(ref mut w) = current_writer {
                    let _ = w.flush();
                }
                let _ = ack.send(());
            }
            WriterCmd::Shutdown => {
                if let Some(mut w) = current_writer.take() {
                    let _ = w.flush();
                }
                break;
            }
        }
    }
}

fn open_append_writer(path: &Path) -> std::io::Result<(BufWriter<File>, u64)> {
    let file = OpenOptions::new().create(true).append(true).open(path)?;
    let len = file.metadata().map(|m| m.len()).unwrap_or(0);
    Ok((BufWriter::new(file), len))
}

fn rotate_active_file(dir: &Path, date_str: &str) {
    let active = active_log_path(dir, date_str);
    if !active.exists() {
        return;
    }
    for idx in 1..=9999 {
        let candidate = dir.join(format!("bass-{}.{}.jsonl", date_str, idx));
        if !candidate.exists() {
            let _ = fs::rename(&active, &candidate);
            return;
        }
    }
}

fn prune_old_logs(dir: &Path, max_files: usize, protected_active: Option<&Path>) {
    let Ok(read_dir) = fs::read_dir(dir) else {
        return;
    };
    let mut total_count = 0usize;
    let mut archived: Vec<(std::time::SystemTime, String, PathBuf)> = read_dir
        .filter_map(Result::ok)
        .filter_map(|entry| {
            let path = entry.path();
            let name = entry.file_name().to_string_lossy().to_string();
            if name.starts_with("bass-") && name.ends_with(".jsonl") && path.is_file() {
                total_count += 1;
                if protected_active.is_some_and(|p| p == path) {
                    return None;
                }
                let mtime = entry
                    .metadata()
                    .and_then(|m| m.modified())
                    .unwrap_or(std::time::SystemTime::UNIX_EPOCH);
                Some((mtime, name, path))
            } else {
                None
            }
        })
        .collect();

    if total_count <= max_files {
        return;
    }

    // 最旧的归档排在前面删除，绝不误删当前正在写入的活动文件
    archived.sort_by(|a, b| a.0.cmp(&b.0).then_with(|| a.1.cmp(&b.1)));
    let to_remove = (total_count - max_files).min(archived.len());
    for (_, _, path) in archived.into_iter().take(to_remove) {
        let _ = fs::remove_file(path);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_ring_buffer_capacity_and_query_filters() {
        let logger = LogManager::in_memory(3);
        logger.info(LogCategory::System, "kernel", "boot completed");
        logger.warn(LogCategory::Fieldbus, "udp", "jitter > 8ms");
        logger.error(LogCategory::Motion, "ik", "IK target unreachable");
        logger.info(LogCategory::Script, "rhai", "Cycle 1 done");

        // 容量限制为 3，最早一条 boot completed 应被淘汰
        let (all, latest_id) = logger.query(&LogQuery::default());
        assert_eq!(latest_id, 4);
        assert_eq!(all.len(), 3);
        assert_eq!(all[0].id, 2);

        // 按级别与关键字筛选
        let (errs, _) = logger.query(&LogQuery {
            level: Some(LogLevel::Error),
            ..Default::default()
        });
        assert_eq!(errs.len(), 1);
        assert_eq!(errs[0].category, LogCategory::Motion);

        let (after_2, _) = logger.query(&LogQuery {
            after_id: Some(2),
            ..Default::default()
        });
        assert_eq!(after_2.len(), 2);

        let (kw_hit, _) = logger.query(&LogQuery {
            q: Some("cycle".to_string()),
            ..Default::default()
        });
        assert_eq!(kw_hit.len(), 1);
        assert_eq!(kw_hit[0].id, 4);
    }

    #[test]
    fn test_async_disk_persistence_and_rotation() {
        let tmp_dir = std::env::temp_dir().join(format!(
            "bass_logger_test_{}",
            Local::now().timestamp_nanos_opt().unwrap_or(0)
        ));
        let _ = fs::remove_dir_all(&tmp_dir);

        let logger = LogManager::new(LogManagerConfig {
            log_dir: Some(tmp_dir.clone()),
            max_memory_entries: 100,
            max_file_bytes: 512,
            max_files: 3,
        });

        for i in 0..30 {
            logger.info(
                LogCategory::System,
                "test_loop",
                format!("Payload log record index={} padding_for_rotation_size_check", i),
            );
        }
        logger.flush();
        drop(logger);

        let entries: Vec<_> = fs::read_dir(&tmp_dir)
            .unwrap()
            .filter_map(Result::ok)
            .filter(|e| e.file_name().to_string_lossy().ends_with(".jsonl"))
            .collect();
        assert!(
            !entries.is_empty() && entries.len() <= 3,
            "轮转日志文件数应处于 1..=3 之间，实际为 {}",
            entries.len()
        );

        let mut parsed_count = 0;
        for entry in entries {
            let content = fs::read_to_string(entry.path()).unwrap();
            for line in content.lines() {
                if !line.trim().is_empty() {
                    let parsed: LogEntry = serde_json::from_str(line).expect("JSONL 行解析失败");
                    assert_eq!(parsed.category, LogCategory::System);
                    parsed_count += 1;
                }
            }
        }
        assert!(parsed_count > 0);
        let _ = fs::remove_dir_all(&tmp_dir);
    }

    #[test]
    fn test_clear_and_export() {
        let logger = LogManager::in_memory(20);
        logger.warn(LogCategory::Safety, "estop", "E-STOP active");
        logger.info(LogCategory::Compiler, "compiler", "IR compiled");

        let txt = logger.export_text(&LogQuery::default());
        assert!(txt.contains("E-STOP active"));
        assert!(txt.contains("[COMPILER]"));

        let new_id = logger.clear("web_ui");
        assert_eq!(new_id, 3);
        let (remaining, _) = logger.query(&LogQuery::default());
        assert_eq!(remaining.len(), 1);
        assert!(remaining[0].message.contains("已清空"));
    }
}
