@echo off
echo ========================================================
echo  Starting SentiLens Sentiment Analytics Application
echo ========================================================
echo.

echo [1/2] Starting FastAPI Backend on http://localhost:8000 ...
start "SentiLens Backend" powershell -NoExit -Command "cd '%~dp0'; .\backend\.venv\Scripts\uvicorn.exe backend.main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/2] Starting React Frontend on http://localhost:5173 ...
start "SentiLens Frontend" powershell -NoExit -Command "cd '%~dp0frontend'; npm run dev"

echo.
echo ========================================================
echo  SentiLens is starting up!
echo  - Frontend:   http://localhost:5173
echo  - Backend:    http://localhost:8000
echo  - API Docs:   http://localhost:8000/docs
echo ========================================================
