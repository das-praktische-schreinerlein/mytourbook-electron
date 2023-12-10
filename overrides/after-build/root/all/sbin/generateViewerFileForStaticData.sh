#!/bin/bash
# exit on error
set -e
CWD=$(pwd)
SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
function dofail {
    cd $CWD
    printf '%s\n' "$1" >&2  ## Send message to stderr. Exclude >&2 if you don't want it that way.
    exit "${2-1}"  ## Return a code specified by $2 or 1 by default.
}

# check parameters
if [ "$#" -lt 2 ]; then
    dofail "USAGE: generateViewerFileForStaticData.sh EXPORTDIR EXPORTNAME\nFATAL: requires EXPORTDIR EXPORTNAME as parameters 'import-XXXX'" 1
    exit 1
fi
EXPORTDIR=$1
EXPORTNAME=$2

source ${SCRIPTPATH}/configure-environment.bash

VIEWERSRC=${SCRIPTPATH}/../dist/static/myshpviewer/de/index.viewer.full.html

if [ ! -d "${EXPORTDIR}" ]; then
    dofail "USAGE: generateViewerFileForStaticData.sh EXPORTDIR\nFATAL: $EXPORTDIR must exists" 1
    exit 1
fi

echo "start - generate ${EXPORTDIR}/${EXPORTNAME}.html"
cd ${MYCMS}
node dist/backend/serverAdmin.js\
     --adminclibackend ${CONFIG_BASEDIR}adminCli.dev.json\
     --backend ${CONFIG_BASEDIR}backend.dev.json\
     --command mediaManager\
     --action generateHtmlViewerFileForExport\
     --createViewer html\
     --exportName ${EXPORTNAME}\
     --exportDir ${EXPORTDIR}\
     --srcFile ${VIEWERSRC}\
     --debug 1

echo "inline all ${EXPORTDIR}/${EXPORTNAME}.html"
node dist/backend/serverAdmin.js\
     --adminclibackend ${CONFIG_BASEDIR}adminCli.dev.json\
     --backend ${CONFIG_BASEDIR}backend.dev.json\
     --command mediaManager\
     --action inlineDataOnViewerFile\
     --srcFile ${EXPORTDIR}/${EXPORTNAME}.html\
     --debug 1
cd ${CWD}

echo "done - generate ${EXPORTDIR}/${EXPORTNAME}.html"
