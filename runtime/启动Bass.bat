@echo off
chcp 65001 >nul
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start_bass.ps1" %*
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [错误] Bass 1.0 启动失败或异常退出，错误码: %ERRORLEVEL%
    pause
)
