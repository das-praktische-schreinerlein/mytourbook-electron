SET SCRIPTPATH=%~dp0
SET CWD=%cd%

call %SCRIPTPATH%configure-environment.cmd

cd %MYCMS%\..\..\
call %SCRIPTPATH%\cli-dev.bat --preparedCommand prepareAppEnv
call mycms-electron-app.exe --environment dev
cd %CWD%

