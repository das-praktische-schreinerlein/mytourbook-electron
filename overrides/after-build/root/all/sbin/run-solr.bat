SET SCRIPTPATH=%~dp0
SET CWD=%cd%

call %SCRIPTPATH%configure-environment.cmd

cd %SCRIPTPATH%
cd %MYCMS%
echo *****************************************************************
echo start solr
echo *****************************************************************

set CMD=..\..\..\contrib\solr\bin\solr.cmd start -V -f -q -p %SOLR_PORT%
echo start solr "%CMD%"
%CMD%
cd %CWD%

