
@echo off
echo Starting Fantasy RPG...
echo.

:: Check if the portable Node.js is already included
if not exist "node-portable\" (
  echo Setting up portable environment for first launch...
  echo This might take a few minutes, please be patient.
  echo.
  
  :: Create directories
  mkdir node-portable 2>nul
  
  :: Download portable Node.js
  echo Downloading portable Node.js...
  powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://nodejs.org/dist/v18.16.0/node-v18.16.0-win-x64.zip' -OutFile 'node-temp.zip'}"
  
  :: Extract Node.js
  echo Extracting Node.js...
  powershell -Command "& {Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::ExtractToDirectory('node-temp.zip', 'node-extract')}"
  
  :: Move to correct location
  xcopy /E /I node-extract\node-v18.16.0-win-x64\* node-portable\
  
  :: Clean up
  rmdir /S /Q node-extract
  del node-temp.zip
  
  echo Portable environment set up successfully!
  echo.
)

echo Starting the game...
echo.

:: Set PATH to use portable Node.js
set PATH=%~dp0node-portable;%PATH%

:: Check if node_modules exists, install if not
if not exist "node_modules\" (
  echo Installing game dependencies...
  call node-portable\npm.cmd install
)

:: Start the game
call node-portable\npm.cmd run dev

pause
