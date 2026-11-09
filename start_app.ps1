# SentiLens One-Click Startup Script for PowerShell
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " Starting SentiLens Sentiment Analytics Application" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$repoRoot = $PSScriptRoot

Write-Host "[1/2] Starting FastAPI Backend on http://localhost:8000 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$repoRoot'; .\backend\.venv\Scripts\uvicorn.exe backend.main:app --host 0.0.0.0 --port 8000 --reload"

Write-Host "[2/2] Starting React Frontend on http://localhost:5173 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$repoRoot\frontend'; npm run dev"

Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host " SentiLens is starting up!" -ForegroundColor Green
Write-Host " - Frontend:   http://localhost:5173" -ForegroundColor White
Write-Host " - Backend:    http://localhost:8000" -ForegroundColor White
Write-Host " - API Docs:   http://localhost:8000/docs" -ForegroundColor White
Write-Host "========================================================" -ForegroundColor Green
