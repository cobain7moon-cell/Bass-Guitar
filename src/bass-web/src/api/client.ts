import { createClient } from '@connectrpc/connect';
import { createGrpcWebTransport } from '@connectrpc/connect-web';
import {
  CompileStage as PbCompileStage,
  ControllerService,
  CoordSystem as PbCoordSystem,
  DiagnosticSeverity as PbDiagnosticSeverity,
  InterpreterState as PbInterpreterState,
  LogCategory as PbLogCategory,
  LogExportFormat as PbLogExportFormat,
  LogLevel as PbLogLevel,
  LogService,
  MotionState as PbMotionState,
  OpMode as PbOpMode,
  TaskControlCommand as PbTaskControlCommand,
  TaskService,
  type CompileReport as PbCompileReport,
  type LogEntry as PbLogEntry,
  type RobotStateSnapshot as PbRobotStateSnapshot,
} from '../gen/bass_controller_pb';
import type {
  CompileDiagnostic,
  CompileReport,
  CompileStage,
  DiagnosticSeverity,
  DoutResp,
  EstopResp,
  InterpreterState,
  IrInstruction,
  JogCommand,
  LogCategory,
  LogEntry,
  LogLevel,
  LogsListResp,
  ModeResp,
  MotionState,
  OpMode,
  OverrideResp,
  PowerResp,
  ProgramDetailResp,
  RobotProgramIR,
  RobotStateSnapshot,
  SimpleResp,
} from '../types';

const baseUrl =
  typeof window !== 'undefined' && window.location?.origin
    ? window.location.origin
    : '/';

const transport = createGrpcWebTransport({
  baseUrl,
  useBinaryFormat: true,
});

const controllerClient = createClient(ControllerService, transport);
const taskClient = createClient(TaskService, transport);
const logClient = createClient(LogService, transport);

function mapOpMode(mode: PbOpMode): OpMode {
  return mode === PbOpMode.AUTO ? 'AUTO' : 'MANUAL';
}

function toPbOpMode(mode: OpMode): PbOpMode {
  return mode === 'AUTO' ? PbOpMode.AUTO : PbOpMode.MANUAL;
}

function mapInterpreterState(s: PbInterpreterState): InterpreterState {
  switch (s) {
    case PbInterpreterState.READY:
      return 'READY';
    case PbInterpreterState.RUNNING:
      return 'RUNNING';
    case PbInterpreterState.PAUSED:
      return 'PAUSED';
    case PbInterpreterState.COMPLETED:
      return 'COMPLETED';
    case PbInterpreterState.ERROR:
      return 'ERROR';
    default:
      return 'IDLE';
  }
}

function mapMotionState(s: PbMotionState): MotionState {
  switch (s) {
    case PbMotionState.MOVEL:
      return 'MOVEL';
    case PbMotionState.MOVEJ:
      return 'MOVEJ';
    case PbMotionState.JOG:
      return 'JOG';
    default:
      return 'IDLE';
  }
}

function toFixed6(arr: number[]): [number, number, number, number, number, number] {
  return [
    arr[0] ?? 0,
    arr[1] ?? 0,
    arr[2] ?? 0,
    arr[3] ?? 0,
    arr[4] ?? 0,
    arr[5] ?? 0,
  ];
}

function toFixed8Bool(
  arr: boolean[],
): [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean] {
  return [
    Boolean(arr[0]),
    Boolean(arr[1]),
    Boolean(arr[2]),
    Boolean(arr[3]),
    Boolean(arr[4]),
    Boolean(arr[5]),
    Boolean(arr[6]),
    Boolean(arr[7]),
  ];
}

function mapSnapshot(pb: PbRobotStateSnapshot): RobotStateSnapshot {
  const pose = pb.cartActual;
  return {
    op_mode: mapOpMode(pb.opMode),
    drives_on: pb.drivesOn,
    emergency_stop: pb.emergencyStop,
    speed_override: pb.speedOverride,
    interpreter_state: mapInterpreterState(pb.interpreterState),
    motion_state: mapMotionState(pb.motionState),
    active_program: pb.activeProgram,
    current_line: pb.currentLine,
    joint_actual: toFixed6(pb.jointActual),
    joint_torque: toFixed6(pb.jointTorque),
    cart_actual: {
      x: pose?.x ?? 0,
      y: pose?.y ?? 0,
      z: pose?.z ?? 0,
      a: pose?.a ?? 0,
      b: pose?.b ?? 0,
      c: pose?.c ?? 0,
    },
    digital_out: toFixed8Bool(pb.digitalOut),
    plant_online: pb.plantOnline,
    rtt_ms: pb.rttMs,
    cycle_count: Number(pb.cycleCount),
    sim_tick: Number(pb.simTick),
    status_message: pb.statusMessage,
  };
}

function mapSeverity(s: PbDiagnosticSeverity): DiagnosticSeverity {
  switch (s) {
    case PbDiagnosticSeverity.INFO:
      return 'INFO';
    case PbDiagnosticSeverity.WARNING:
      return 'WARNING';
    default:
      return 'ERROR';
  }
}

function mapStage(s: PbCompileStage): CompileStage {
  switch (s) {
    case PbCompileStage.SEMANTIC:
      return 'SEMANTIC';
    case PbCompileStage.LOWERING:
      return 'LOWERING';
    case PbCompileStage.CODEGEN:
      return 'CODEGEN';
    default:
      return 'SYNTAX';
  }
}

function mapCompileReport(pb: PbCompileReport): CompileReport {
  const diagnostics: CompileDiagnostic[] = pb.diagnostics.map((d) => ({
    severity: mapSeverity(d.severity),
    stage: mapStage(d.stage),
    line: d.line,
    column: d.column,
    message: d.message,
  }));

  let ir: RobotProgramIR | null = null;
  if (pb.ir) {
    const instructions: IrInstruction[] = pb.ir.instructions.map((inst) => {
      let parsedOp: Record<string, unknown> = {};
      if (inst.opJson) {
        try {
          parsedOp = JSON.parse(inst.opJson) as Record<string, unknown>;
        } catch {
          parsedOp = {};
        }
      }
      return {
        seq: inst.seq,
        line: inst.line,
        op: parsedOp,
        summary: inst.summary,
      };
    });
    const stats = pb.ir.stats;
    ir = {
      program_name: pb.ir.programName,
      source_hash: pb.ir.sourceHash,
      instructions,
      stats: {
        total_instructions: stats?.totalInstructions ?? 0,
        motion_count: stats?.motionCount ?? 0,
        io_count: stats?.ioCount ?? 0,
        wait_count: stats?.waitCount ?? 0,
        static_ik_checked: stats?.staticIkChecked ?? 0,
        symbol_count: stats?.symbolCount ?? 0,
      },
    };
  }

  return {
    ok: pb.ok,
    program_name: pb.programName,
    source_hash: pb.sourceHash,
    diagnostics,
    ir,
  };
}

function toPbLogLevel(level?: string): PbLogLevel {
  switch ((level || '').toUpperCase()) {
    case 'INFO':
      return PbLogLevel.INFO;
    case 'WARN':
      return PbLogLevel.WARN;
    case 'ERROR':
      return PbLogLevel.ERROR;
    default:
      return PbLogLevel.UNSPECIFIED;
  }
}

function mapLogLevel(level: PbLogLevel): LogLevel {
  switch (level) {
    case PbLogLevel.WARN:
      return 'WARN';
    case PbLogLevel.ERROR:
      return 'ERROR';
    default:
      return 'INFO';
  }
}

function toPbLogCategory(category?: string): PbLogCategory {
  switch ((category || '').toUpperCase()) {
    case 'SYSTEM':
      return PbLogCategory.SYSTEM;
    case 'SAFETY':
      return PbLogCategory.SAFETY;
    case 'MOTION':
      return PbLogCategory.MOTION;
    case 'FIELDBUS':
      return PbLogCategory.FIELDBUS;
    case 'COMPILER':
      return PbLogCategory.COMPILER;
    case 'SCRIPT':
      return PbLogCategory.SCRIPT;
    default:
      return PbLogCategory.UNSPECIFIED;
  }
}

function mapLogCategory(cat: PbLogCategory): LogCategory {
  switch (cat) {
    case PbLogCategory.SAFETY:
      return 'SAFETY';
    case PbLogCategory.MOTION:
      return 'MOTION';
    case PbLogCategory.FIELDBUS:
      return 'FIELDBUS';
    case PbLogCategory.COMPILER:
      return 'COMPILER';
    case PbLogCategory.SCRIPT:
      return 'SCRIPT';
    default:
      return 'SYSTEM';
  }
}

function mapLogEntry(pb: PbLogEntry): LogEntry {
  return {
    id: Number(pb.id),
    timestamp_ms: Number(pb.timestampMs),
    timestamp_iso: pb.timestampIso,
    level: mapLogLevel(pb.level),
    category: mapLogCategory(pb.category),
    source: pb.source,
    message: pb.message,
  };
}

function toPbJog(cmd: JogCommand) {
  return {
    coordSystem:
      cmd.coord_system === 'JOINT' ? PbCoordSystem.JOINT : PbCoordSystem.CARTESIAN,
    axis: cmd.axis,
    direction: cmd.direction,
    stepSize: cmd.step_size,
  };
}

function toPbTaskCommand(command: 'RUN' | 'STEP' | 'PAUSE' | 'RESET'): PbTaskControlCommand {
  switch (command) {
    case 'RUN':
      return PbTaskControlCommand.RUN;
    case 'STEP':
      return PbTaskControlCommand.STEP;
    case 'PAUSE':
      return PbTaskControlCommand.PAUSE;
    case 'RESET':
      return PbTaskControlCommand.RESET;
  }
}

export const api = {
  async fetchState(): Promise<RobotStateSnapshot> {
    const resp = await controllerClient.getState({});
    return mapSnapshot(resp);
  },

  async setMode(mode: OpMode): Promise<ModeResp> {
    const resp = await controllerClient.setMode({ mode: toPbOpMode(mode) });
    return { ok: resp.ok, mode: mapOpMode(resp.mode) };
  },

  async setPower(drives_on: boolean): Promise<PowerResp> {
    const resp = await controllerClient.setDrivesPower({ drivesOn: drives_on });
    return {
      ok: resp.ok,
      drives_on: resp.drivesOn,
      error: resp.error || undefined,
    };
  },

  async setEstop(emergency_stop: boolean): Promise<EstopResp> {
    const resp = await controllerClient.setEmergencyStop({
      emergencyStop: emergency_stop,
    });
    return {
      ok: resp.ok,
      emergency_stop: resp.emergencyStop,
    };
  },

  async setOverride(speed_override: number): Promise<OverrideResp> {
    const resp = await controllerClient.setSpeedOverride({
      speedOverride: speed_override,
    });
    return {
      ok: resp.ok,
      speed_override: resp.speedOverride,
    };
  },

  async setDout(pin: number, state: boolean): Promise<DoutResp> {
    const resp = await controllerClient.setDigitalOut({ pin, state });
    return {
      ok: resp.ok,
      digital_out: resp.ok ? toFixed8Bool(resp.digitalOut) : undefined,
      error: resp.error || undefined,
    };
  },

  async fetchPrograms(): Promise<string[]> {
    const resp = await taskClient.listPrograms({});
    return resp.programs;
  },

  async fetchProgram(name: string): Promise<ProgramDetailResp> {
    const resp = await taskClient.getProgram({ name });
    if (!resp.ok) {
      throw new Error(resp.error || `读取程序 ${name} 失败`);
    }
    return {
      ok: resp.ok,
      name: resp.name,
      code: resp.code,
    };
  },

  async saveProgram(
    name: string,
    code: string,
  ): Promise<{
    ok: boolean;
    line?: number;
    message?: string;
    diagnostics?: CompileDiagnostic[];
    report?: CompileReport;
  }> {
    const resp = await taskClient.saveProgram({ name, code });
    const report = resp.report ? mapCompileReport(resp.report) : undefined;
    if (resp.ok) {
      return { ok: true, report };
    }
    return {
      ok: false,
      line: resp.errorLine || 1,
      message: resp.errorMessage || '编译保存失败',
      diagnostics: report?.diagnostics ?? [],
      report,
    };
  },

  async compileProgram(name: string, code?: string): Promise<CompileReport> {
    const resp = await taskClient.compileProgram(
      code !== undefined ? { name, code } : { name },
    );
    return mapCompileReport(resp);
  },

  async programControl(
    command: 'RUN' | 'STEP' | 'PAUSE' | 'RESET',
    program?: string,
  ): Promise<SimpleResp> {
    const resp = await taskClient.controlTask({
      command: toPbTaskCommand(command),
      programName: program ?? '',
    });
    return {
      ok: resp.ok,
      error: resp.error || undefined,
    };
  },

  async jogStep(cmd: JogCommand): Promise<SimpleResp> {
    const resp = await controllerClient.jogStep(toPbJog(cmd));
    return { ok: resp.ok, error: resp.error || undefined };
  },

  async jogHold(cmd: JogCommand): Promise<SimpleResp> {
    const resp = await controllerClient.jogHold(toPbJog(cmd));
    return { ok: resp.ok, error: resp.error || undefined };
  },

  async jogStop(): Promise<SimpleResp> {
    const resp = await controllerClient.jogStop({});
    return { ok: resp.ok, error: resp.error || undefined };
  },

  async fetchLogs(params?: {
    level?: string;
    category?: string;
    q?: string;
    after_id?: number;
    limit?: number;
  }): Promise<LogsListResp> {
    const resp = await logClient.queryLogs({
      level: toPbLogLevel(params?.level),
      category: toPbLogCategory(params?.category),
      q: params?.q?.trim() ?? '',
      afterId: params?.after_id !== undefined ? BigInt(params.after_id) : undefined,
      limit: params?.limit,
    });
    return {
      ok: resp.ok,
      latest_id: Number(resp.latestId),
      total: resp.total,
      entries: resp.entries.map(mapLogEntry),
    };
  },

  async exportLogs(params?: {
    level?: string;
    category?: string;
    q?: string;
    format?: 'jsonl' | 'text';
  }): Promise<{
    ok: boolean;
    filename: string;
    contentType: string;
    content: string;
    error?: string;
  }> {
    const resp = await logClient.exportLogs({
      level: toPbLogLevel(params?.level),
      category: toPbLogCategory(params?.category),
      q: params?.q?.trim() ?? '',
      format:
        params?.format === 'text' ? PbLogExportFormat.TEXT : PbLogExportFormat.JSONL,
    });
    return {
      ok: resp.ok,
      filename: resp.filename,
      contentType: resp.contentType,
      content: resp.content,
      error: resp.error || undefined,
    };
  },

  async clearLogs(): Promise<SimpleResp> {
    const resp = await logClient.clearLogs({});
    return { ok: resp.ok, error: resp.error || undefined };
  },
};

/// 基于 gRPC-Web Server Streaming 的 25Hz 状态遥测订阅客户端
export class TelemetryClient {
  private abortCtrl: AbortController | null = null;
  private shouldReconnect = true;
  private reconnectTimer: number | null = null;
  private onSnapshotCb?: (snap: RobotStateSnapshot) => void;
  private onStatusCb?: (connected: boolean) => void;

  constructor(
    onSnapshot: (snap: RobotStateSnapshot) => void,
    onStatusChange?: (connected: boolean) => void,
  ) {
    this.onSnapshotCb = onSnapshot;
    this.onStatusCb = onStatusChange;
  }

  public connect(): void {
    this.shouldReconnect = true;
    void this.startStream();
  }

  private async startStream(): Promise<void> {
    if (this.abortCtrl) {
      this.abortCtrl.abort();
      this.abortCtrl = null;
    }

    const ctrl = new AbortController();
    this.abortCtrl = ctrl;
    let opened = false;

    try {
      const stream = controllerClient.subscribeTelemetry(
        { intervalMs: 40 },
        { signal: ctrl.signal },
      );
      for await (const msg of stream) {
        if (ctrl.signal.aborted) break;
        if (!opened) {
          opened = true;
          this.onStatusCb?.(true);
        }
        this.onSnapshotCb?.(mapSnapshot(msg));
      }
    } catch {
      // 网络波动或主动取消时走统一重连逻辑
    } finally {
      if (this.abortCtrl === ctrl) {
        this.abortCtrl = null;
      }
      this.onStatusCb?.(false);
      if (this.shouldReconnect && !ctrl.signal.aborted) {
        this.scheduleReconnect();
      }
    }
  }

  private scheduleReconnect(): void {
    if (!this.shouldReconnect || this.reconnectTimer !== null) return;
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null;
      if (this.shouldReconnect) {
        void this.startStream();
      }
    }, 1500);
  }

  public disconnect(): void {
    this.shouldReconnect = false;
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.abortCtrl) {
      this.abortCtrl.abort();
      this.abortCtrl = null;
    }
    this.onStatusCb?.(false);
  }
}
