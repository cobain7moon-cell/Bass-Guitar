<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { api, MotionTelemetryClient } from '../api/client';
import type { MotionTelemetryData, RobotModelConfig, RobotStateSnapshot } from '../types';

const props = defineProps<{
  snapshot: RobotStateSnapshot;
  expanded?: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggle-expand'): void;
}>();

const canvasHostRef = ref<HTMLDivElement | null>(null);
const loading = ref<boolean>(true);
const loadError = ref<string | null>(null);
const motionStreamConnected = ref<boolean>(false);
const showTrail = ref<boolean>(true);
const showTargetMarker = ref<boolean>(true);
const latestMotion = ref<MotionTelemetryData | null>(null);

const activeJoints = computed(() => {
  return latestMotion.value?.joint_actual ?? props.snapshot.joint_actual;
});

const activeTcpPose = computed(() => {
  return latestMotion.value?.cart_actual ?? props.snapshot.cart_actual;
});

const plantOnline = computed(() => {
  return latestMotion.value?.plant_online ?? props.snapshot.plant_online;
});

const drivesEnabled = computed(() => {
  return latestMotion.value?.drives_enabled ?? props.snapshot.drives_on;
});

const faultActive = computed(() => {
  return Boolean(latestMotion.value?.plant_fault_active) || props.snapshot.emergency_stop;
});

const rttMs = computed(() => {
  return latestMotion.value?.rtt_ms ?? props.snapshot.rtt_ms;
});

const simTick = computed(() => {
  return latestMotion.value?.sim_tick ?? props.snapshot.sim_tick;
});

let motionClient: MotionTelemetryClient | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let controls: OrbitControls | null = null;
let resizeObserver: ResizeObserver | null = null;
let rafId: number | null = null;

// UR5e 关节转动枢轴列表 (J1..J6)
const jointPivots: Array<{ pivot: THREE.Group; axis: THREE.Vector3 }> = [];
let tcpObject: THREE.Object3D | null = null;
let targetMarkerMesh: THREE.Mesh | null = null;

// TCP 实时三维轨迹曲线
const MAX_TRAIL_POINTS = 360;
const trailPoints: THREE.Vector3[] = [];
let trailGeometry: THREE.BufferGeometry | null = null;
let trailLine: THREE.Line | null = null;
let lastTrailSample = new THREE.Vector3(Infinity, Infinity, Infinity);

function applyJointAngles(jointsDeg: number[]) {
  for (let i = 0; i < jointPivots.length; i++) {
    const entry = jointPivots[i];
    const deg = jointsDeg[i] ?? 0;
    entry.pivot.quaternion.setFromAxisAngle(entry.axis, THREE.MathUtils.degToRad(deg));
  }
}

function appendTcpTrailSample() {
  if (!scene || !tcpObject || !trailGeometry || !trailLine) return;
  trailLine.visible = showTrail.value;
  if (!showTrail.value) return;

  scene.updateMatrixWorld(true);
  const worldPos = new THREE.Vector3();
  tcpObject.getWorldPosition(worldPos);
  if (worldPos.distanceToSquared(lastTrailSample) > 1e-6) {
    lastTrailSample.copy(worldPos);
    trailPoints.push(worldPos.clone());
    if (trailPoints.length > MAX_TRAIL_POINTS) {
      trailPoints.shift();
    }
    const flat = new Float32Array(trailPoints.length * 3);
    for (let i = 0; i < trailPoints.length; i++) {
      flat[i * 3] = trailPoints[i].x;
      flat[i * 3 + 1] = trailPoints[i].y;
      flat[i * 3 + 2] = trailPoints[i].z;
    }
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(flat, 3));
    trailGeometry.setDrawRange(0, trailPoints.length);
    trailGeometry.computeBoundingSphere();
  }
}

function clearTrail() {
  trailPoints.length = 0;
  lastTrailSample.set(Infinity, Infinity, Infinity);
  if (trailGeometry) {
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(0), 3));
    trailGeometry.setDrawRange(0, 0);
  }
}

function setCameraPreset(preset: 'iso' | 'front' | 'top') {
  if (!camera || !controls) return;
  if (preset === 'iso') {
    camera.position.set(1.15, 0.95, 1.05);
    controls.target.set(-0.08, 0.36, -0.35);
  } else if (preset === 'front') {
    camera.position.set(-0.1, 0.42, 1.35);
    controls.target.set(-0.1, 0.36, -0.35);
  } else {
    camera.position.set(-0.1, 1.65, -0.34);
    controls.target.set(-0.1, 0.2, -0.35);
  }
  controls.update();
}

function wxyzToThreeQuat(q: [number, number, number, number]): THREE.Quaternion {
  return new THREE.Quaternion(q[1], q[2], q[3], q[0]).normalize();
}

function mmToThreeVec(v: [number, number, number]): THREE.Vector3 {
  return new THREE.Vector3(v[0] * 0.001, v[1] * 0.001, v[2] * 0.001);
}

async function loadMeshList(
  loader: OBJLoader,
  meshDirUrl: string,
  meshes: Array<{ file: string; rgba: [number, number, number, number] }>,
  parent: THREE.Object3D,
) {
  await Promise.all(
    meshes.map(async (item) => {
      const url = `${meshDirUrl}/${item.file}`;
      const obj = await loader.loadAsync(url);
      const color = new THREE.Color().setRGB(
        item.rgba[0],
        item.rgba[1],
        item.rgba[2],
        THREE.LinearSRGBColorSpace,
      );
      const opacity = item.rgba[3] ?? 1.0;
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.36,
        metalness: 0.42,
        transparent: opacity < 0.99,
        opacity,
      });
      obj.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.material = mat;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      });
      parent.add(obj);
    }),
  );
}

async function buildSceneFromConfig(cfg: RobotModelConfig, host: HTMLDivElement) {
  scene = new THREE.Scene();
  scene.background = new THREE.Color('#09101f');

  const width = Math.max(host.clientWidth, 320);
  const height = Math.max(host.clientHeight, 240);
  camera = new THREE.PerspectiveCamera(42, width / height, 0.02, 20);
  camera.up.set(0, 1, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  host.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 0.35;
  controls.maxDistance = 4.5;
  setCameraPreset('iso');

  // 工业工作站灯光
  scene.add(new THREE.HemisphereLight('#c7d9f8', '#1e293b', 0.95));
  const keyLight = new THREE.DirectionalLight('#ffffff', 1.65);
  keyLight.position.set(1.6, 2.5, 1.4);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.near = 0.2;
  keyLight.shadow.camera.far = 7.0;
  const s = 1.4;
  keyLight.shadow.camera.left = -s;
  keyLight.shadow.camera.right = s;
  keyLight.shadow.camera.top = s;
  keyLight.shadow.camera.bottom = -s;
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight('#38bdf8', 0.55);
  rimLight.position.set(-1.5, 1.2, -1.5);
  scene.add(rimLight);

  // 地面网格与阴影接收面（Three.js Y=0 对应 Z=0）
  const grid = new THREE.GridHelper(3.0, 30, '#334155', '#172033');
  grid.position.y = -0.016;
  scene.add(grid);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(4.0, 4.0),
    new THREE.MeshStandardMaterial({ color: '#0c1426', roughness: 0.9, metalness: 0.05 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.017;
  floor.receiveShadow = true;
  scene.add(floor);

  // 将机器人世界坐标系（Z-up）映射到 Three.js Y-up
  const robotWorldRoot = new THREE.Group();
  robotWorldRoot.rotation.x = -Math.PI / 2;
  scene.add(robotWorldRoot);

  // 世界坐标轴辅助器
  const worldAxes = new THREE.AxesHelper(0.18);
  robotWorldRoot.add(worldAxes);

  // 工作台模型
  if (cfg.environment?.worktable) {
    const wt = cfg.environment.worktable;
    const wtHalf = mmToThreeVec(wt.half_size_mm);
    const wtMesh = new THREE.Mesh(
      new THREE.BoxGeometry(wtHalf.x * 2, wtHalf.y * 2, wtHalf.z * 2),
      new THREE.MeshStandardMaterial({
        color: '#334155',
        roughness: 0.65,
        metalness: 0.25,
      }),
    );
    wtMesh.position.copy(mmToThreeVec(wt.pos_mm));
    wtMesh.castShadow = true;
    wtMesh.receiveShadow = true;
    robotWorldRoot.add(wtMesh);

    const wtEdge = new THREE.LineSegments(
      new THREE.EdgesGeometry(wtMesh.geometry),
      new THREE.LineBasicMaterial({ color: '#64748b' }),
    );
    wtMesh.add(wtEdge);
  }

  // 目标点参考标识
  if (cfg.environment?.target_marker_pos_mm) {
    targetMarkerMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.014, 20, 20),
      new THREE.MeshStandardMaterial({
        color: '#f43f5e',
        emissive: '#be123c',
        emissiveIntensity: 0.45,
        transparent: true,
        opacity: 0.72,
      }),
    );
    targetMarkerMesh.position.copy(mmToThreeVec(cfg.environment.target_marker_pos_mm));
    robotWorldRoot.add(targetMarkerMesh);
  }

  // 构建 6 轴串联链层级并并发加载 OBJ 网格
  const loader = new OBJLoader();
  const normalizedMeshDir = cfg.mesh_dir.replace(/^\/+/, '');
  const meshDirUrl = `/robot-assets/${normalizedMeshDir}`;

  const baseGroup = new THREE.Group();
  baseGroup.position.copy(mmToThreeVec(cfg.base_transform.pos_mm));
  baseGroup.quaternion.copy(wxyzToThreeQuat(cfg.base_transform.quat_wxyz));
  robotWorldRoot.add(baseGroup);

  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.095, 0.095, 0.016, 32),
    new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.5, metalness: 0.6 }),
  );
  pedestal.rotation.x = Math.PI / 2;
  pedestal.position.z = -0.008;
  pedestal.receiveShadow = true;
  baseGroup.add(pedestal);

  const meshLoadTasks: Array<Promise<void>> = [
    loadMeshList(loader, meshDirUrl, cfg.base_visual.meshes, baseGroup),
  ];

  let parentObj: THREE.Object3D = baseGroup;
  jointPivots.length = 0;

  for (const j of cfg.joints) {
    const linkFrame = new THREE.Group();
    linkFrame.name = `${j.body_name}_frame`;
    linkFrame.position.copy(mmToThreeVec(j.pos_mm));
    linkFrame.quaternion.copy(wxyzToThreeQuat(j.quat_wxyz));
    parentObj.add(linkFrame);

    const pivot = new THREE.Group();
    pivot.name = j.body_name;
    linkFrame.add(pivot);

    const axis = new THREE.Vector3(j.axis[0], j.axis[1], j.axis[2]).normalize();
    jointPivots.push({ pivot, axis });

    meshLoadTasks.push(loadMeshList(loader, meshDirUrl, j.meshes, pivot));
    parentObj = pivot;
  }

  // 法兰与 TCP 指示点
  const flangeGroup = new THREE.Group();
  flangeGroup.position.copy(mmToThreeVec(cfg.flange_transform.pos_mm));
  flangeGroup.quaternion.copy(wxyzToThreeQuat(cfg.flange_transform.quat_wxyz));
  parentObj.add(flangeGroup);

  const flangePlate = new THREE.Mesh(
    new THREE.CylinderGeometry(0.032, 0.032, 0.014, 24),
    new THREE.MeshStandardMaterial({ color: '#475569', roughness: 0.35, metalness: 0.75 }),
  );
  flangePlate.rotation.x = Math.PI / 2;
  flangePlate.position.z = 0.004;
  flangeGroup.add(flangePlate);

  const tcpVec = mmToThreeVec(cfg.tcp_offset_mm);
  const pointerLen = tcpVec.length();
  if (pointerLen > 1e-4) {
    const ptrGeom = new THREE.CylinderGeometry(0.006, 0.006, pointerLen, 14);
    const ptrMesh = new THREE.Mesh(
      ptrGeom,
      new THREE.MeshStandardMaterial({ color: '#22c55e', roughness: 0.3, metalness: 0.4 }),
    );
    const mid = tcpVec.clone().multiplyScalar(0.5);
    ptrMesh.position.copy(mid);
    ptrMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tcpVec.clone().normalize());
    flangeGroup.add(ptrMesh);
  }

  const tcpDot = new THREE.Mesh(
    new THREE.SphereGeometry(0.011, 16, 16),
    new THREE.MeshStandardMaterial({
      color: '#10b981',
      emissive: '#059669',
      emissiveIntensity: 0.65,
    }),
  );
  tcpDot.position.copy(tcpVec);
  tcpDot.add(new THREE.AxesHelper(0.07));
  flangeGroup.add(tcpDot);
  tcpObject = tcpDot;

  // TCP 轨迹线（直接添加到世界根场景）
  trailGeometry = new THREE.BufferGeometry();
  trailLine = new THREE.Line(
    trailGeometry,
    new THREE.LineBasicMaterial({ color: '#38bdf8', transparent: true, opacity: 0.85 }),
  );
  trailLine.frustumCulled = false;
  scene.add(trailLine);

  await Promise.all(meshLoadTasks);
  applyJointAngles(activeJoints.value);
}

function startRenderLoop() {
  const tick = () => {
    rafId = window.requestAnimationFrame(tick);
    if (!renderer || !scene || !camera) return;

    if (targetMarkerMesh) {
      targetMarkerMesh.visible = showTargetMarker.value;
    }
    applyJointAngles(activeJoints.value);
    appendTcpTrailSample();

    controls?.update();
    renderer.render(scene, camera);
  };
  tick();
}

onMounted(async () => {
  const host = canvasHostRef.value;
  if (!host) return;

  try {
    const cfg = await api.fetchRobotModelConfig();
    await buildSceneFromConfig(cfg, host);
    loading.value = false;
  } catch (err) {
    loading.value = false;
    loadError.value = err instanceof Error ? err.message : '初始化 3D 视窗失败';
    return;
  }

  resizeObserver = new ResizeObserver((entries) => {
    const entry = entries[0];
    if (!entry || !renderer || !camera) return;
    const w = Math.max(Math.floor(entry.contentRect.width), 100);
    const h = Math.max(Math.floor(entry.contentRect.height), 100);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
  resizeObserver.observe(host);

  startRenderLoop();

  // 直连 MotionService 订阅 40Hz 实时运动引擎物理遥测
  motionClient = new MotionTelemetryClient(
    (telem) => {
      latestMotion.value = telem;
    },
    (connected) => {
      motionStreamConnected.value = connected;
    },
    25,
  );
  motionClient.connect();
});

onBeforeUnmount(() => {
  if (motionClient) {
    motionClient.disconnect();
    motionClient = null;
  }
  if (rafId !== null) {
    window.cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  if (controls) {
    controls.dispose();
    controls = null;
  }
  if (scene) {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.geometry) {
        mesh.geometry.dispose();
      }
      const mat = mesh.material;
      if (Array.isArray(mat)) {
        mat.forEach((m) => m.dispose());
      } else if (mat) {
        mat.dispose();
      }
    });
    scene = null;
  }
  if (renderer) {
    renderer.dispose();
    renderer.domElement.remove();
    renderer = null;
  }
});
</script>

<template>
  <div class="viewport-3d-shell">
    <!-- 顶部 3D 视窗工具栏与直驱状态指示 -->
    <div class="viewport-toolbar">
      <div class="toolbar-left">
        <span class="vp-title">🤖 3D 物理仿真视窗 (UR5e · MuJoCo 4.0.1 C FFI)</span>
        <span class="stream-badge" :class="{ live: motionStreamConnected }">
          {{ motionStreamConnected ? 'MotionEngine 40Hz 直驱' : '快照跟随' }}
        </span>
        <span
          class="sim-pill"
          :class="{ online: plantOnline && !faultActive, fault: faultActive }"
        >
          {{
            faultActive
              ? '故障/急停锁定'
              : plantOnline
                ? drivesEnabled
                  ? `闭环伺服运行中 · ${rttMs.toFixed(2)}ms`
                  : `物理就绪抱闸 · Tick #${simTick}`
                : '物理端等待接入'
          }}
        </span>
      </div>

      <div class="toolbar-actions">
        <label class="vp-check">
          <input v-model="showTrail" type="checkbox" />
          <span>TCP 轨迹</span>
        </label>
        <label class="vp-check">
          <input v-model="showTargetMarker" type="checkbox" />
          <span>目标点</span>
        </label>
        <button type="button" class="vp-btn" @click="clearTrail">清轨迹</button>
        <button type="button" class="vp-btn" @click="setCameraPreset('iso')">等轴</button>
        <button type="button" class="vp-btn" @click="setCameraPreset('front')">正视</button>
        <button type="button" class="vp-btn" @click="setCameraPreset('top')">俯视</button>
        <button type="button" class="vp-btn accent" @click="emit('toggle-expand')">
          {{ expanded ? '恢复分栏' : '全屏 3D' }}
        </button>
      </div>
    </div>

    <!-- Three.js WebGL 画布宿主 -->
    <div ref="canvasHostRef" class="canvas-host">
      <div v-if="loading" class="vp-overlay">
        <span>⏳ 正在从后端载入 UR5e 3D 模型与网格资产...</span>
      </div>
      <div v-else-if="loadError" class="vp-overlay error">
        <span>⚠ {{ loadError }}</span>
      </div>

      <!-- 左下角实时 TCP 与关节 HUD -->
      <div v-if="!loadError" class="tcp-hud">
        <div class="hud-line">
          <span class="hud-tag">TCP</span>
          <span>
            X {{ activeTcpPose.x.toFixed(1) }} · Y {{ activeTcpPose.y.toFixed(1) }} · Z
            {{ activeTcpPose.z.toFixed(1) }} mm
          </span>
        </div>
        <div class="hud-hint">左键旋转 · 右键平移 · 滚轮缩放</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.viewport-3d-shell {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #09101f;
  overflow: hidden;
  box-sizing: border-box;
}

.viewport-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  padding: 6px 10px;
  background: #10192d;
  border-bottom: 1px solid #1e293b;
  flex-shrink: 0;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.vp-title {
  font-size: 0.78rem;
  font-weight: 700;
  color: #e2e8f0;
}

.stream-badge {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  background: #334155;
  color: #cbd5e1;
}

.stream-badge.live {
  background: #0c4a6e;
  color: #7dd3fc;
}

.sim-pill {
  font-size: 0.68rem;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 4px;
  background: #1e293b;
  color: #94a3b8;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.sim-pill.online {
  background: #064e3b;
  color: #6ee7b7;
}

.sim-pill.fault {
  background: #7f1d1d;
  color: #fecaca;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.vp-check {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.72rem;
  color: #cbd5e1;
  cursor: pointer;
}

.vp-btn {
  background: #1e293b;
  border: 1px solid #334155;
  color: #cbd5e1;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 4px;
  cursor: pointer;
}

.vp-btn:hover {
  border-color: #38bdf8;
  color: #f8fafc;
}

.vp-btn.accent {
  background: #0f2942;
  border-color: #0284c7;
  color: #7dd3fc;
}

.canvas-host {
  position: relative;
  flex: 1;
  width: 100%;
  height: 100%;
  min-height: 180px;
  overflow: hidden;
}

.vp-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(9, 16, 31, 0.85);
  color: #cbd5e1;
  font-size: 0.85rem;
  z-index: 4;
}

.vp-overlay.error {
  color: #fca5a5;
}

.tcp-hud {
  position: absolute;
  left: 10px;
  bottom: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 5px 9px;
  border-radius: 5px;
  background: rgba(15, 23, 42, 0.78);
  border: 1px solid rgba(51, 65, 85, 0.8);
  pointer-events: none;
  font-size: 0.72rem;
  color: #e2e8f0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.hud-line {
  display: flex;
  align-items: center;
  gap: 6px;
}

.hud-tag {
  font-weight: 700;
  color: #38bdf8;
}

.hud-hint {
  font-size: 0.65rem;
  color: #94a3b8;
  font-family: inherit;
}
</style>
