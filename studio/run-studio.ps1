# Manhwa Recap Studio — PowerShell Local Development Runner
$ErrorActionPreference = "Stop"
$StudioDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Set-Location $StudioDir
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  Starting Manhwa Recap Studio (Express API + Vite HMR)..." -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

node "$StudioDir\scripts\dev-runner.js" $args
