<#
.SYNOPSIS
    Bass 1.0 独立一体化系统一键启动脚本 (自包含便携版)

.DESCRIPTION
    同时启动 Python MuJoCo 4.0 UR5e 物理仿真进程与 Rust bass-runtime 实时控制器内核，
    在 Axum Web 网关就绪后自动启动默认浏览器打开 Vue 3 示教器。
    按 Ctrl+C 可一并安全终止全部进程。

.PARAMETER Headless
    以无头模式运行 MuJoCo 物理仿真（不打开 3D 渲染视窗，适合后台/测试）。

.PARAMETER NoBrowser
    启动完成后不自动打开默认浏览器。

.PARAMETER HttpPort
    Axum Web 网关监听的 HTTP 端口（默认 8080）。
#>

[CmdletBinding()]
param(
    [switch]$Headless,
    [switch]$NoBrowser,
    [int]$HttpPort = 8080
)

$ErrorActionPreference = "Stop"

$AppRoot = $PSScriptRoot
$RuntimeExe = Join-Path $AppRoot "bin\bass-runtime.exe"
$WebDir = Join-Path $AppRoot "web"
$SimScript = Join-Path $AppRoot "sim\mujoco_plant.py"
$InstanceDir = Join-Path $AppRoot "instances\default_cell"
$ModelJson = Join-Path $InstanceDir "config\robot_model.json"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " 🤖 Bass 1.0 极简机器人控制器系统 (UR5e + Pure Rust)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "根目录:       $AppRoot" -ForegroundColor Gray
Write-Host "工作站实例:   $InstanceDir" -ForegroundColor Gray
Write-Host "模型配置:     $ModelJson" -ForegroundColor Gray
Write-Host "Web 端口:     $HttpPort" -ForegroundColor Gray
Write-Host "物理视窗模式: $(if ($Headless) { '无头模式 (无 3D 视窗)' } else { '3D 视窗模式 (MuJoCo 4.0)' })" -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. 完整性检查
if (-not (Test-Path $RuntimeExe)) {
    Write-Error "未找到控制器核心二进制: $RuntimeExe"
    exit 1
}
if (-not (Test-Path (Join-Path $WebDir "index.html"))) {
    Write-Error "未找到 Web 示教器静态资源: $WebDir"
    exit 1
}
if (-not (Test-Path $ModelJson)) {
    Write-Error "未找到机械臂 JSON 模型配置: $ModelJson"
    exit 1
}

# 2. 检查 Python 环境与 MuJoCo
try {
    $pyVer = & python -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')" 2>$null
    if (-not $pyVer) {
        throw "未找到可用 Python"
    }
} catch {
    Write-Error "系统未安装 Python 或未加入 PATH 环境变量，无法启动 MuJoCo 物理仿真。"
    exit 1
}

# 3. 启动 MuJoCo 物理仿真独立进程
Write-Host "🚀 正在启动 MuJoCo 4.0 物理仿真进程 (UDP :25000)..." -ForegroundColor Cyan
$plantArgs = @(
    $SimScript,
    "--bind-port", "25000",
    "--controller-addr", "127.0.0.1:25001",
    "--model-path", "`"$ModelJson`"",
    "--cycle-ms", "2.0"
)
if ($Headless) {
    $plantArgs += "--headless"
}

$plantPsi = New-Object System.Diagnostics.ProcessStartInfo
$plantPsi.FileName = "python"
$plantPsi.Arguments = $plantArgs -join " "
$plantPsi.WorkingDirectory = $AppRoot
$plantPsi.UseShellExecute = $false
$plantProcess = [System.Diagnostics.Process]::Start($plantPsi)

if (-not $plantProcess) {
    Write-Error "启动 MuJoCo 物理进程失败！"
    exit 1
}

# 4. 启动 Rust bass-runtime 软控制器进程
Write-Host "⚡ 正在启动 Rust bass-runtime 实时控制内核 (2ms 实时时隙 / 500Hz)..." -ForegroundColor Cyan
$runtimeArgs = @(
    "--instance", "`"$InstanceDir`"",
    "--web-dir", "`"$WebDir`"",
    "--http-port", "$HttpPort",
    "--udp-bind", "127.0.0.1:25001",
    "--udp-remote", "127.0.0.1:25000"
)

$runtimePsi = New-Object System.Diagnostics.ProcessStartInfo
$runtimePsi.FileName = $RuntimeExe
$runtimePsi.Arguments = $runtimeArgs -join " "
$runtimePsi.WorkingDirectory = $AppRoot
$runtimePsi.UseShellExecute = $false
$runtimeProcess = [System.Diagnostics.Process]::Start($runtimePsi)

if (-not $runtimeProcess) {
    Write-Error "启动 bass-runtime 失败！"
    if ($plantProcess -and -not $plantProcess.HasExited) {
        $plantProcess.Kill()
    }
    exit 1
}

try {
    # 5. 等待 HTTP 网关就绪
    Write-Host "⏳ 等待 Web 示教器服务就绪 (http://127.0.0.1:$HttpPort)..." -ForegroundColor Yellow
    $gatewayReady = $false
    $timeoutSec = 15
    $sw = [System.Diagnostics.Stopwatch]::StartNew()

    while ($sw.Elapsed.TotalSeconds -lt $timeoutSec) {
        if ($runtimeProcess.HasExited) {
            throw "bass-runtime 控制器意外提前退出！"
        }
        if ($plantProcess.HasExited) {
            throw "MuJoCo 物理进程意外提前退出！"
        }

        try {
            $grpcBody = [byte[]](0, 0, 0, 0, 0)
            $resp = Invoke-WebRequest -Uri "http://127.0.0.1:$HttpPort/bass.controller.v1.ControllerService/GetState" `
                -Method Post -ContentType "application/grpc-web+proto" -Body $grpcBody -TimeoutSec 1 -UseBasicParsing -ErrorAction SilentlyContinue
            if ($resp -and $resp.StatusCode -eq 200) {
                $gatewayReady = $true
                break
            }
        }
        catch {
            # 持续轮询
        }
        Start-Sleep -Milliseconds 300
    }

    if (-not $gatewayReady) {
        throw "等待 Web 网关就绪超时 ($timeoutSec 秒)！"
    }

    Write-Host "🎉 Bass 1.0 系统就绪！" -ForegroundColor Green
    Write-Host "   - 示教器访问地址: http://127.0.0.1:$HttpPort" -ForegroundColor Cyan
    Write-Host "   - 实时总线通道:   127.0.0.1:25001 (内核) <-> 127.0.0.1:25000 (MuJoCo 4.0)" -ForegroundColor Gray
    Write-Host "提示：按 Ctrl+C 可停止全部运行进程。" -ForegroundColor Yellow

    # 6. 打开默认浏览器
    if (-not $NoBrowser) {
        Write-Host "🌐 正在打开浏览器加载 Vue 3 示教器..." -ForegroundColor Cyan
        Start-Process "http://127.0.0.1:$HttpPort"
    }

    # 7. 持续保持前台监控
    while (-not $plantProcess.HasExited -and -not $runtimeProcess.HasExited) {
        Start-Sleep -Milliseconds 500
    }
}
finally {
    Write-Host "`n🛑 正在停止 Bass 1.0 运行进程..." -ForegroundColor Yellow
    if ($plantProcess -and -not $plantProcess.HasExited) {
        try {
            $plantProcess.Kill()
            Write-Host "  - MuJoCo 物理仿真进程已停止" -ForegroundColor Gray
        } catch {}
    }
    if ($runtimeProcess -and -not $runtimeProcess.HasExited) {
        try {
            $runtimeProcess.Kill()
            Write-Host "  - bass-runtime 控制器内核已停止" -ForegroundColor Gray
        } catch {}
    }
    Write-Host "✅ 全部进程已安全清理退出。" -ForegroundColor Green
}
