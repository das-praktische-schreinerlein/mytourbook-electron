SET SCRIPTPATH=%~dp0
SET CWD=%cd%

call %SCRIPTPATH%configure-environment.cmd

cd %MYCMS%\..\..\
call mycms-electron-app.exe --mode cli --environment dev %*%
cd %CWD%

