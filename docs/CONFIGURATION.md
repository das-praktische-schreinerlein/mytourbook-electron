# Configure MySimpleHomePage-Electron-App

## base-config
There exists 2 modes to run the application: development and production.
Both modes have their own configuration-files with suffix "-dev" or "-prod".
If you want to configure other options than the default-values you can configure the whole application via overrides...

## electron-config
- development: overrides/after-build/root/all/config/electron-app.dev.json
- production: overrides/after-build/root/all/config/electron-app.prod.json

With these files you configure the electron-app and features to start.
```
{
    "frontendStartUrl": "http://localhost:5001/myshpdev/de/",
    "adminServerBackendCheckUrl": "http://localhost:5190/adminapi/v1/de/status",
    "backendCheckUrl": "http://localhost:5100/api/v1/de/pdoc/",
    "backendStaticBaseUrl": "http://localhost:5100/api/static/",
    "adminServerBackendRequirePath": "../app-backend/dist/backend/adminServer",
    "backendRequirePath": "../app-backend/dist/backend/backend",
    "frontendServerRequirePath": "../app-backend/dist/frontendserver-dev-de/frontendserver",
    "adminServerBackendConfigPath": "../../../config/adminServer.dev.json",
    "adminCliBackendConfigPath": "../../../config/adminCli.dev.json",
    "backendConfigPath": "../../../config/backend.dev.json",
    "frontendConfigPath": "../../../config/frontend.dev.json",
    "firewallConfigPath": "../../../config/firewall.dev.json",
    "flgStartSolr": false,
    "flgStartAdminBackend": true,
    "flgDebug": false
}
```

## application-config
The [common application-coonfig-files](../app-backend-src/docs/CONFIGURATION.md) of the project configured to display in electron-app, can be overridden in overrides...
- config-files and scripts to use after build: -> overrides/after-build/root/all
- source-files to use before build: overrides/app-backend-src/overrides/before-build


