@echo off
echo.
echo ============================================
echo  Running Code Quality Checks
echo ============================================
echo.
echo Checking for code quality issues...
echo.

npm run lint

if %errorlevel% neq 0 (
    echo.
    echo ============================================
    echo  Code Quality Issues Found
    echo ============================================
    echo.
    echo Please review the issues listed above.
    echo Fix them before committing your code.
    echo.
) else (
    echo.
    echo ============================================
    echo  All Good!
    echo ============================================
    echo.
    echo No code quality issues found.
    echo.
)

pause
