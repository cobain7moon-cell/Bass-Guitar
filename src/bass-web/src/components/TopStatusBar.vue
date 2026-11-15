<script setup lang="ts">
import { computed, ref } from 'vue';
import type { OpMode, RobotStateSnapshot } from '../types';
import { api } from '../api/client';

const props = defineProps<{
  snapshot: RobotStateSnapshot;
}>();

const emit = defineEmits<{
  (e: 'update:override', val: number): void;
}>();

const actionLoading = ref(false);

const isPlantOnline = computed(() => props.snapshot.plant_online);
const isDrivesOn = computed(() => props.snapshot.drives_on);
const isEstop = computed(() => props.snapshot.emergency_stop);
const opMode = computed(() => props.snapshot.op_mode);
const interpState = computed(() => props.snapshot.interpreter_state);
const motionState = computed(() => props.snapshot.motion_state);

async function toggleMode(mode: OpMode) {
  if (props.snapshot.op_mode === mode) return;
  actionLoading.value = true;
  try {
    await api.setMode(mode);
  } finally {
    actionLoading.value = false;
  }
}

async function toggleDrives() {
  if (isEstop.value) return;
  actionLoading.value = true;
  try {
    await api.setPower(!isDrivesOn.value);
  } finally {
    actionLoading.value = false;
  }
}

async function toggleEstop() {
  actionLoading.value = true;
  try {
    await api.setEstop(!isEstop.value);
  } finally {
    actionLoading.value = false;
  }
}

async function onOverrideChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const val = parseInt(target.value, 10);
  if (!isNaN(val)) {
    emit('update:override', val);
    await api.setOverride(val);
  }
}
</script>

<template>
  <header class="top-status-bar">
    <!-- 品牌与标题 -->
    <div class="brand-section">
      <div class="brand-logo">
        <span class="logo-icon">⚡</span>
        <span class="logo-title">BASS <span class="logo-version">1.0</span></span>
      </div>
      <span class="brand-tag">TEACH PENDANT</span>
    </div>

    <!-- 物理端与状态指示器 -->
    <div class="status-group">
      <!-- 物理总线 UDP 状态 -->
      <div
        class="badge status-badge"
        :class="isPlantOnline ? 'online' : 'offline'"
        :title="isPlantOnline ? `往返时延: ${snapshot.rtt_ms.toFixed(1)}ms | 步数: ${snapshot.sim_tick}` : '物理被控对象已离线'"
      >
        <span class="indicator-dot"></span>
        <span class="badge-text">{{ isPlantOnline ? 'PLANT ONLINE' : 'PLANT OFFLINE' }}</span>
        <span v-if="isPlantOnline" class="badge-sub">
          {{ snapshot.rtt_ms.toFixed(1) }}ms
        </span>
      </div>

      <!-- 解释器状态 -->
      <div class="badge state-badge" :class="interpState.toLowerCase()">
        <span class="badge-label">EXEC</span>
        <span class="badge-value">{{ interpState }}</span>
      </div>

      <!-- 插补运动状态 -->
      <div class="badge motion-badge" :class="motionState.toLowerCase()">
        <span class="badge-label">MOT</span>
        <span class="badge-value">{{ motionState }}</span>
      </div>
    </div>

    <!-- 控制切换区：模式 / 驱动使能 / 倍率 -->
    <div class="controls-group">
      <!-- 运行模式 MANUAL / AUTO -->
      <div class="mode-switch">
        <button
          type="button"
          class="mode-btn"
          :class="{ active: opMode === 'MANUAL' }"
          :disabled="actionLoading"
          @click="toggleMode('MANUAL')"
        >
          MANUAL
        </button>
        <button
          type="button"
          class="mode-btn"
          :class="{ active: opMode === 'AUTO' }"
          :disabled="actionLoading"
          @click="toggleMode('AUTO')"
        >
          AUTO
        </button>
      </div>

      <!-- 驱动上电 Drives Power 开关 -->
      <button
        type="button"
        class="drives-btn"
        :class="{ on: isDrivesOn, disabled: isEstop }"
        :disabled="isEstop || actionLoading"
        :title="isEstop ? '急停已触发，必须先复位急停' : '切换伺服驱动上电/抱闸使能'"
        @click="toggleDrives"
      >
        <span class="power-icon">⚡</span>
        <span>{{ isDrivesOn ? 'DRIVES ON' : 'DRIVES OFF' }}</span>
      </button>

      <!-- 速度倍率滑块 5..100% -->
      <div class="override-box" title="速度倍率 Speed Override">
        <span class="override-label">OVR</span>
        <input
          type="range"
          min="5"
          max="100"
          step="5"
          :value="snapshot.speed_override"
          class="override-slider"
          @change="onOverrideChange"
        />
        <span class="override-val">{{ snapshot.speed_override }}%</span>
      </div>
    </div>

    <!-- 醒目急停按钮 (E-STOP) -->
    <div class="estop-wrapper">
      <button
        type="button"
        class="estop-btn"
        :class="{ active: isEstop }"
        :title="isEstop ? '点击解除并复位急停' : '紧急停止机械臂运动'"
        @click="toggleEstop"
      >
        <span class="estop-symbol">🛑</span>
        <span class="estop-text">{{ isEstop ? '急停已按下 (复位)' : 'E-STOP 急停' }}</span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.top-status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 16px;
  background-color: #0b1120;
  border-bottom: 1px solid #1e293b;
  user-select: none;
  box-sizing: border-box;
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 6px;
}

.logo-icon {
  font-size: 1.25rem;
  color: #38bdf8;
}

.logo-title {
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  color: #f8fafc;
}

.logo-version {
  color: #38bdf8;
  font-weight: 700;
}

.brand-tag {
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  padding: 2px 6px;
  background: #1e293b;
  color: #94a3b8;
  border-radius: 4px;
  font-weight: 600;
}

.status-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  font-family: monospace;
}

.status-badge.online {
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: #34d399;
}

.status-badge.offline {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #f87171;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: currentColor;
  box-shadow: 0 0 6px currentColor;
}

.badge-sub {
  font-size: 0.72rem;
  opacity: 0.85;
}

.state-badge,
.motion-badge {
  background: #131c31;
  border: 1px solid #1e293b;
  color: #cbd5e1;
}

.state-badge.running {
  border-color: rgba(16, 185, 129, 0.5);
  color: #34d399;
}

.state-badge.paused {
  border-color: rgba(245, 158, 11, 0.5);
  color: #fbbf24;
}

.state-badge.error {
  border-color: rgba(239, 68, 68, 0.5);
  color: #f87171;
}

.state-badge.completed {
  border-color: rgba(139, 92, 246, 0.5);
  color: #a78bfa;
}

.motion-badge.movel,
.motion-badge.movej,
.motion-badge.jog {
  border-color: rgba(56, 189, 248, 0.5);
  color: #38bdf8;
}

.badge-label {
  color: #64748b;
  font-size: 0.68rem;
}

.badge-value {
  font-weight: 700;
}

.controls-group {
  display: flex;
  align-items: center;
  gap: 14px;
}

.mode-switch {
  display: flex;
  background: #131c31;
  padding: 3px;
  border-radius: 6px;
  border: 1px solid #1e293b;
}

.mode-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.mode-btn.active {
  background: #2563eb;
  color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.drives-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 0.78rem;
  font-weight: 700;
  border-radius: 6px;
  border: 1px solid #334155;
  background: #1e293b;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s ease;
}

.drives-btn.on {
  background: #065f46;
  border-color: #10b981;
  color: #ecfdf5;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
}

.drives-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.power-icon {
  font-size: 0.9rem;
}

.override-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #131c31;
  border: 1px solid #1e293b;
  padding: 4px 10px;
  border-radius: 6px;
}

.override-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: #64748b;
}

.override-slider {
  width: 80px;
  height: 6px;
  cursor: pointer;
  accent-color: #2563eb;
}

.override-val {
  font-size: 0.78rem;
  font-family: monospace;
  font-weight: 700;
  color: #38bdf8;
  min-width: 38px;
  text-align: right;
}

.estop-wrapper {
  margin-left: 10px;
}

.estop-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  border-radius: 6px;
  cursor: pointer;
  border: 2px solid #ef4444;
  background: #991b1b;
  color: #ffffff;
  transition: all 0.15s ease;
  box-shadow: 0 2px 6px rgba(239, 68, 68, 0.4);
}

.estop-btn:hover {
  background: #b91c1c;
}

.estop-btn.active {
  background: #ef4444;
  border-color: #fef08a;
  color: #fef08a;
  box-shadow: 0 0 18px rgba(239, 68, 68, 0.8);
  animation: pulse-estop 1.2s infinite ease-in-out;
}

@keyframes pulse-estop {
  0% {
    transform: scale(1);
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.6);
  }
  50% {
    transform: scale(1.03);
    box-shadow: 0 0 20px rgba(239, 68, 68, 1);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.6);
  }
}

.estop-symbol {
  font-size: 1rem;
}
</style>
