# Bass 1.1 独立免源码运行包 (`runtime/`)

本目录包含 **Bass 1.1** 运行所需的全部预编译二进制、`mujoco.dll` 动态库、集成 3D 视窗的单页前端界面与机器人工作站实例，**可整体复制到任意 Windows x64 机器开箱运行，无需 `src/` 源码、Rust、Node.js，默认模式甚至无需安装 Python**。

---

## 目录说明

- `启动Bass.bat` / `start_bass.ps1`：一键启动器（支持 `-NoBrowser`、`-HttpPort`、`-ExternalSim`、`-StudioWeb`、`-Headless`）
- `bin/bass-runtime.exe`：预编译 Rust 控制器（任务调度/gRPC 网关 + 2ms 实时运动引擎 + C FFI 内置 MuJoCo 4.0.1 闭环 + 编译器/解释器）
- `bin/mujoco.dll`：随包提供的 MuJoCo 4.0.1 原生物理引擎动态库
- `web/`：编译后的 Vue 3 + Connect-Web + Three.js 单页浏览器示教与 3D 仿真工作台
- `sim/` & `requirements.txt`：可选 Python 外部 UDP 仿真节点（`mujoco_plant.py`、`chain_mjcf.py`，仅 `-ExternalSim` / `-StudioWeb` 需要）
- `instances/default_cell/`：机器人配置 (`config/robot_model.json`)、UR5e 三维网格资产 (`models/ur5e/`)、示例程序 (`MoveSquare.rhai` / `PickAndPlace.rhai`) 及运行日志 (`logs/`)

---

## 快速使用

### 1. 默认单进程模式（推荐 · 桌面仿真 / 零外部依赖）

> [!NOTE]
> 默认 `--plant-mode ffi` 将控制器、网关与 `mujoco.dll` 合并在单进程内以降低使用门槛，**适合桌面仿真与开发验证**；若需故障隔离调试（如防止仿真侧异常拖垮控制器核心），请使用下方的外部独立进程模式（`-ExternalSim` / `--plant-mode udp`），真实工业产线则应采用进程/硬件级故障隔离与独立安全链路。

- **双击运行**：双击 `启动Bass.bat`。
- **命令行参数**：
  ```powershell
  .\start_bass.ps1                         # 默认：单进程 FFI 物理闭环 + 自动打开浏览器工作台
  .\start_bass.ps1 -NoBrowser -HttpPort 8080 # 自定义端口且不自动弹出浏览器
  ```

启动后访问 **`http://127.0.0.1:8080`**（页面右侧常驻 **3D UR5e 实时仿真视窗**，由 `MotionService` 40Hz 遥测流直驱）：

1. 在顶部切换 **`AUTO`** -> 点击 **`DRIVES ON`** 上电；
2. 选择 `MoveSquare.rhai` 或 `PickAndPlace.rhai` -> 点击 **`▶ RUN`**（连续运行需处于 `AUTO`）或在 `MANUAL` 模式下点击 **`⏭ STEP`** 单步执行；
3. 可随时在示教区点动测试、切换视角或放大全屏 3D 视窗。

### 2. 可选：外部 Python MuJoCo + Studio 模式（开发调试用）

如需挂接 Python 物理调试或 MuJoCo Studio WebViewer，请确保已安装 **Python 3.11+** 并执行 `pip install -r requirements.txt`，再运行：

```powershell
.\start_bass.ps1 -ExternalSim          # 外部 Python 桌面 3D 视窗 + UDP 总线
.\start_bass.ps1 -StudioWeb            # 外部 Python MuJoCo Studio WebViewer (:8090) + UDP 总线
.\start_bass.ps1 -ExternalSim -Headless # 外部 Python 无头进程 + UDP 总线
```

---

欢迎直接在 `instances/default_cell/programs/` 增改 `.rhai` 脚本或调整 `config/robot_model.json` 进行定制与测试！
