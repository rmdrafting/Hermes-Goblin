@echo off
setlocal
cd /d "%~dp0"
if defined HERMES_HOME (
 set "goblin_home=%HERMES_HOME%"
) else (
 set "goblin_home=%USERPROFILE%\.hermes"
)
set "goblin_dest=%goblin_home%\desktop-plugins\goblin-roleplay"
echo Installing Goblin Roleplay to:
echo "%goblin_dest%"
echo.
if not exist "goblin-roleplay\plugin.js" (
 echo Missing plugin.js. Extract the entire ZIP first.
 pause
 exit /b 1
)
if not exist "%goblin_dest%" mkdir "%goblin_dest%"
if errorlevel 1 (
 echo Could not create the plugin folder.
 pause
 exit /b 1
)
if exist "%goblin_dest%\plugin.js" (
 call :goblin_backup
 if errorlevel 1 exit /b 1
)
copy /b "goblin-roleplay\plugin.js" "%goblin_dest%\plugin.js" >nul
if errorlevel 1 (
 echo Copy failed.
 pause
 exit /b 1
)
echo Installed. In Hermes, open Capabilities - Plugins and enable Goblin Roleplay.
echo If missing, use Reload desktop plugins in the command palette or restart Hermes.
echo If your app uses a different plugin location, see README.md.
pause

exit /b 0
:goblin_backup
set "goblin_backup_file=%goblin_dest%\plugin.js.backup-%RANDOM%-%RANDOM%"
if exist "%goblin_backup_file%" goto goblin_backup
copy /b "%goblin_dest%\plugin.js" "%goblin_backup_file%" >nul
exit /b %ERRORLEVEL%
