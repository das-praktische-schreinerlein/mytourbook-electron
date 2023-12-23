SET MYSCRIPTPATH=%~dp0

set MYCMS=%MYSCRIPTPATH%\..\mycms-electron-app-win32-x64\resources\app-backend\
set CONFIG_BASEDIR=..\..\..\config\
set MYMM=%MYCMS%
set MYTB=%MYCMS%
set MYTBTOOLS=%MYSCRIPTPATH%
set LIRETOOLS=F:\Projekte\liretools\

set OSMDIR=..\..\..\filestore\osm-poi-geojson

set DIGIFOTOS_BASEDIR=..\..\..\filestore\Bilder\digifotos\
set VIDEOS_BASEDIR=..\..\..\filestore\Bilder\Videos\
set EXPORT_BASEDIR=..\..\..\filestore\export\
set MYTB_IMPORT_MEDIADIR=..\..\..\filestore\mytbbase\
set MYTB_MEDIADIR=..\..\..\filestore\mytbmediabase\
set MYTB_INDEXDIR=..\..\..\filestore\mytbindex\
set MYTB_INDEXSRC_MEDIADIR=%MYTB_MEDIADIR%pics_x100\

set SOLR_PORT=9999
set SOLR_JETTY_HOST=127.0.0.1
set SOLR_HOST=127.0.0.1
set SOLR_OPTS=-Dsolr.jetty.request.header.size=65535
set START_ADMINSERVER=true

set AUTOSTARTIMPORT=false
set AUTOSTARTEXPORT=true
