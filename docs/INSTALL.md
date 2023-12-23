# Install and run MyTourbook-Electron-App

## prepare build
- build all
```
npm run all
```

## run application
The application can be run in different modes: production and development.

### development-mode
- start app in dev-mode
```
dist\sbin\start-dev.bat
```
- start cli-command in dev-mode (for example run sitemap)
```
dist\sbin\cli-dev.bat --command generateSitemap --sitemap ..\..\..\config\sitemap-dev-de.json bla
```

### production-mode
- start app in prod-mode
```
dist\sbin\start-prod.bat
```
- start cli-command in prod-mode (for example run sitemap)
```
dist\sbin\cli-prod.bat --command generateSitemap --sitemap ..\..\..\config\sitemap-dev-de.json bla
```
