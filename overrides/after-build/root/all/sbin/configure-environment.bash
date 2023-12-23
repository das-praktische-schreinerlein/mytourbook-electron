#!/bin/bash
MYSCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

CONFIG_BASEDIR=../../../config/
MYCMS=${MYSCRIPTPATH}/../mycms-electron-app-win32-x64/resources/app-backend/
MYMM=${MYCMS}
MYTB=${MYCMS}
MYTBTOOLS=${MYSCRIPTPATH}
LIRETOOLS=/cygdrive/f/Projekte/liretools/

OSMDIR=F:/playground/osm-poi-geojson
W_OSMDIR="..\..\..\filestore\osm-poi-geojson"

DIGIFOTOS_BASEDIR=../../../filestore/Bilder/digifotos/
VIDEOS_BASEDIR=../../../filestore/Bilder/Videos/
EXPORT_BASEDIR=../../../filestore/export/
MYTB_IMPORT_MEDIADIR=../../../filestore/mytbbase/
MYTB_MEDIADIR=../../../filestore/mytbmediabase/
MYTB_INDEXDIR=../../../filestore/mytbindex/
MYTB_INDEXSRC_MEDIADIR=${MYTB_MEDIADIR}pics_x100/

W_CONFIG_BASEDIR="..\\..\\..\\config\\"
W_MYCMS="..\\mycms-electron-app-win32-x64\\resources\\app-backend\\"
W_MYMM=${W_MYCMS}
W_MYTB=${W_MYCMS}
W_MYTBTOOLS="..\\..\\..\\sbin\\"
W_LIREOOLS="F:\\Projekte\\liretools\\"

W_DIGIFOTOS_BASEDIR="..\\..\\..\\filestore\\Bilder\\digifotos\\"
W_VIDEOS_BASEDIR="..\\..\\..\\filestore\\Bilder\\Videos\\"
W_EXPORT_BASEDIR="..\\..\\..\\filestore\\export\\"
W_MYTB_IMPORT_MEDIADIR="..\\..\\..\\filestore\\mytbbase\\"
W_MYTB_MEDIADIR="..\\..\\..\\filestore\\mytbmediabase\\"
W_MYTB_INDEXDIR="..\\..\\..\\filestore\\mytbindex\\"
W_MYTB_INDEXSRC_MEDIADIR="${W_MYTB_MEDIADIR}pics_x100\\"

SOLR_PORT=9999
SOLR_JETTY_HOST=127.0.0.1
SOLR_HOST=127.0.0.1
SOLR_OPTS=-Dsolr.jetty.request.header.size=65535
START_ADMINSERVER=true

AUTOSTARTIMPORT=false
AUTOSTARTEXPORT=true
