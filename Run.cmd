@echo off
REM Sets the title of the main command window
title NeuroDetect Dev Servers (Backend & Frontend)

REM Sets the text color of this window to white
color 07

echo.
echo =================================================================
echo    Starting Backend (Blue) and Frontend (Green) Servers...
echo    Press Ctrl+C to stop both servers at any time.
echo =================================================================
echo.

REM This command requires 'concurrently' to be installed globally.
REM You can install it by running: npm install -g concurrently

REM The command below uses 'concurrently' to run both the backend and frontend commands.
REM It now activates the venv in the Backend before starting the server.
concurrently --names "BACKEND,FRONTEND" -c "blue,green" "cd Backend && venv\Scripts\activate && uvicorn app.main:app --host 127.0.0.1 --port 8000" "cd Frontend\brain-tumor-mri-frontend && npm run dev"

echo.
echo Servers have been stopped.
pause
