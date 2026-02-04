@echo off
echo.
echo ============================================
echo  Previewing Production Build
echo ============================================
echo.
echo Make sure you've run 'build.bat' first!
echo.
echo The production app will be available at:
echo   http://localhost:4173
echo.
echo The browser should open automatically.
echo If not, manually open the URL above.
echo.
echo Press Ctrl+C to stop the server.
echo.
echo ============================================
echo.

npm run preview
