@echo off
title Exact Jathagam - Localhost Launcher
echo ========================================================
echo       துல்லிய ஜாதகம் — Exact Jathagam Localhost
echo ========================================================
echo.
echo [1/2] Starting Python Thirukanitham API Server (Port 8000)...
start "Thirukanitham API (Port 8000)" .\python_runtime\python.exe -m thirukanitham_engine.api_server
timeout /t 2 >nul

echo [2/2] Starting Web Frontend Server (Port 8080)...
start "Exact Jathagam Web (Port 8080)" .\python_runtime\python.exe -m http.server 8080
timeout /t 1 >nul

echo.
echo ========================================================
echo   Web Application: http://localhost:8080/
echo   API Health:      http://localhost:8000/health
echo ========================================================
echo.
echo Opening default browser at http://localhost:8080/...
start http://localhost:8080/
echo.
pause
