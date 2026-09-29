@echo off
title AlphaSelector India - StockPicking App
echo ==========================================================
echo   AlphaSelector India - 1-Click Local Launcher
echo   Created by Diwakar Sharma (@diwakar2k)
echo ==========================================================
echo.

:: 1. Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Node.js is not found on your computer.
    echo.
    echo Node.js is required to run the app locally.
    echo Please download and install the free LTS version from:
    echo   https://nodejs.org/
    echo.
    echo After installing Node.js, simply double-click this file again!
    echo.
    pause
    exit /b 1
)

:: 2. Install dependencies on first run
if not exist "node_modules" (
    echo [1/2] Installing required components for first-time use...
    echo       This may take about 1 minute depending on internet speed.
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Installation failed. Please check your internet connection.
        pause
        exit /b 1
    )
    echo.
)

:: 3. Launch browser and development server
echo [2/2] Starting local app server...
echo.
echo Opening browser at http://localhost:5173/ ...
echo (Keep this window open while using the app. Press Ctrl+C to stop.)
echo.

start http://localhost:5173/
call npm run dev

pause
