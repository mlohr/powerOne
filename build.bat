@echo off
echo.
echo ============================================
echo  Building for Production
echo ============================================
echo.
echo Creating optimized production build...
echo This may take 30-60 seconds.
echo.

npm run build

if %errorlevel% neq 0 (
    echo.
    echo ============================================
    echo  ERROR: Build failed!
    echo ============================================
    echo.
    echo Please check the error messages above.
    echo Common issues:
    echo  - TypeScript compilation errors
    echo  - ESLint errors
    echo  - Missing dependencies (run install.bat)
    echo.
    pause
    exit /b %errorlevel%
)

echo.
echo ============================================
echo  Build Complete!
echo ============================================
echo.
echo Production files have been created in the 'dist' folder.
echo.
echo To test the production build locally:
echo   Run 'preview.bat'
echo.
echo To deploy:
echo   Upload the contents of the 'dist' folder to your web server.
echo.
pause
