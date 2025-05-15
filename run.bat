
@echo off
echo Starting Fantasy RPG...
echo.
echo This game requires Node.js and NPM to be installed.
echo.
echo Checking environment...

where npm >nul 2>nul
if %errorlevel% neq 0 (
  echo NPM is not installed or not in PATH. Please install Node.js from https://nodejs.org/
  goto end
)

echo Installing dependencies...
npm install
if %errorlevel% neq 0 (
  echo Failed to install dependencies.
  goto end
)

echo.
echo Starting game...
echo.
echo The game will open in your default web browser.
echo.

npm run dev
if %errorlevel% neq 0 (
  echo Failed to start the game.
  goto end
)

:end
pause
