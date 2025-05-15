
@echo off
echo Willkommen beim Fantasy-RPG!
echo Das Spiel wird gestartet...
echo.
echo Falls das Spiel nicht automatisch startet, besuche http://localhost:5173 in deinem Browser.
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js ist nicht installiert.
    echo Bitte installiere Node.js von https://nodejs.org/ und versuche es erneut.
    echo.
    pause
    exit /b 1
)

:: Install dependencies if needed
if not exist node_modules (
    echo Installiere Abhängigkeiten...
    npm install
)

:: Start the game
echo Starte Spiel...
npm run dev

pause
