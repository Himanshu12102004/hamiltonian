:: File: setup.bat
@echo off
setlocal enabledelayedexpansion

echo 🔧 Setting up repository for Windows...

:: Check if Git is installed
where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Git is not installed or not in PATH
    exit /b 1
)

:: Create hooks directory
if not exist .git\hooks mkdir .git\hooks

:: Create post-merge hook
(
    echo #!/bin/bash
    echo.
    echo # Platform detection and setup
    echo platform='windows'
    echo.
    echo echo "🔄 Configuring git for Windows..."
    echo.
    echo # Set Windows-specific git configs
    echo git config core.autocrlf true
    echo git config merge.ours.driver true
    echo.
    echo # Verify .gitattributes
    echo if [ ! -f .gitattributes ]; then
    echo     echo "# Git attributes for cross-platform compatibility" ^> .gitattributes
    echo     echo "* text=auto" ^>^> .gitattributes
    echo     echo "README.md merge=ours" ^>^> .gitattributes
    echo     echo "*.sh text eol=lf" ^>^> .gitattributes
    echo     echo "*.bat text eol=crlf" ^>^> .gitattributes
    echo     echo "✅ Created .gitattributes file"
    echo fi
    echo.
    echo echo "✅ Repository configured for Windows"
) > .git\hooks\post-merge

:: Set git configurations
git config merge.ours.driver true
git config core.autocrlf true

echo ✅ Setup completed successfully