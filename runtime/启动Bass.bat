@echo off
chcp 65001 >nul
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start_bass.ps1" %*
if errorlevel 1 goto :fail
goto :eof

:fail
echo.
echo [错误] Bass 1.1 启动失败，请检查上方报错日志。
if "%BASS_NOPAUSE%"=="" pause
exit /b 1
