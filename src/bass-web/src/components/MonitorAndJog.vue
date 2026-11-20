<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { CoordSystem, JogCommand, RobotStateSnapshot } from '../types';
import { api } from '../api/client';

const props = defineProps<{
  snapshot: RobotStateSnapshot;
}>();

// 坐标系与点动模式
const coordSystem = ref<CoordSystem>('CARTESIAN');
const jogType = ref<'HOLD' | 'STEP'>('HOLD');

// 步长设置
const cartStepOptions = [1, 5, 10, 25];
const jointStepOptions = [0.5, 1.0, 5.0, 10.0];
const selectedCartStep = ref<number>(5);
const selectedJointStep = ref<number>(1.0);

const currentStepSize = computed(() => {
  return coordSystem.value === 'CARTESIAN' ? selectedCartStep.value : selectedJointStep.value;
});

// 安全状态判断（严禁在程序 RUNNING/PAUSED 状态下点动）
const canJog = computed(() => {
  return (
    props.snapshot.op_mode === 'MANUAL' &&
    props.snapshot.drives_on &&
    !props.snapshot.emergency_stop &&
    props.snapshot.plant_online &&
    props.snapshot.interpreter_state !== 'RUNNING' &&
    props.snapshot.interpreter_state !== 'PAUSED'
  );
});

watch(canJog, (ok) => {
  if (!ok) {
    stopHoldJog();
  }
});

// Hold-to-Jog 心跳管理
let holdIntervalTimer: number | null = null;
const activeHoldingAxis = ref<string | null>(null);
const jogError = ref<string | null>(null);
let capturedEl: HTMLElement | null = null;
let capturedPointerId: number | null = null;

function reportJogError(err: unknown, fallback: string) {
  jogError.value = err instanceof Error ? err.message : fallback;
}

function startHoldJog(ev: PointerEvent, axis: string, direction: number) {
  if (!canJog.value) return;
  if (jogType.value !== 'HOLD') return;

  // 清除任何旧定时器
  stopHoldJog();
  jogError.value = null;

  const target = ev.currentTarget as HTMLElement | null;
  if (target?.setPointerCapture) {
    try {
      target.setPointerCapture(ev.pointerId);
      capturedEl = target;
      capturedPointerId = ev.pointerId;
    } catch {
      // 某些模拟事件可能无 pointerId 捕获权限，依赖 window blur 兜底
    }
  }

  const cmd: JogCommand = {
    coord_system: coordSystem.value,
    axis,
    direction,
    step_size: currentStepSize.value,
  };

  activeHoldingAxis.value = `${axis}_${direction > 0 ? '+' : '-'}`;

  // 立即发出第一次心跳
  api
    .jogHold(cmd)
    .then((res) => {
      if (!res.ok && res.error) {
        jogError.value = res.error;
        stopHoldJog();
      }
    })
    .catch((err) => reportJogError(err, 'Hold 点动指令发送失败'));

  // 每 60ms 续期一次心跳
  holdIntervalTimer = window.setInterval(() => {
    api
      .jogHold(cmd)
      .then((res) => {
        if (!res.ok && res.error) {
          jogError.value = res.error;
          stopHoldJog();
        }
      })
      .catch((err) => reportJogError(err, 'Hold 点动续期失败'));
  }, 60);
}

function stopHoldJog() {
  if (capturedEl && capturedPointerId !== null && capturedEl.releasePointerCapture) {
    try {
      capturedEl.releasePointerCapture(capturedPointerId);
    } catch {
      // ignore if already released
    }
  }
  capturedEl = null;
  capturedPointerId = null;

  if (holdIntervalTimer !== null) {
    clearInterval(holdIntervalTimer);
    holdIntervalTimer = null;
  }
  if (activeHoldingAxis.value !== null) {
    activeHoldingAxis.value = null;
    api.jogStop().catch((err) => reportJogError(err, '停止点动请求失败'));
  }
}

function handleStepJog(axis: string, direction: number) {
  if (!canJog.value) return;
  if (jogType.value !== 'STEP') return;
  jogError.value = null;

  const cmd: JogCommand = {
    coord_system: coordSystem.value,
    axis,
    direction,
    step_size: currentStepSize.value,
  };

  api
    .jogStep(cmd)
    .then((res) => {
      if (!res.ok && res.error) {
        jogError.value = res.error;
      }
    })
    .catch((err) => reportJogError(err, '步进点动指令发送失败'));
}

// DOUT 手动翻转控制
async function toggleDout(index: number) {
  if (props.snapshot.op_mode !== 'MANUAL') return;
  jogError.value = null;
  const pin = index + 1; // 1-indexed
  const curState = props.snapshot.digital_out[index] ?? false;
  try {
    const res = await api.setDout(pin, !curState);
    if (!res.ok && res.error) {
      jogError.value = res.error;
    }
  } catch (err) {
    reportJogError(err, `切换 DOUT[${pin}] 失败`);
  }
}

// 笛卡尔轴定义
const cartesianAxes = [
  { name: 'X', label: 'X (前后)', unit: 'mm' },
  { name: 'Y', label: 'Y (左右)', unit: 'mm' },
  { name: 'Z', label: 'Z (上下)', unit: 'mm' },
  { name: 'A', label: 'A (绕Z)', unit: '°' },
  { name: 'B', label: 'B (绕Y)', unit: '°' },
  { name: 'C', label: 'C (绕X)', unit: '°' },
];

// 关节轴定义
const jointAxes = [
  { name: 'J1', label: 'J1 (基座)' },
  { name: 'J2', label: 'J2 (大臂)' },
  { name: 'J3', label: 'J3 (小臂)' },
  { name: 'J4', label: 'J4 (手腕旋转)' },
  { name: 'J5', label: 'J5 (手腕俯仰)' },
  { name: 'J6', label: 'J6 (法兰自转)' },
];

// 窗口失焦或取消事件时安全停止点动
function onWindowBlur() {
  stopHoldJog();
}

onMounted(() => {
  window.addEventListener('blur', onWindowBlur);
  window.addEventListener('pointercancel', onWindowBlur);
});

onBeforeUnmount(() => {
  window.removeEventListener('blur', onWindowBlur);
  window.removeEventListener('pointercancel', onWindowBlur);
  stopHoldJog();
});
</script>

<template>
  <div class="monitor-jog-container">
    <!-- 上半部分：高密度实时数值与状态监控 -->
    <div class="monitor-section">
      <!-- 笛卡尔末端 TCP 位姿卡片 -->
      <div class="data-card tcp-card">
        <div class="card-header">
          <span class="card-title">TCP 位姿 (Tool Center Point)</span>
          <span class="unit-tag">mm / °</span>
        </div>
        <div class="pose-grid">
          <div class="coord-item">
            <span class="coord-label">X</span>
            <span class="coord-val">{{ snapshot.cart_actual.x.toFixed(2) }}</span>
          </div>
          <div class="coord-item">
            <span class="coord-label">Y</span>
            <span class="coord-val">{{ snapshot.cart_actual.y.toFixed(2) }}</span>
          </div>
          <div class="coord-item">
            <span class="coord-label">Z</span>
            <span class="coord-val">{{ snapshot.cart_actual.z.toFixed(2) }}</span>
          </div>
          <div class="coord-item">
            <span class="coord-label">A</span>
            <span class="coord-val">{{ snapshot.cart_actual.a.toFixed(2) }}</span>
          </div>
          <div class="coord-item">
            <span class="coord-label">B</span>
            <span class="coord-val">{{ snapshot.cart_actual.b.toFixed(2) }}</span>
          </div>
          <div class="coord-item">
            <span class="coord-label">C</span>
            <span class="coord-val">{{ snapshot.cart_actual.c.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- 关节角度与力矩卡片 -->
      <div class="data-card joints-card">
        <div class="card-header">
          <span class="card-title">关节状态 (Joint Angles & Torques)</span>
          <span class="unit-tag">deg / Nm</span>
        </div>
        <div class="joints-table">
          <div v-for="i in 6" :key="i" class="joint-row">
            <span class="joint-name">J{{ i }}</span>
            <span class="joint-angle">
              {{ (snapshot.joint_actual[i - 1] ?? 0).toFixed(2) }}°
            </span>
            <div class="torque-cell">
              <span class="torque-val">
                {{ (snapshot.joint_torque[i - 1] ?? 0).toFixed(2) }} Nm
              </span>
              <div class="torque-bar-bg">
                <div
                  class="torque-bar-fill"
                  :style="{
                    width: `${Math.min(100, Math.abs(snapshot.joint_torque[i - 1] ?? 0) * 1.5)}%`,
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 数字输出 DOUT[1..8] 状态与控制 -->
      <div class="data-card io-card">
        <div class="card-header">
          <span class="card-title">数字输出 (DOUT 1..8)</span>
          <span class="io-mode-tag">
            {{ snapshot.op_mode === 'MANUAL' ? '手动模式可点击翻转' : '自动模式只读' }}
          </span>
        </div>
        <div class="dout-grid">
          <button
            v-for="(val, idx) in snapshot.digital_out"
            :key="idx"
            type="button"
            class="dout-btn"
            :class="{ active: val, disabled: snapshot.op_mode !== 'MANUAL' }"
            :disabled="snapshot.op_mode !== 'MANUAL'"
            :title="`DOUT[${idx + 1}] (点击切换)`"
            @click="toggleDout(idx)"
          >
            <span class="dout-led"></span>
            <span class="dout-name">DO {{ idx + 1 }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 下半部分：手动点动控制区 (Jog Panel) -->
    <div class="jog-section">
      <!-- Jog 控制顶栏：模式切换与步长配置 -->
      <div class="jog-header">
        <div class="jog-mode-switches">
          <!-- 坐标系选择 -->
          <div class="pill-group">
            <button
              type="button"
              class="pill-btn"
              :class="{ active: coordSystem === 'CARTESIAN' }"
              @click="coordSystem = 'CARTESIAN'"
            >
              笛卡尔 CARTESIAN
            </button>
            <button
              type="button"
              class="pill-btn"
              :class="{ active: coordSystem === 'JOINT' }"
              @click="coordSystem = 'JOINT'"
            >
              关节 JOINT
            </button>
          </div>

          <!-- 点动模式选择：连续按住 vs 步进 -->
          <div class="pill-group">
            <button
              type="button"
              class="pill-btn"
              :class="{ active: jogType === 'HOLD' }"
              @click="jogType = 'HOLD'"
            >
              按住连续 (Hold)
            </button>
            <button
              type="button"
              class="pill-btn"
              :class="{ active: jogType === 'STEP' }"
              @click="jogType = 'STEP'"
            >
              步进增量 (Step)
            </button>
          </div>
        </div>

        <!-- 步长增量微调选择 -->
        <div class="step-size-selector">
          <span class="step-label">步长:</span>
          <template v-if="coordSystem === 'CARTESIAN'">
            <button
              v-for="s in cartStepOptions"
              :key="s"
              type="button"
              class="step-val-btn"
              :class="{ active: selectedCartStep === s }"
              @click="selectedCartStep = s"
            >
              {{ s }}mm
            </button>
          </template>
          <template v-else>
            <button
              v-for="s in jointStepOptions"
              :key="s"
              type="button"
              class="step-val-btn"
              :class="{ active: selectedJointStep === s }"
              @click="selectedJointStep = s"
            >
              {{ s }}°
            </button>
          </template>
        </div>
      </div>

      <!-- 6 轴点动按键阵列 -->
      <div class="jog-keys-container">
        <!-- 笛卡尔空间按键 (X, Y, Z, A, B, C) -->
        <div v-if="coordSystem === 'CARTESIAN'" class="jog-axis-list">
          <div v-for="axis in cartesianAxes" :key="axis.name" class="jog-axis-row">
            <span class="axis-title">{{ axis.name }}</span>
            <span class="axis-sub">{{ axis.label }}</span>

            <div class="axis-buttons">
              <!-- 负向点动按钮 -->
              <button
                type="button"
                class="jog-btn minus"
                :class="{
                  holding: activeHoldingAxis === `${axis.name}_-`,
                }"
                :disabled="!canJog"
                @pointerdown="startHoldJog($event, axis.name, -1)"
                @pointerup="stopHoldJog"
                @pointerleave="stopHoldJog"
                @pointercancel="stopHoldJog"
                @click="handleStepJog(axis.name, -1)"
              >
                - {{ axis.name }}
              </button>

              <!-- 正向点动按钮 -->
              <button
                type="button"
                class="jog-btn plus"
                :class="{
                  holding: activeHoldingAxis === `${axis.name}_+`,
                }"
                :disabled="!canJog"
                @pointerdown="startHoldJog($event, axis.name, 1)"
                @pointerup="stopHoldJog"
                @pointerleave="stopHoldJog"
                @pointercancel="stopHoldJog"
                @click="handleStepJog(axis.name, 1)"
              >
                + {{ axis.name }}
              </button>
            </div>
          </div>
        </div>

        <!-- 关节空间按键 (J1 .. J6) -->
        <div v-else class="jog-axis-list">
          <div v-for="axis in jointAxes" :key="axis.name" class="jog-axis-row">
            <span class="axis-title">{{ axis.name }}</span>
            <span class="axis-sub">{{ axis.label }}</span>

            <div class="axis-buttons">
              <!-- 负向点动按钮 -->
              <button
                type="button"
                class="jog-btn minus"
                :class="{
                  holding: activeHoldingAxis === `${axis.name}_-`,
                }"
                :disabled="!canJog"
                @pointerdown="startHoldJog($event, axis.name, -1)"
                @pointerup="stopHoldJog"
                @pointerleave="stopHoldJog"
                @pointercancel="stopHoldJog"
                @click="handleStepJog(axis.name, -1)"
              >
                - {{ axis.name }}
              </button>

              <!-- 正向点动按钮 -->
              <button
                type="button"
                class="jog-btn plus"
                :class="{
                  holding: activeHoldingAxis === `${axis.name}_+`,
                }"
                :disabled="!canJog"
                @pointerdown="startHoldJog($event, axis.name, 1)"
                @pointerup="stopHoldJog"
                @pointerleave="stopHoldJog"
                @pointercancel="stopHoldJog"
                @click="handleStepJog(axis.name, 1)"
              >
                + {{ axis.name }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 点动就绪提示信息 -->
      <div class="jog-status-footer">
        <span v-if="jogError" class="warn-text">⚠️ {{ jogError }}</span>
        <span v-else-if="!canJog" class="warn-text">
          ⚠️ 点动未就绪：请确保处于 MANUAL 手动模式、伺服上电 (Drives ON) 且急停已复位。
        </span>
        <span v-else-if="jogType === 'HOLD'" class="tip-text">
          💡 按住连续点动：鼠标按下即持续以 60ms 心跳运动，松开按键或移出立即停止。
        </span>
        <span v-else class="tip-text">
          💡 步进增量点动：每次点击沿指定方向移动 {{ currentStepSize }} {{ coordSystem === 'CARTESIAN' ? 'mm' : '°' }}。
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.monitor-jog-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #0b1120;
  overflow-y: auto;
  box-sizing: border-box;
}

.monitor-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  border-bottom: 1px solid #1e293b;
}

.data-card {
  background: #131c31;
  border: 1px solid #1e293b;
  border-radius: 6px;
  padding: 10px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.card-title {
  font-size: 0.76rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.04em;
}

.unit-tag,
.io-mode-tag {
  font-size: 0.68rem;
  color: #64748b;
  font-weight: 600;
}

/* TCP 位姿格点 */
.pose-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 6px;
}

.coord-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #0b1120;
  border: 1px solid #1e293b;
  border-radius: 4px;
  padding: 4px 2px;
}

.coord-label {
  font-size: 0.68rem;
  font-weight: 800;
  color: #38bdf8;
}

.coord-val {
  font-size: 0.8rem;
  font-family: 'Consolas', monospace;
  font-weight: 700;
  color: #f8fafc;
}

/* 关节角度与力矩列表 */
.joints-table {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px 12px;
}

.joint-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #0b1120;
  border: 1px solid #1e293b;
  border-radius: 4px;
  padding: 3px 8px;
  font-size: 0.74rem;
}

.joint-name {
  font-weight: 800;
  color: #a78bfa;
  min-width: 22px;
}

.joint-angle {
  font-family: 'Consolas', monospace;
  font-weight: 700;
  color: #f1f5f9;
  min-width: 60px;
  text-align: right;
}

.torque-cell {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 70px;
}

.torque-val {
  font-family: 'Consolas', monospace;
  font-size: 0.7rem;
  color: #94a3b8;
}

.torque-bar-bg {
  width: 50px;
  height: 3px;
  background: #1e293b;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 2px;
}

.torque-bar-fill {
  height: 100%;
  background: #38bdf8;
}

/* DOUT 数字输出状态格点 */
.dout-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 6px;
}

.dout-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: #0b1120;
  border: 1px solid #1e293b;
  border-radius: 4px;
  padding: 6px 2px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.dout-btn:hover:not(.disabled) {
  border-color: #38bdf8;
}

.dout-btn.disabled {
  cursor: default;
  opacity: 0.8;
}

.dout-led {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #334155;
  transition: all 0.2s ease;
}

.dout-btn.active .dout-led {
  background-color: #10b981;
  box-shadow: 0 0 8px #10b981;
}

.dout-name {
  font-size: 0.68rem;
  font-weight: 700;
  color: #94a3b8;
  font-family: monospace;
}

/* Jog 控制区 */
.jog-section {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 12px;
}

.jog-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.jog-mode-switches {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.pill-group {
  display: flex;
  background: #131c31;
  padding: 3px;
  border-radius: 6px;
  border: 1px solid #1e293b;
}

.pill-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 0.74rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.pill-btn.active {
  background: #2563eb;
  color: #ffffff;
}

.step-size-selector {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #131c31;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid #1e293b;
}

.step-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: #64748b;
}

.step-val-btn {
  background: #0b1120;
  border: 1px solid #334155;
  color: #cbd5e1;
  font-size: 0.72rem;
  font-family: monospace;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  cursor: pointer;
}

.step-val-btn.active {
  background: #0284c7;
  border-color: #38bdf8;
  color: #ffffff;
}

/* 点动按键列表 */
.jog-axis-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.jog-axis-row {
  display: flex;
  align-items: center;
  background: #131c31;
  border: 1px solid #1e293b;
  border-radius: 6px;
  padding: 6px 12px;
}

.axis-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: #38bdf8;
  min-width: 32px;
}

.axis-sub {
  font-size: 0.72rem;
  color: #64748b;
  flex: 1;
}

.axis-buttons {
  display: flex;
  gap: 10px;
}

.jog-btn {
  width: 72px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 800;
  font-family: monospace;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  user-select: none;
  touch-action: none;
  transition: all 0.12s ease;
}

.jog-btn.minus {
  background: #1e293b;
  border-color: #3b82f6;
  color: #93c5fd;
}

.jog-btn.minus:hover:not(:disabled) {
  background: #1d4ed8;
  color: #ffffff;
}

.jog-btn.plus {
  background: #1e293b;
  border-color: #10b981;
  color: #6ee7b7;
}

.jog-btn.plus:hover:not(:disabled) {
  background: #059669;
  color: #ffffff;
}

.jog-btn.holding {
  transform: scale(0.96);
  box-shadow: 0 0 12px currentColor;
  filter: brightness(1.2);
}

.jog-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  border-color: #334155;
  color: #64748b;
}

.jog-status-footer {
  margin-top: 10px;
  padding: 8px 10px;
  border-radius: 4px;
  background: #0b1120;
  border: 1px dashed #1e293b;
  font-size: 0.72rem;
}

.warn-text {
  color: #fbbf24;
  font-weight: 600;
}

.tip-text {
  color: #94a3b8;
}
</style>
