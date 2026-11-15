export type OpMode = 'MANUAL' | 'AUTO';

export type InterpreterState =
  | 'IDLE'
  | 'READY'
  | 'RUNNING'
  | 'PAUSED'
  | 'COMPLETED'
  | 'ERROR';

export type MotionState = 'IDLE' | 'MOVEL' | 'MOVEJ' | 'JOG';

export type CoordSystem = 'CARTESIAN' | 'JOINT';

export interface Pose6D {
  x: number;
  y: number;
  z: number;
  a: number;
  b: number;
  c: number;
}

export interface JogCommand {
  coord_system: CoordSystem;
  axis: string;
  direction: number;
  step_size: number;
}

export interface RobotStateSnapshot {
  op_mode: OpMode;
  drives_on: boolean;
  emergency_stop: boolean;
  speed_override: number;
  interpreter_state: InterpreterState;
  motion_state: MotionState;
  active_program: string;
  current_line: number;
  joint_actual: [number, number, number, number, number, number];
  joint_torque: [number, number, number, number, number, number];
  cart_actual: Pose6D;
  digital_out: [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean];
  plant_online: boolean;
  rtt_ms: number;
  cycle_count: number;
  sim_tick: number;
  status_message: string;
}

export interface ProgramDetailResp {
  ok: boolean;
  name: string;
  code: string;
}

export type DiagnosticSeverity = 'INFO' | 'WARNING' | 'ERROR';
export type CompileStage = 'SYNTAX' | 'SEMANTIC' | 'LOWERING' | 'CODEGEN';

export interface CompileDiagnostic {
  severity: DiagnosticSeverity;
  stage: CompileStage;
  line: number;
  column: number;
  message: string;
}

export interface IrStats {
  total_instructions: number;
  motion_count: number;
  io_count: number;
  wait_count: number;
  static_ik_checked: number;
  symbol_count: number;
}

export interface IrInstruction {
  seq: number;
  line: number;
  op: Record<string, unknown>;
  summary: string;
}

export interface RobotProgramIR {
  program_name: string;
  source_hash: string;
  instructions: IrInstruction[];
  stats: IrStats;
}

export interface CompileReport {
  ok: boolean;
  program_name: string;
  source_hash: string;
  diagnostics: CompileDiagnostic[];
  ir?: RobotProgramIR | null;
}

export interface PutProgramOkResp {
  ok: boolean;
  report: CompileReport;
}

export interface PutProgramErrorResp {
  ok: boolean;
  line: number;
  message: string;
  diagnostics?: CompileDiagnostic[];
  ir?: RobotProgramIR | null;
}

export type LogLevel = 'INFO' | 'WARN' | 'ERROR';
export type LogCategory =
  | 'SYSTEM'
  | 'SAFETY'
  | 'MOTION'
  | 'FIELDBUS'
  | 'COMPILER'
  | 'SCRIPT';

export interface LogEntry {
  id: number;
  timestamp_ms: number;
  timestamp_iso: string;
  level: LogLevel;
  category: LogCategory;
  source: string;
  message: string;
}

export interface LogsListResp {
  ok: boolean;
  latest_id: number;
  total: number;
  entries: LogEntry[];
}

export interface SimpleResp {
  ok: boolean;
  error?: string;
}

export interface PowerResp {
  ok: boolean;
  drives_on?: boolean;
  error?: string;
}

export interface EstopResp {
  ok: boolean;
  emergency_stop: boolean;
}

export interface OverrideResp {
  ok: boolean;
  speed_override: number;
}

export interface ModeResp {
  ok: boolean;
  mode: OpMode;
}

export interface DoutResp {
  ok: boolean;
  digital_out?: [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean];
  error?: string;
}
