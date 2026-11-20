<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import type { CompileDiagnostic, CompileReport, RobotStateSnapshot } from '../types';
import { api } from '../api/client';

const props = defineProps<{
  snapshot: RobotStateSnapshot;
}>();

const loadedProgram = ref<string>('');
const programs = ref<string[]>([]);
const selectedProgram = ref<string>('');
const code = ref<string>('');
const savedCode = ref<string>('');
const loading = ref<boolean>(false);
const saving = ref<boolean>(false);
const compiling = ref<boolean>(false);
const banner = ref<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
const errorLine = ref<number | null>(null);
const diagnostics = ref<CompileDiagnostic[]>([]);
const compileReport = ref<CompileReport | null>(null);
const showCompilePanel = ref<boolean>(false);
const compileTab = ref<'diag' | 'ir'>('diag');

// 新建程序控制
const showNewDialog = ref(false);
const newProgramName = ref('');

// 编辑器 DOM 引用
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const gutterRef = ref<HTMLDivElement | null>(null);
const backdropRef = ref<HTMLDivElement | null>(null);

const lineCount = computed(() => {
  return code.value.split('\n').length;
});

const isDirty = computed(() => code.value !== savedCode.value);

const interpreterState = computed(() => props.snapshot.interpreter_state);

const currentRunningLine = computed(() => {
  if (
    props.snapshot.active_program === selectedProgram.value &&
    props.snapshot.interpreter_state !== 'IDLE' &&
    props.snapshot.current_line > 0
  ) {
    return props.snapshot.current_line;
  }
  return null;
});

function lineHighlightClass(lineNum: number) {
  const isActive = currentRunningLine.value === lineNum;
  const st = interpreterState.value;
  return {
    'is-running': isActive && st === 'RUNNING',
    'is-paused': isActive && st === 'PAUSED',
    'is-completed': isActive && st === 'COMPLETED',
    'is-error': errorLine.value === lineNum || (isActive && st === 'ERROR'),
  };
}

async function loadPrograms(preferName?: string) {
  try {
    const list = await api.fetchPrograms();
    programs.value = list;
    if (list.length > 0) {
      if (preferName && list.includes(preferName)) {
        selectedProgram.value = preferName;
      } else if (!selectedProgram.value || !list.includes(selectedProgram.value)) {
        selectedProgram.value = list.includes('MoveSquare.rhai') ? 'MoveSquare.rhai' : list[0];
      }
      await loadProgramContent(selectedProgram.value);
    } else {
      selectedProgram.value = '';
      code.value = '';
    }
  } catch (err: any) {
    banner.value = { type: 'error', text: `加载程序列表失败: ${err.message}` };
  }
}

async function loadProgramContent(name: string) {
  if (!name) return;
  loading.value = true;
  banner.value = null;
  errorLine.value = null;
  diagnostics.value = [];
  compileReport.value = null;
  try {
    const detail = await api.fetchProgram(name);
    code.value = detail.code;
    savedCode.value = detail.code;
    loadedProgram.value = name;
  } catch (err: any) {
    banner.value = { type: 'error', text: `读取程序失败: ${err.message}` };
  } finally {
    loading.value = false;
  }
}

async function onSelectChange() {
  if (
    isDirty.value &&
    loadedProgram.value &&
    loadedProgram.value !== selectedProgram.value
  ) {
    const discard = window.confirm(
      `当前程序 ${loadedProgram.value} 有未保存的修改，是否放弃修改并切换到 ${selectedProgram.value}？`,
    );
    if (!discard) {
      selectedProgram.value = loadedProgram.value;
      return;
    }
  }
  await loadProgramContent(selectedProgram.value);
}

function openNewDialog() {
  newProgramName.value = '';
  showNewDialog.value = true;
}

function cancelNewDialog() {
  showNewDialog.value = false;
}

async function confirmCreateProgram() {
  let name = newProgramName.value.trim();
  if (!name) return;
  if (!name.endsWith('.rhai')) {
    name += '.rhai';
  }
  showNewDialog.value = false;

  const template = `// Bass 1.1 (UR5e) 工业机器人程序: ${name}
Log("程序启动: ${name}");
MoveJ(HOME, #{ vel: 50 });
Wait(0.5);

// 示教点位示例 (UR5e 笛卡尔空间)
let p1 = Pose(-134.00, 492.00, 380.00, 0.00, 0.00, 180.00);
MoveL(p1, #{ vel: 100 });
Wait(0.2);
MoveJ(HOME, #{ vel: 50 });

Log("程序执行完毕");
`;

  try {
    const res = await api.saveProgram(name, template);
    if (res.ok) {
      await loadPrograms(name);
      banner.value = { type: 'success', text: `成功创建程序 ${name}` };
    } else {
      banner.value = { type: 'error', text: res.message || '新建程序失败' };
    }
  } catch (err: any) {
    banner.value = { type: 'error', text: `新建程序失败: ${err.message}` };
  }
}

async function compileOnly() {
  if (!selectedProgram.value) return;
  compiling.value = true;
  banner.value = null;
  errorLine.value = null;
  try {
    const report = await api.compileProgram(selectedProgram.value, code.value);
    compileReport.value = report;
    diagnostics.value = report.diagnostics ?? [];
    if (report.ok) {
      const stats = report.ir?.stats;
      const summary = stats
        ? `IR ${stats.total_instructions} 条指令 · 运动 ${stats.motion_count} · 静态IK ${stats.static_ik_checked}`
        : '编译通过';
      banner.value = { type: 'success', text: `⚙ 编译检查通过 (${summary})` };
      showCompilePanel.value = true;
      compileTab.value = report.diagnostics.length > 0 ? 'diag' : 'ir';
    } else {
      const firstErr =
        report.diagnostics.find((d) => d.severity === 'ERROR') ?? report.diagnostics[0];
      errorLine.value = firstErr?.line || null;
      banner.value = {
        type: 'error',
        text: `❌ 第 ${firstErr?.line || '?'} 行 [${firstErr?.stage || 'COMPILER'}]: ${
          firstErr?.message || '编译失败'
        }`,
      };
      showCompilePanel.value = true;
      compileTab.value = 'diag';
    }
  } catch (err: any) {
    banner.value = { type: 'error', text: `编译检查请求失败: ${err.message}` };
  } finally {
    compiling.value = false;
  }
}

async function saveAndValidate(): Promise<boolean> {
  if (!selectedProgram.value) return false;
  saving.value = true;
  banner.value = null;
  errorLine.value = null;

  try {
    const res = await api.saveProgram(selectedProgram.value, code.value);
    if (res.ok) {
      savedCode.value = code.value;
      compileReport.value = res.report ?? null;
      diagnostics.value = res.report?.diagnostics ?? [];
      const irCount = res.report?.ir?.stats.total_instructions ?? 0;
      banner.value = {
        type: 'success',
        text: `✅ 编译校验通过并已保存 (生成 IR ${irCount} 条指令)`,
      };
      errorLine.value = null;
      if (diagnostics.value.length > 0) {
        showCompilePanel.value = true;
        compileTab.value = 'diag';
      }
      return true;
    } else {
      errorLine.value = res.line ?? null;
      diagnostics.value = res.diagnostics ?? [];
      if (res.diagnostics && res.diagnostics.length > 0) {
        showCompilePanel.value = true;
        compileTab.value = 'diag';
      }
      banner.value = {
        type: 'error',
        text: `❌ 第 ${res.line || '?'} 行编译错误: ${res.message || '未知错误'}`,
      };
      return false;
    }
  } catch (err: any) {
    banner.value = { type: 'error', text: `保存请求失败: ${err.message}` };
    return false;
  } finally {
    saving.value = false;
  }
}

function jumpToLine(line: number) {
  const ta = textareaRef.value;
  if (!ta || line <= 0) return;
  const lines = code.value.split('\n');
  let offset = 0;
  for (let i = 0; i < Math.min(line - 1, lines.length); i++) {
    offset += lines[i].length + 1;
  }
  ta.focus();
  ta.setSelectionRange(offset, offset);
  ta.scrollTop = Math.max(0, (line - 4) * 22);
  syncScroll();
}

function handleTeachPoint() {
  const ta = textareaRef.value;
  if (!ta) return;

  const p = props.snapshot.cart_actual;
  const newPose = `Pose(${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)}, ${p.a.toFixed(2)}, ${p.b.toFixed(2)}, ${p.c.toFixed(2)})`;

  const selStart = ta.selectionStart;
  const textBefore = code.value.substring(0, selStart);
  const lines = code.value.split('\n');
  const lineIdx = textBefore.split('\n').length - 1;
  const currentLineText = lines[lineIdx] ?? '';

  const poseRegex = /Pose\s*\([^\)]*\)/;

  if (poseRegex.test(currentLineText)) {
    // 替换当前行的 Pose(...)
    lines[lineIdx] = currentLineText.replace(poseRegex, newPose);
    banner.value = {
      type: 'info',
      text: `🎯 已更新第 ${lineIdx + 1} 行点位为当前 TCP: ${newPose}`,
    };
  } else {
    // 插入 let p_teach = Pose(...);
    const indent = currentLineText.match(/^\s*/)?.[0] || '';
    if (currentLineText.trim() === '') {
      lines[lineIdx] = `${indent}let p_teach = ${newPose};`;
    } else {
      lines.splice(lineIdx, 0, `${indent}let p_teach = ${newPose};`);
    }
    banner.value = {
      type: 'info',
      text: `🎯 已在第 ${lineIdx + 1} 行示教插入当前 TCP: ${newPose}`,
    };
  }

  code.value = lines.join('\n');
  nextTick(() => {
    ta.focus();
  });
}

function syncScroll() {
  const ta = textareaRef.value;
  if (!ta) return;
  if (gutterRef.value) {
    gutterRef.value.scrollTop = ta.scrollTop;
  }
  if (backdropRef.value) {
    backdropRef.value.scrollTop = ta.scrollTop;
  }
}

function scrollLineIntoView(line: number) {
  const ta = textareaRef.value;
  if (!ta || line <= 0) return;
  const lineHeight = 22;
  const topPadding = 10;
  const lineTop = topPadding + (line - 1) * lineHeight;
  const lineBottom = lineTop + lineHeight;
  const viewTop = ta.scrollTop;
  const viewBottom = viewTop + ta.clientHeight;
  if (lineTop < viewTop + lineHeight) {
    ta.scrollTop = Math.max(0, lineTop - lineHeight * 3);
    syncScroll();
  } else if (lineBottom > viewBottom - lineHeight) {
    ta.scrollTop = Math.max(0, lineBottom - ta.clientHeight + lineHeight * 3);
    syncScroll();
  }
}

// 底部控制按钮
async function handleControl(cmd: 'RUN' | 'STEP' | 'PAUSE' | 'RESET') {
  banner.value = null;
  if ((cmd === 'RUN' || cmd === 'STEP') && isDirty.value && selectedProgram.value) {
    const savedOk = await saveAndValidate();
    if (!savedOk) return;
  }
  try {
    const res = await api.programControl(cmd, selectedProgram.value);
    if (!res.ok) {
      banner.value = { type: 'error', text: `控制指令 [${cmd}] 失败: ${res.error}` };
    }
  } catch (err: any) {
    banner.value = { type: 'error', text: `控制请求异常: ${err.message}` };
  }
}

onMounted(() => {
  loadPrograms();
});

watch(
  () => props.snapshot.active_program,
  (newProg) => {
    if (!newProg || newProg === selectedProgram.value || !programs.value.includes(newProg)) {
      return;
    }
    if (isDirty.value) {
      banner.value = {
        type: 'info',
        text: `提示：控制器当前活动程序为 ${newProg}；因编辑器有未保存修改，已保留当前编辑内容。`,
      };
      return;
    }
    selectedProgram.value = newProg;
    loadProgramContent(newProg);
  },
);

watch(currentRunningLine, (line) => {
  if (line !== null) {
    nextTick(() => scrollLineIntoView(line));
  }
});
</script>

<template>
  <div class="program-editor-panel">
    <!-- 顶部工具栏：程序选择、新建、编译检查、保存校验、示教记录 -->
    <div class="editor-header">
      <div class="file-select-group">
        <label class="section-label">程序</label>
        <select
          v-model="selectedProgram"
          class="program-select"
          :disabled="loading || saving || compiling"
          @change="onSelectChange"
        >
          <option v-for="item in programs" :key="item" :value="item">
            {{ item }}
          </option>
        </select>
        <button type="button" class="action-btn new-btn" @click="openNewDialog">
          + 新建
        </button>
      </div>

      <div class="actions-group">
        <button
          type="button"
          class="action-btn teach-btn"
          title="将当前机械臂末端 TCP 位姿写入或替换到光标所在行"
          @click="handleTeachPoint"
        >
          <span class="btn-icon">📍</span> 示教记录
        </button>
        <button
          type="button"
          class="action-btn compile-btn"
          :disabled="compiling || loading || !selectedProgram"
          title="运行 4 阶段编译器校验语法/语义/可达性并预览 IR"
          @click="compileOnly"
        >
          <span class="btn-icon">⚙</span> {{ compiling ? '编译中...' : '编译 / IR' }}
        </button>
        <button
          type="button"
          class="action-btn save-btn"
          :disabled="saving || loading || !selectedProgram"
          @click="saveAndValidate"
        >
          <span class="btn-icon">💾</span> {{ saving ? '校验中...' : '保存并编译校验' }}
        </button>
      </div>
    </div>

    <!-- 新建程序弹出框 -->
    <div v-if="showNewDialog" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-title">新建 Rhai 机器人程序</div>
        <input
          v-model="newProgramName"
          type="text"
          class="modal-input"
          placeholder="例如: Task1 或 MoveWeld.rhai"
          autofocus
          @keyup.enter="confirmCreateProgram"
          @keyup.esc="cancelNewDialog"
        />
        <div class="modal-actions">
          <button type="button" class="modal-btn cancel" @click="cancelNewDialog">取消</button>
          <button type="button" class="modal-btn confirm" @click="confirmCreateProgram">确定创建</button>
        </div>
      </div>
    </div>

    <!-- 状态反馈通知横幅 -->
    <div v-if="banner" class="banner" :class="banner.type">
      <span class="banner-text">{{ banner.text }}</span>
      <button type="button" class="banner-close" @click="banner = null">✕</button>
    </div>

    <!-- 等宽代码编辑区（左侧行号指示器 + 右侧背光高亮层 + 可编辑代码框） -->
    <div class="editor-body">
      <div ref="gutterRef" class="line-gutter">
        <div
          v-for="lineNum in lineCount"
          :key="lineNum"
          class="line-number"
          :class="lineHighlightClass(lineNum)"
        >
          <span
            v-if="currentRunningLine === lineNum"
            class="arrow-exec"
            :class="{ 'is-pulsing': interpreterState === 'RUNNING' }"
          >▶</span>
          <span v-else-if="errorLine === lineNum" class="arrow-err">⚠</span>
          <span class="num-text">{{ lineNum }}</span>
        </div>
      </div>

      <div class="code-stage">
        <div ref="backdropRef" class="code-backdrop" aria-hidden="true">
          <div
            v-for="lineNum in lineCount"
            :key="lineNum"
            class="backdrop-line"
            :class="lineHighlightClass(lineNum)"
          ></div>
        </div>

        <textarea
          ref="textareaRef"
          v-model="code"
          class="code-textarea"
          spellcheck="false"
          placeholder="// 在此编写或编辑 Rhai 机器人运动控制脚本..."
          @scroll="syncScroll"
        ></textarea>
      </div>
    </div>

    <!-- 可折叠编译诊断与 IR 视图抽屉 -->
    <div v-if="showCompilePanel && (compileReport || diagnostics.length > 0)" class="compile-drawer">
      <div class="drawer-header">
        <div class="drawer-tabs">
          <button
            type="button"
            class="drawer-tab"
            :class="{ active: compileTab === 'diag' }"
            @click="compileTab = 'diag'"
          >
            诊断信息 ({{ diagnostics.length }})
          </button>
          <button
            type="button"
            class="drawer-tab"
            :class="{ active: compileTab === 'ir' }"
            @click="compileTab = 'ir'"
          >
            IR 中间表示 ({{ compileReport?.ir?.stats.total_instructions ?? 0 }})
          </button>
        </div>
        <button type="button" class="drawer-close" @click="showCompilePanel = false">收起 ▾</button>
      </div>

      <div v-if="compileTab === 'diag'" class="drawer-body">
        <div v-if="diagnostics.length === 0" class="drawer-empty">
          ✅ 语法检查、语义检查与静态运动学预校验零告警通过
        </div>
        <button
          v-for="(diag, idx) in diagnostics"
          :key="idx"
          type="button"
          class="diag-item"
          :class="diag.severity.toLowerCase()"
          @click="jumpToLine(diag.line)"
        >
          <span class="diag-sev">{{ diag.severity }}</span>
          <span class="diag-stage">[{{ diag.stage }}]</span>
          <span class="diag-loc">L{{ diag.line }}:{{ diag.column }}</span>
          <span class="diag-msg">{{ diag.message }}</span>
        </button>
      </div>

      <div v-else class="drawer-body">
        <div v-if="!compileReport?.ir" class="drawer-empty">
          当前代码编译未通过，修复错误后可预览降级 IR 指令流
        </div>
        <template v-else>
          <div class="ir-stats-row">
            <span>总指令: {{ compileReport.ir.stats.total_instructions }}</span>
            <span>运动: {{ compileReport.ir.stats.motion_count }}</span>
            <span>IO: {{ compileReport.ir.stats.io_count }}</span>
            <span>延时: {{ compileReport.ir.stats.wait_count }}</span>
            <span>IK预检: {{ compileReport.ir.stats.static_ik_checked }}</span>
            <span>Hash: {{ compileReport.ir.source_hash.slice(0, 12) }}</span>
          </div>
          <div
            v-for="inst in compileReport.ir.instructions"
            :key="inst.seq"
            class="ir-row"
            @click="jumpToLine(inst.line)"
          >
            <span class="ir-seq">#{{ inst.seq }}</span>
            <span class="ir-line">L{{ inst.line }}</span>
            <span class="ir-summary">{{ inst.summary }}</span>
          </div>
        </template>
      </div>
    </div>

    <!-- 底部执行控制栏：RUN, STEP, PAUSE, RESET -->
    <div class="editor-footer">
      <div class="active-prog-hint">
        <span class="state-pill" :class="`state-${interpreterState.toLowerCase()}`">
          {{ interpreterState }}
        </span>
        <span class="hint-name">
          {{ selectedProgram || '未选择' }}<span v-if="isDirty" class="dirty-dot" title="未保存修改">*</span>
        </span>
        <span v-if="currentRunningLine" class="hint-line"> ▶ 第 {{ currentRunningLine }} 行</span>
      </div>

      <div class="control-btn-group">
        <button
          type="button"
          class="ctrl-btn run-btn"
          :disabled="!selectedProgram || snapshot.emergency_stop || !snapshot.drives_on || snapshot.op_mode !== 'AUTO'"
          :title="snapshot.op_mode !== 'AUTO' ? '连续 RUN 需先在顶栏切换为 AUTO 模式' : '运行当前选中的 Rhai 程序'"
          @click="handleControl('RUN')"
        >
          ▶ RUN
        </button>
        <button
          type="button"
          class="ctrl-btn step-btn"
          :disabled="!selectedProgram || snapshot.emergency_stop || !snapshot.drives_on"
          title="单步推进单条运动或逻辑指令"
          @click="handleControl('STEP')"
        >
          ⏭ STEP
        </button>
        <button
          type="button"
          class="ctrl-btn pause-btn"
          :disabled="snapshot.interpreter_state !== 'RUNNING'"
          title="暂停当前程序的执行"
          @click="handleControl('PAUSE')"
        >
          ⏸ PAUSE
        </button>
        <button
          type="button"
          class="ctrl-btn reset-btn"
          title="复位解释器状态回 IDLE"
          @click="handleControl('RESET')"
        >
          ⏹ RESET
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.program-editor-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #0b1120;
  border-right: 1px solid #1e293b;
  overflow: hidden;
  box-sizing: border-box;
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 12px;
  background-color: #131c31;
  border-bottom: 1px solid #1e293b;
}

.file-select-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-label {
  font-size: 0.76rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.05em;
}

.program-select {
  background: #0b1120;
  border: 1px solid #334155;
  color: #f1f5f9;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  outline: none;
  cursor: pointer;
  min-width: 140px;
}

.actions-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid transparent;
}

.new-btn {
  background: #1e293b;
  color: #94a3b8;
  border-color: #334155;
}

.new-btn:hover {
  background: #334155;
  color: #ffffff;
}

.teach-btn {
  background: #0f766e;
  border-color: #14b8a6;
  color: #f0fdfa;
}

.teach-btn:hover {
  background: #115e59;
}

.save-btn {
  background: #1d4ed8;
  border-color: #3b82f6;
  color: #ffffff;
}

.compile-btn {
  background: #334155;
  border-color: #475569;
  color: #e2e8f0;
}

.compile-btn:hover {
  background: #475569;
}

.compile-drawer {
  max-height: 170px;
  display: flex;
  flex-direction: column;
  background: #0f172a;
  border-top: 1px solid #334155;
  overflow: hidden;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 10px;
  background: #1e293b;
  border-bottom: 1px solid #334155;
}

.drawer-tabs {
  display: flex;
  gap: 6px;
}

.drawer-tab {
  background: transparent;
  border: 1px solid transparent;
  color: #94a3b8;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  cursor: pointer;
}

.drawer-tab.active {
  background: #0f172a;
  border-color: #38bdf8;
  color: #7dd3fc;
}

.drawer-close {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 0.72rem;
  cursor: pointer;
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 6px 10px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.73rem;
}

.drawer-empty {
  color: #94a3b8;
  padding: 6px 2px;
}

.diag-item {
  width: 100%;
  display: flex;
  align-items: baseline;
  gap: 8px;
  text-align: left;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid #1e293b;
  color: #e2e8f0;
  padding: 4px 8px;
  border-radius: 4px;
  margin-bottom: 4px;
  cursor: pointer;
}

.diag-item:hover {
  border-color: #38bdf8;
}

.diag-item.error .diag-sev {
  color: #f87171;
  font-weight: 800;
}

.diag-item.warning .diag-sev {
  color: #fbbf24;
  font-weight: 800;
}

.diag-item.info .diag-sev {
  color: #38bdf8;
  font-weight: 800;
}

.diag-stage {
  color: #a5b4fc;
}

.diag-loc {
  color: #64748b;
}

.diag-msg {
  flex: 1;
}

.ir-stats-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  color: #7dd3fc;
  padding-bottom: 6px;
  margin-bottom: 4px;
  border-bottom: 1px solid #1e293b;
}

.ir-row {
  display: flex;
  gap: 10px;
  padding: 2px 4px;
  border-radius: 3px;
  cursor: pointer;
}

.ir-row:hover {
  background: rgba(56, 189, 248, 0.1);
}

.ir-seq {
  color: #64748b;
  min-width: 28px;
}

.ir-line {
  color: #34d399;
  min-width: 32px;
}

.ir-summary {
  color: #e2e8f0;
}

.save-btn:hover {
  background: #1e40af;
}

.save-btn:disabled,
.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 0.85rem;
}

.banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  font-size: 0.78rem;
  font-weight: 600;
}

.banner.success {
  background: rgba(16, 185, 129, 0.2);
  border-bottom: 1px solid #10b981;
  color: #a7f3d0;
}

.banner.error {
  background: rgba(239, 68, 68, 0.25);
  border-bottom: 1px solid #ef4444;
  color: #fecaca;
}

.banner.info {
  background: rgba(56, 189, 248, 0.2);
  border-bottom: 1px solid #38bdf8;
  color: #bae6fd;
}

.banner-close {
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 0.85rem;
}

.editor-body {
  display: flex;
  flex: 1;
  position: relative;
  overflow: hidden;
  background-color: #0b1120;
}

.line-gutter {
  width: 56px;
  flex-shrink: 0;
  background-color: #0d1527;
  border-right: 1px solid #1e293b;
  overflow: hidden;
  user-select: none;
  padding: 10px 0 32px 0;
  box-sizing: border-box;
}

.line-number {
  height: 22px;
  line-height: 22px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
  font-family: 'Consolas', 'Menlo', 'Monaco', 'Courier New', monospace;
  font-size: 0.76rem;
  color: #475569;
  box-sizing: border-box;
  border-left: 3px solid transparent;
}

.line-number.is-running {
  background-color: rgba(16, 185, 129, 0.28);
  border-left-color: #10b981;
  color: #34d399;
  font-weight: 800;
}

.line-number.is-paused {
  background-color: rgba(245, 158, 11, 0.28);
  border-left-color: #f59e0b;
  color: #fbbf24;
  font-weight: 800;
}

.line-number.is-completed {
  background-color: rgba(14, 165, 233, 0.24);
  border-left-color: #38bdf8;
  color: #38bdf8;
  font-weight: 800;
}

.line-number.is-error {
  background-color: rgba(239, 68, 68, 0.3);
  border-left-color: #ef4444;
  color: #f87171;
  font-weight: 800;
}

.arrow-exec {
  font-size: 0.72rem;
  margin-right: 4px;
  color: #34d399;
}

.line-number.is-paused .arrow-exec {
  color: #fbbf24;
}

.line-number.is-completed .arrow-exec {
  color: #38bdf8;
}

.arrow-exec.is-pulsing {
  animation: pointerPulse 0.9s ease-in-out infinite;
}

@keyframes pointerPulse {
  0%, 100% {
    opacity: 1;
    transform: translateX(0);
  }
  50% {
    opacity: 0.55;
    transform: translateX(2px);
  }
}

.arrow-err {
  font-size: 0.7rem;
  margin-right: 3px;
  color: #f87171;
}

.num-text {
  min-width: 18px;
  text-align: right;
}

.code-stage {
  position: relative;
  flex: 1;
  overflow: hidden;
  background-color: #0b1120;
}

.code-backdrop {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  padding: 10px 0 32px 0;
  box-sizing: border-box;
  z-index: 0;
}

.backdrop-line {
  height: 22px;
  width: 100%;
  box-sizing: border-box;
  border-left: 2px solid transparent;
}

.backdrop-line.is-running {
  background: linear-gradient(90deg, rgba(16, 185, 129, 0.22) 0%, rgba(16, 185, 129, 0.06) 100%);
  border-left-color: rgba(16, 185, 129, 0.75);
}

.backdrop-line.is-paused {
  background: linear-gradient(90deg, rgba(245, 158, 11, 0.22) 0%, rgba(245, 158, 11, 0.06) 100%);
  border-left-color: rgba(245, 158, 11, 0.8);
}

.backdrop-line.is-completed {
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.16) 0%, rgba(56, 189, 248, 0.04) 100%);
  border-left-color: rgba(56, 189, 248, 0.7);
}

.backdrop-line.is-error {
  background: linear-gradient(90deg, rgba(239, 68, 68, 0.22) 0%, rgba(239, 68, 68, 0.06) 100%);
  border-left-color: rgba(239, 68, 68, 0.85);
}

.code-textarea {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  background-color: transparent;
  color: #f8fafc;
  caret-color: #38bdf8;
  font-family: 'Consolas', 'Menlo', 'Monaco', 'Courier New', monospace;
  font-size: 0.82rem;
  line-height: 22px;
  padding: 10px 12px;
  border: none;
  outline: none;
  resize: none;
  white-space: pre;
  overflow: auto;
  tab-size: 2;
  box-sizing: border-box;
}

.editor-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 52px;
  padding: 0 14px;
  background-color: #131c31;
  border-top: 1px solid #1e293b;
}

.active-prog-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.78rem;
}

.state-pill {
  padding: 2px 7px;
  border-radius: 4px;
  font-size: 0.68rem;
  font-weight: 800;
  font-family: monospace;
  letter-spacing: 0.04em;
  background: #1e293b;
  color: #94a3b8;
}

.state-pill.state-running {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.45);
}

.state-pill.state-paused {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.45);
}

.state-pill.state-completed {
  background: rgba(56, 189, 248, 0.2);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.45);
}

.state-pill.state-error {
  background: rgba(239, 68, 68, 0.22);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.45);
}

.dirty-dot {
  color: #fbbf24;
  margin-left: 2px;
}

.hint-label {
  color: #64748b;
  font-weight: 600;
}

.hint-name {
  color: #38bdf8;
  font-weight: 700;
  font-family: monospace;
}

.hint-line {
  color: #34d399;
  font-weight: 700;
  font-family: monospace;
}

.control-btn-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ctrl-btn {
  padding: 8px 16px;
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.15s ease;
}

.run-btn {
  background: #059669;
  border-color: #10b981;
  color: #ffffff;
}

.run-btn:hover {
  background: #047857;
}

.step-btn {
  background: #0284c7;
  border-color: #38bdf8;
  color: #ffffff;
}

.step-btn:hover {
  background: #0369a1;
}

.pause-btn {
  background: #d97706;
  border-color: #f59e0b;
  color: #ffffff;
}

.pause-btn:hover {
  background: #b45309;
}

.reset-btn {
  background: #475569;
  border-color: #64748b;
  color: #ffffff;
}

.reset-btn:hover {
  background: #334155;
}

.ctrl-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* 模态弹窗 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-card {
  width: 320px;
  background: #131c31;
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}

.modal-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 12px;
}

.modal-input {
  width: 100%;
  background: #0b1120;
  border: 1px solid #475569;
  color: #ffffff;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 0.85rem;
  outline: none;
  box-sizing: border-box;
  margin-bottom: 14px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.modal-btn {
  padding: 5px 12px;
  font-size: 0.78rem;
  font-weight: 700;
  border-radius: 4px;
  cursor: pointer;
}

.modal-btn.cancel {
  background: #1e293b;
  color: #94a3b8;
  border: 1px solid #334155;
}

.modal-btn.confirm {
  background: #2563eb;
  color: #ffffff;
  border: none;
}
</style>
