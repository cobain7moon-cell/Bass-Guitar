# Bass 1.0 独立免源码运行包 (`runtime/`)

本目录包含 **Bass 1.0** 运行所需的全部预编译二进制、前端界面、物理仿真脚本与机器人工作站实例，**可整体复制到任意 Windows x64 机器独立运行，无需 `src/` 源码、Rust 或 Node.js 环境**。

---

## 目录说明

- `启动Bass.bat` / `start_bass.ps1`：一键启动器（支持 `-Headless`、`-NoBrowser`、`-HttpPort`）
- `requirements.txt`：Python 物理仿真依赖（`mujoco>=4.0.0`、`numpy>=1.24`）
- `bin/bass-runtime.exe`：预编译 Rust 控制器（任务调度/gRPC 服务端 + 解耦运动内核 + 编译器/解释器）
- `web/`：编译后的 Vue 3 + Connect-Web 浏览器示教器
- `sim/`：`mujoco_plant.py`、`chain_mjcf.py`（MuJoCo 4.0 UR5e 物理闭环进程）
- `instances/default_cell/`：机器人配置 (`config/robot_model.json`)、3D 模型 (`models/ur5e/`)、示例程序 (`MoveSquare.rhai` / `PickAndPlace.rhai`) 及运行日志 (`logs/`)

---

## 快速使用

### 1. 安装 MuJoCo 环境（必选）

> [!IMPORTANT]
> 本包已内置控制内核与 Web UI，但 **3D 物理环境与实时力学反馈依赖 Python `mujoco`**；未安装将无法弹出物理视窗并导致驱动无法上电。

确认已安装 **Python 3.10+** 后在本目录运行：

```powershell
pip install -r requirements.txt
python -c "import mujoco, numpy; print('MuJoCo:', mujoco.__version__, 'NumPy:', numpy.__version__)"
```

### 2. 启动运行

- **双击运行（推荐）**：双击 `启动Bass.bat`。
- **命令行参数**：
  ```powershell
  .\start_bass.ps1                           # 默认：3D 物理视窗 + 自动打开浏览器
  .\start_bass.ps1 -Headless                 # 无头模式（无 3D 视窗）
  .\start_bass.ps1 -NoBrowser -HttpPort 8080 # 自定义端口且不自动弹出浏览器
  ```

启动后访问 **`http://127.0.0.1:8080`**：切换模式为 **`AUTO`** -> 点击 **`DRIVES ON`** 上电 -> 选择 `MoveSquare.rhai` 或 `PickAndPlace.rhai` -> 点击 **`▶ RUN`** 或 **`⏭ STEP`**，即可观察代码行指针 `▶` 与 3D 机械臂实时联动。

---

欢迎直接在 `instances/default_cell/programs/` 增改 `.rhai` 脚本或调整 `config/robot_model.json` 进行定制与测试！
