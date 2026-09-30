@echo off
setlocal
title Manhwa Recap Studio — Local Development Runner
cd /d "%~dp0studio"

echo ===================================================
echo   Starting Manhwa Recap Studio (Express API + Vite HMR)...
echo ===================================================

node scripts/dev-runner.js %*

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Manhwa Recap Studio runner stopped with exit code %ERRORLEVEL%.
    pause
)
