@echo off
setlocal
title Manhwa Recap Studio - Fast Compile Wizard
cd /d "%~dp0"

echo ===================================================
echo   Manhwa Recap Studio - Fast Compile Wizard
echo ===================================================

node studio/scripts/fast-compile.mjs %*

echo.
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Fast Compile exited with code %ERRORLEVEL%.
) else (
    echo [DONE] Fast Compile finished cleanly.
)
pause
