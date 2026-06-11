@echo off
echo ========================================
echo   GRID-INDIA CLM Platform - Backend
echo ========================================
echo.

IF NOT EXIST ".env" (
    echo WARNING: .env file not found!
    echo Please copy .env.example to .env and configure it.
    echo.
    copy .env.example .env
    echo Created .env from template. Please edit it before running again.
    pause
    exit /b 1
)

echo Starting GRID-INDIA CLM Backend...
echo.

REM Create uploads directory if not exists
IF NOT EXIST "uploads" mkdir uploads

REM Run Flask development server
set FLASK_APP=run.py
set FLASK_ENV=development
python run.py

pause