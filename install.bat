@echo off
echo.
echo ============================================
echo  Installing Dependencies
echo ============================================
echo.
echo This will download all required packages...
echo Please wait, this may take 2-5 minutes.
echo.

npm install

if %errorlevel% neq 0 (
    echo.
    echo ============================================
    echo  ERROR: Installation failed!
    echo ============================================
    echo.
    echo Please check the error messages above.
    echo Common issues:
    echo  - Node.js or npm not installed
    echo  - Network connection problems
    echo  - Insufficient disk space
    echo.
    pause
    exit /b %errorlevel%
)

echo.
echo ============================================
echo  Installation Complete!
echo ============================================
echo.
echo All dependencies have been installed.
echo You can now run 'dev.bat' to start the app.
echo.
pause
