<#
.SYNOPSIS
    Bass 1.1 独立一体化系统一键启动脚本 (自包含便携版)

.DESCRIPTION
    默认采用单进程内置 MuJoCo 4.0.1 C FFI 物理仿真架构：只启动 Rust bass-runtime.exe
    (内置实时运动引擎 + MuJoCo 4.0.1 DLL + gRPC/gRPC-Web 网关)，并通过单一网页端呈现
    集成 Three.js 3D 机械臂视窗的纯浏览器示教工作台。
    如需连接外部 Python MuJoCo 独立物理进程进行高级调试，可传入 -ExternalSim 或 -StudioWeb。
    按 Ctrl+C 可安全终止全部进程。

.PARAMETER ExternalSim
    改用 UDP 现场总线模式启动外部 Python MuJoCo 4.0.1 独立物理进程（兼容调试）。

.PARAMETER Headless
    在 -ExternalSim 模式下以无头模式运行外部 MuJoCo 进程（默认 FFI 模式无需额外视窗）。

.PARAMETER StudioWeb
    自动切换到 -ExternalSim 模式并启用 MuJoCo 4.0.1 Studio WebViewer 浏览器 3D 视窗（默认 :8090）。

.PARAMETER ViewerPort
    Studio WebViewer 监听端口（默认 8090，仅 -StudioWeb 生效）。

.PARAMETER NoBrowser
    启动完成后不自动打开默认浏览器。

.PARAMETER HttpPort
    Axum Web 网关监听的 HTTP 端口（默认 8080）。
#>

[CmdletBinding()]
param(
    [switch]$ExternalSim,
    [switch]$Headless,
    [switch]$StudioWeb,
    [int]$ViewerPort = 8090,
    [switch]$NoBrowser,
    [int]$HttpPort = 8080
)

$ErrorActionPreference = "Stop"

$AppRoot = $PSScriptRoot
$RuntimeExe = Join-Path $AppRoot "bin\bass-runtime.exe"
$MujocoDll = Join-Path $AppRoot "bin\mujoco.dll"
$WebDir = Join-Path $AppRoot "web"
$SimScript = Join-Path $AppRoot "sim\mujoco_plant.py"
$InstanceDir = Join-Path $AppRoot "instances\default_cell"
$ModelJson = Join-Path $InstanceDir "config\robot_model.json"

function Test-TcpPortAvailable {
    param([int]$Port)
    $listener = $null
    try {
        $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $Port)
        $listener.Server.ExclusiveAddressUse = $true
        $listener.Start()
        return $true
    } catch {
        return $false
    } finally {
        if ($listener) {
            try { $listener.Stop() } catch {}
        }
    }
}

function Find-FreeTcpPort {
    foreach ($candidate in @(18080, 28080, 38080, 8081, 8088, 18888)) {
        if (Test-TcpPortAvailable -Port $candidate) {
            return $candidate
        }
    }
    $listener = $null
    try {
        $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 0)
        $listener.Start()
        return ([System.Net.IPEndPoint]$listener.LocalEndpoint).Port
    } finally {
        if ($listener) {
            try { $listener.Stop() } catch {}
        }
    }
}

$ExplicitHttpPort = $PSBoundParameters.ContainsKey('HttpPort')
if (-not (Test-TcpPortAvailable -Port $HttpPort)) {
    if ($ExplicitHttpPort) {
        Write-Error "指定端口 $HttpPort 已被占用或受系统保留限制 (WSAEACCES)，请更换其他 -HttpPort（例如 -HttpPort 18080）。"
        exit 1
    }
    $fallbackPort = Find-FreeTcpPort
    Write-Host "⚠️ 默认端口 $HttpPort 已被其他进程占用或受系统权限限制，已自动切换至可用端口: $fallbackPort" -ForegroundColor Yellow
    $HttpPort = $fallbackPort
}

$UseUdpExternal = $ExternalSim -or $StudioWeb
$PlantModeLabel = if ($UseUdpExternal) {
    if ($StudioWeb) {
        "外部 Python MuJoCo 4.0.1 Studio Web (:$ViewerPort) + UDP"
    } elseif ($Headless) {
        "外部 Python MuJoCo 4.0.1 无头模式 + UDP"
    } else {
        "外部 Python MuJoCo 4.0.1 桌面视窗 + UDP"
    }
} else {
    "内置 MuJoCo 4.0.1 C FFI (单进程直驱 · 浏览器内嵌 3D 视窗)"
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " 🤖 Bass 1.1 一体化机器人控制器系统 (UR5e + MuJoCo 4.0.1)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "根目录:       $AppRoot" -ForegroundColor Gray
Write-Host "工作站实例:   $InstanceDir" -ForegroundColor Gray
Write-Host "模型配置:     $ModelJson" -ForegroundColor Gray
Write-Host "Web 端口:     $HttpPort" -ForegroundColor Gray
Write-Host "物理引擎模式: $PlantModeLabel" -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. 完整性检查
if (-not (Test-Path $RuntimeExe)) {
    Write-Error "未找到控制器核心二进制: $RuntimeExe"
    exit 1
}
if (-not $UseUdpExternal -and -not (Test-Path $MujocoDll)) {
    Write-Error "未找到内置 MuJoCo 4.0.1 动态库: $MujocoDll"
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

$plantProcess = $null
$runtimeProcess = $null

if ($UseUdpExternal) {
    # 检查 Python (>= 3.11) 与 MuJoCo 4.0.1 环境
    try {
        $pyOk = & python -c "import sys; print('OK' if sys.version_info >= (3, 11) else f'OLD:{sys.version_info.major}.{sys.version_info.minor}')" 2>$null
        if (-not $pyOk) {
            throw "未找到可用 Python"
        }
        if ($pyOk.StartsWith("OLD:")) {
            throw "当前 Python 版本 ($($pyOk.Substring(4))) 过低，MuJoCo 4.0.1 需要 Python 3.11+"
        }
    } catch {
        Write-Error "Python 环境校验失败: $_"
        exit 1
    }

    Write-Host "🚀 正在启动外部 MuJoCo 4.0.1 物理仿真进程 (UDP :25000)..." -ForegroundColor Cyan
    $plantArgs = @(
        $SimScript,
        "--bind-port", "25000",
        "--controller-addr", "127.0.0.1:25001",
        "--model-path", "`"$ModelJson`"",
        "--cycle-ms", "2.0"
    )
    if ($Headless) {
        $plantArgs += "--headless"
    } elseif ($StudioWeb) {
        $plantArgs += @("--viewer-mode", "studio-web", "--viewer-port", "$ViewerPort")
    }

    $plantPsi = New-Object System.Diagnostics.ProcessStartInfo
    $plantPsi.FileName = "python"
    $plantPsi.Arguments = $plantArgs -join " "
    $plantPsi.WorkingDirectory = $AppRoot
    $plantPsi.UseShellExecute = $false
    $plantProcess = [System.Diagnostics.Process]::Start($plantPsi)
    if (-not $plantProcess) {
        Write-Error "启动外部 MuJoCo 物理进程失败！"
        exit 1
    }
}

# 2. 启动 Rust bass-runtime 软控制器进程
if ($UseUdpExternal) {
    Write-Host "⚡ 正在启动 Rust bass-runtime (UDP 现场总线 + 2ms 实时运动引擎)..." -ForegroundColor Cyan
    $runtimeArgs = @(
        "--plant-mode", "udp",
        "--instance", "`"$InstanceDir`"",
        "--web-dir", "`"$WebDir`"",
        "--http-port", "$HttpPort",
        "--udp-bind", "127.0.0.1:25001",
        "--udp-remote", "127.0.0.1:25000"
    )
} else {
    Write-Host "⚡ 正在启动 Rust bass-runtime (内置 MuJoCo 4.0.1 C FFI + 2ms 实时运动引擎)..." -ForegroundColor Cyan
    $runtimeArgs = @(
        "--plant-mode", "ffi",
        "--mujoco-lib", "`"$MujocoDll`"",
        "--instance", "`"$InstanceDir`"",
        "--web-dir", "`"$WebDir`"",
        "--http-port", "$HttpPort"
    )
}

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
    # 3. 等待 HTTP / gRPC-Web 网关就绪
    Write-Host "⏳ 等待单页 Web 示教工作台就绪 (http://127.0.0.1:$HttpPort)..." -ForegroundColor Yellow
    $gatewayReady = $false
    $timeoutSec = 15
    $sw = [System.Diagnostics.Stopwatch]::StartNew()

    while ($sw.Elapsed.TotalSeconds -lt $timeoutSec) {
        if ($runtimeProcess.HasExited) {
            throw "bass-runtime 控制器意外提前退出！"
        }
        if ($plantProcess -and $plantProcess.HasExited) {
            throw "外部 MuJoCo 物理进程意外提前退出！"
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

    Write-Host "🎉 Bass 1.1 系统就绪！" -ForegroundColor Green
    Write-Host "   - 单页示教工作台: http://127.0.0.1:$HttpPort" -ForegroundColor Cyan
    if ($UseUdpExternal -and $StudioWeb) {
        Write-Host "   - Studio 3D 网页: http://localhost:$ViewerPort/" -ForegroundColor Cyan
    }
    Write-Host "提示：按 Ctrl+C 可停止全部运行进程。" -ForegroundColor Yellow

    # 4. 打开默认浏览器
    if (-not $NoBrowser) {
        Write-Host "🌐 正在打开浏览器加载 Bass 1.1 示教与 3D 视窗工作台..." -ForegroundColor Cyan
        Start-Process "http://127.0.0.1:$HttpPort"
    }

    # 5. 持续保持前台监控
    while (-not $runtimeProcess.HasExited -and (-not $plantProcess -or -not $plantProcess.HasExited)) {
        Start-Sleep -Milliseconds 500
    }
}
finally {
    Write-Host "`n🛑 正在停止 Bass 1.1 运行进程..." -ForegroundColor Yellow
    if ($plantProcess -and -not $plantProcess.HasExited) {
        try {
            $plantProcess.Kill()
            Write-Host "  - 外部 MuJoCo 物理进程已停止" -ForegroundColor Gray
        } catch {}
    }
    if ($runtimeProcess -and -not $runtimeProcess.HasExited) {
        try {
            $runtimeProcess.Kill()
            Write-Host "  - bass-runtime 控制器已停止" -ForegroundColor Gray
        } catch {}
    }
    Write-Host "✅ 全部进程已安全清理退出。" -ForegroundColor Green
}
