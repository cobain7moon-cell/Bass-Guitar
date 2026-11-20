<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import type { RobotStateSnapshot } from './types';
import { api, TelemetryClient } from './api/client';
import TopStatusBar from './components/TopStatusBar.vue';
import ProgramEditor from './components/ProgramEditor.vue';
import RobotViewport3D from './components/RobotViewport3D.vue';
import MonitorAndJog from './components/MonitorAndJog.vue';
import LogPanel from './components/LogPanel.vue';

const defaultSnapshot: RobotStateSnapshot = {
  op_mode: 'MANUAL',
  drives_on: false,
  emergency_stop: false,
  speed_override: 100,
  interpreter_state: 'IDLE',
  motion_state: 'IDLE',
  active_program: 'MoveSquare.rhai',
  current_line: 0,
  joint_actual: [-90, -90, 90, -90, -90, 0],
  joint_torque: [0, 0, 0, 0, 0, 0],
  cart_actual: { x: -134, y: 492, z: 423, a: 0, b: 0, c: 180 },
  digital_out: [false, false, false, false, false, false, false, false],
  plant_online: false,
  rtt_ms: 0,
  cycle_count: 0,
  sim_tick: 0,
  status_message: '系统启动中...',
};

const snapshot = ref<RobotStateSnapshot>(defaultSnapshot);
const streamConnected = ref<boolean>(false);
const rightTab = ref<'monitor' | 'logs'>('monitor');
const viewportExpanded = ref<boolean>(false);
const uiActionError = ref<string | null>(null);

let telemetryClient: TelemetryClient | null = null;
let pollFallbackTimer: number | null = null;
let errorClearTimer: number | null = null;

function handleSnapshot(newSnap: RobotStateSnapshot) {
  snapshot.value = newSnap;
}

function handleStatus(connected: boolean) {
  streamConnected.value = connected;
}

function onOverrideUpdate(val: number) {
  snapshot.value.speed_override = val;
}

function handleActionError(msg: string) {
  uiActionError.value = msg;
  if (errorClearTimer !== null) {
    clearTimeout(errorClearTimer);
  }
  errorClearTimer = window.setTimeout(() => {
    uiActionError.value = null;
  }, 5000);
}

onMounted(async () => {
  // 先拉取一次初始状态
  try {
    const initSnap = await api.fetchState();
    snapshot.value = initSnap;
  } catch {
    // 后续由 gRPC-Web 订阅补齐
  }

  // 启动高频 gRPC-Web Server Streaming 状态推流
  telemetryClient = new TelemetryClient(handleSnapshot, handleStatus);
  telemetryClient.connect();

  // 若流连接中断，低频轮询作为后备保护
  pollFallbackTimer = window.setInterval(async () => {
    if (!streamConnected.value) {
      try {
        const snap = await api.fetchState();
        snapshot.value = snap;
      } catch {
        // ignore
      }
    }
  }, 2000);
});

onBeforeUnmount(() => {
  if (telemetryClient) {
    telemetryClient.disconnect();
    telemetryClient = null;
  }
  if (pollFallbackTimer !== null) {
    clearInterval(pollFallbackTimer);
    pollFallbackTimer = null;
  }
  if (errorClearTimer !== null) {
    clearTimeout(errorClearTimer);
    errorClearTimer = null;
  }
});
</script>

<template>
  <div class="bass-app">
    <!-- 顶部工业状态与安全控制栏 -->
    <TopStatusBar
      :snapshot="snapshot"
      @update:override="onOverrideUpdate"
      @action-error="handleActionError"
    />

    <!-- 控制器系统消息与告警条 -->
    <div
      class="system-message-bar"
      :class="{
        'is-error':
          Boolean(uiActionError) ||
          snapshot.interpreter_state === 'ERROR' ||
          snapshot.emergency_stop ||
          !snapshot.plant_online,
      }"
    >
      <span class="msg-prefix">{{ uiActionError ? 'ERR' : 'MSG' }}</span>
      <span class="msg-text">{{ uiActionError || snapshot.status_message || '系统就绪' }}</span>
      <span class="msg-meta">
        <span>CYCLE #{{ snapshot.cycle_count }}</span>
        <span class="ws-pill" :class="{ live: streamConnected }">
          {{ streamConnected ? 'gRPC 25Hz' : 'gRPC 轮询' }}
        </span>
      </span>
    </div>

    <!-- 主工作区：左侧程序编辑器 + 右侧常驻 3D 机械臂视窗与示教/日志面板 -->
    <main class="main-workspace" :class="{ 'viewport-expanded': viewportExpanded }">
      <section v-show="!viewportExpanded" class="editor-pane">
        <ProgramEditor :snapshot="snapshot" />
      </section>
      <section class="right-workbench">
        <div class="viewport-pane">
          <RobotViewport3D
            :snapshot="snapshot"
            :expanded="viewportExpanded"
            @toggle-expand="viewportExpanded = !viewportExpanded"
          />
        </div>
        <section v-show="!viewportExpanded" class="monitor-pane">
          <div class="right-pane-tabs">
            <button
              type="button"
              class="pane-tab-btn"
              :class="{ active: rightTab === 'monitor' }"
              @click="rightTab = 'monitor'"
            >
              🎛 示教监控与点动
            </button>
            <button
              type="button"
              class="pane-tab-btn"
              :class="{ active: rightTab === 'logs' }"
              @click="rightTab = 'logs'"
            >
              📋 日志管理
            </button>
          </div>
          <div class="right-pane-body">
            <MonitorAndJog v-show="rightTab === 'monitor'" :snapshot="snapshot" />
            <LogPanel v-show="rightTab === 'logs'" :active="rightTab === 'logs'" />
          </div>
        </section>
      </section>
    </main>
  </div>
</template>

<style scoped>
.bass-app {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #0b1120;
}

.system-message-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 16px;
  background-color: #0f172a;
  border-bottom: 1px solid #1e293b;
  font-size: 12px;
  color: #cbd5e1;
  flex-shrink: 0;
}

.system-message-bar.is-error {
  background-color: #2d1215;
  border-bottom-color: #7f1d1d;
  color: #fca5a5;
}

.msg-prefix {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 3px;
  background-color: #1e293b;
  color: #60a5fa;
  letter-spacing: 0.05em;
}

.system-message-bar.is-error .msg-prefix {
  background-color: #991b1b;
  color: #fee2e2;
}

.msg-text {
  flex: 1;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.msg-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  color: #64748b;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.ws-pill {
  padding: 1px 6px;
  border-radius: 3px;
  background-color: #334155;
  color: #cbd5e1;
}

.ws-pill.live {
  background-color: #064e3b;
  color: #6ee7b7;
}

.main-workspace {
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  flex: 1;
  overflow: hidden;
  box-sizing: border-box;
}

.main-workspace.viewport-expanded {
  grid-template-columns: 1fr;
}

.editor-pane {
  height: 100%;
  overflow: hidden;
  border-right: 1px solid #1e293b;
}

.right-workbench {
  display: grid;
  grid-template-rows: minmax(250px, 46%) 1fr;
  height: 100%;
  overflow: hidden;
}

.main-workspace.viewport-expanded .right-workbench {
  grid-template-rows: 1fr;
}

.viewport-pane {
  height: 100%;
  overflow: hidden;
  border-bottom: 1px solid #1e293b;
}

.main-workspace.viewport-expanded .viewport-pane {
  border-bottom: none;
}

.monitor-pane {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.right-pane-tabs {
  display: flex;
  gap: 6px;
  padding: 6px 12px;
  background-color: #131c31;
  border-bottom: 1px solid #1e293b;
  flex-shrink: 0;
}

.pane-tab-btn {
  background: #0f172a;
  border: 1px solid #334155;
  color: #94a3b8;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 5px;
  cursor: pointer;
}

.pane-tab-btn.active {
  background: #1e293b;
  border-color: #38bdf8;
  color: #f8fafc;
}

.right-pane-body {
  flex: 1;
  overflow: hidden;
}

@media (max-width: 1024px) {
  .main-workspace {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
  .editor-pane {
    border-right: none;
    border-bottom: 1px solid #1e293b;
  }
}
</style>
