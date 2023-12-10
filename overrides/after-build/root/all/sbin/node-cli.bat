SET SCRIPTPATH=%~dp0
SET CWD=%cd%

call %SCRIPTPATH%configure-environment.cmd

SET ELECTRON_RUN_AS_NODE=true
call %MYCMS%\..\..\mycms-electron-app.exe %*%
cd %CWD%

