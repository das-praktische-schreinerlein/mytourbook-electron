const {dialog, Menu, session} = require('electron');
const exec = require('child_process').exec;
const urlLib = require('url');
const fs = require('fs');
const path = require('path');
const Axios = require('../app-backend/node_modules/axios');
const {BaseElectronApplicationConfiguration, BaseElectronApplication} = require('./base-electron-app');
const minimist = require('../app-backend/node_modules/minimist');

class MyCmsElectronApplicationConfiguration extends BaseElectronApplicationConfiguration {
    constructor (appConfig) {
        super(appConfig);
        this.frontendStartUrl = this.getOrDefault(appConfig, 'frontendStartUrl');
        this.adminServerBackendCheckUrl = this.getOrDefault(appConfig, 'adminServerBackendCheckUrl');
        this.backendCheckUrl = this.getOrDefault(appConfig, 'backendCheckUrl');
        this.backendStaticBaseUrl = this.getOrDefault(appConfig, 'backendStaticBaseUrl');
        this.adminServerBackendRequirePath = this.getOrDefault(appConfig, 'adminServerBackendRequirePath', '../app-backend/dist/backend/adminServer');
        this.backendRequirePath = this.getOrDefault(appConfig, 'backendRequirePath', '../app-backend/dist/backend/backend');
        this.backendCliRequirePath = this.getOrDefault(appConfig, 'backendCliRequirePath', '../app-backend/dist/backend/serverAdmin');
        this.frontendServerRequirePath = this.getOrDefault(appConfig, 'frontendServerRequirePath',
            '../app-backend/dist/frontendserver-all-de/frontendserver');
        this.adminServerBackendConfigPath = this.getOrDefault(appConfig, 'adminServerBackendConfigPath');
        this.adminCliBackendConfigPath = this.getOrDefault(appConfig, 'adminCliBackendConfigPath');
        this.backendConfigPath = this.getOrDefault(appConfig, 'backendConfigPath');
        this.frontendConfigPath = this.getOrDefault(appConfig, 'frontendConfigPath');
        this.firewallConfigPath = this.getOrDefault(appConfig, 'firewallConfigPath');
        this.flgStartSolr = this.getOrDefault(appConfig, 'flgStartSolr', false);
        this.flgStartAdminBackend = this.getOrDefault(appConfig, 'flgStartAdminBackend', false);
    }
}

class MyCmsElectronApplication extends BaseElectronApplication {
    constructor (appConfig) {
        super(appConfig);

        // defaults
        this.availableTries = 60;
        this.checkIntervall = 2000;
        this.adminBackendLoaded = false;
        this.backendLoaded = false;
        this.frontendLoaded = false;

        // optional Solr
        this.solrPort = 9999;
        this.solrCmdPath = [this.cwd, '..', 'contrib', 'solr', 'bin', 'solr'].join(path.sep);
        this.cmdSolrStartArgs = ['start', '-f', '-q', '-p', this.solrPort];
        this.cmdSolrStopArgs = ['stop', '-p', this.solrPort];

        this.adminServerBackendConfig = undefined;
        this.adminCliBackendConfig = undefined;
        this.backendConfig = undefined;
        this.frontendConfig = undefined;
        this.firewallConfig = undefined;

        // Keep a global reference of the window object, if you don't, the window will
        // be closed automatically when the JavaScript object is garbage collected.
        this.mainWindow = undefined;
    }

    initConfigs() {
        if (this.appConfig.flgStartAdminBackend) {
            this.adminServerBackendConfig = JSON.parse(fs.readFileSync(this.appConfig.adminServerBackendConfigPath, { encoding: 'utf8' }));
            if (this.adminServerBackendConfig === undefined || this.adminServerBackendConfig.port === undefined) {
                throw new Error('cant load adminServerBackendConfig: "' + this.appConfig.adminServerBackendConfig + '"' +
                    ' = "' + this.adminServerBackendConfig + '"');
            }
        }

        this.adminCliBackendConfig = JSON.parse(fs.readFileSync(this.appConfig.adminCliBackendConfigPath, { encoding: 'utf8' }));
        if (this.adminCliBackendConfig === undefined) {
            throw new Error('cant load adminCliBackendConfig: "' + this.appConfig.adminCliBackendConfig + '"' +
                ' = "' + this.adminCliBackendConfig + '"');
        }

        this.backendConfig = JSON.parse(fs.readFileSync(this.appConfig.backendConfigPath, { encoding: 'utf8' }));
        if (this.backendConfig === undefined || this.backendConfig.port === undefined) {
            throw new Error('cant load backendConfig: "' + this.appConfig.backendConfigPath + '"' +
                ' = "' + this.backendConfig + '"');
        }

        this.frontendConfig = JSON.parse(fs.readFileSync(this.appConfig.frontendConfigPath, { encoding: 'utf8' }));
        if (this.frontendConfig === undefined || this.frontendConfig.port === undefined) {
            throw new Error('cant load frontendConfig: "' + this.appConfig.backendConfigPath + '"' +
                ' = "' + this.frontendConfig + '"');
        }

        this.firewallConfig = JSON.parse(fs.readFileSync(this.appConfig.firewallConfigPath, { encoding: 'utf8' }));
        if (this.firewallConfig === undefined || this.firewallConfig.routerErrorsConfigs === undefined) {
            throw new Error('cant load firewallConfig: "' + this.appConfig.backendConfigPath + '"' +
                ' = "' + this.firewallConfig + '"');
        }
    }

    startServices() {
        this.startBackend();
        this.checkBackend();
    }

    stopServices(allAction) {
        const me = this;
        if (this.appConfig.flgStartSolr) {
            me.stopSolr(function () {
                me.exitApp();
            });
        } else {
            me.exitApp();
        }
    }

    startBackend() {
        const me = this;

        if (this.appConfig.flgStartSolr) {
            me.startSolr(function () {
                me.exitApp();
            });
        }

        // load and start backend
        const processStartArgs = ['node', 'start',
            '--adminbackend', this.appConfig.adminServerBackendConfigPath,
            '--adminclibackend', this.appConfig.adminCliBackendConfigPath,
            '--backend', this.appConfig.backendConfigPath,
            '--firewall', this.appConfig.firewallConfigPath,
            '--frontend', this.appConfig.frontendConfigPath
        ];
        process.argv = processStartArgs;
        try {
            const frontendserver = require(this.appConfig.frontendServerRequirePath);
        } catch(error) {
            console.error("cant start frontendserver", processStartArgs, this.appConfig.frontendServerRequirePath, error);
            process.kill(process.pid);
        }

        if (this.appConfig.flgStartAdminBackend) {
            try {
                const adminBackendServer = require(this.appConfig.adminServerBackendRequirePath);
            } catch(error) {
                console.error("cant start adminBackendServer", processStartArgs, this.appConfig.adminServerBackendRequirePath, error);
                process.kill(process.pid);
            }
        }

        try {
            const backend = require(this.appConfig.backendRequirePath);
        } catch(error) {
            console.error("cant start backend", processStartArgs, this.appConfig.backendRequirePath, error);
            process.kill(process.pid);
        }
    }

    startCliCommand() {
        // load and start backendCli
        const argv = minimist(process.argv.slice(1));
        const processStartArgs = ['node', 'start',
            '--adminbackend', this.appConfig.adminServerBackendConfigPath,
            '--adminclibackend', this.appConfig.adminCliBackendConfigPath,
            '--backend', this.appConfig.backendConfigPath,
            '--firewall', this.appConfig.firewallConfigPath,
            '--frontend', this.appConfig.frontendConfigPath
        ];
        const configuredProcessStartArgs = this.createConfiguredCliCommand(argv, processStartArgs)
        this.runConfigureCliCommand(configuredProcessStartArgs);
    }

    createConfiguredCliCommand(argv, defaultProcessStartArgs) {
        if (argv['preparedCommand']) {
            switch (argv['preparedCommand']) {
                case 'prepareAppEnv':
                    defaultProcessStartArgs.push(
                        '--preparedCommand', 'prepareAppEnv'
                    );
                    return defaultProcessStartArgs;
                default:
                    console.error("cant start backendCli - unknown preparedCommand", argv['preparedCommand']);
                    process.kill(process.pid);
            }
        }

        switch (argv['command']) {
            case 'generateSitemap':
                defaultProcessStartArgs.push(
                    '--command', 'generateSitemap',
                    '--action', 'generateSitemap',
                    '--sitemap', argv['sitemap']
                );
                return defaultProcessStartArgs;
            default:
                console.error("cant start backendCli - unknown command", argv['command']);
                process.kill(process.pid);
        }
    }

    runConfigureCliCommand(processStartArgs) {
        process.argv = processStartArgs;
        try {
            const backendCli = require(this.appConfig.backendCliRequirePath);
        } catch(error) {
            console.error("cant start backendCli", processStartArgs, error);
            process.kill(process.pid);
        }
    }

    startSolr(errAction) {
        const me = this;

        // start solr
        exec(this.solrCmdPath + ' ' + this.cmdSolrStartArgs.join(' '), {'SOLR_JETTY_HOST': '127.0.0.1'}, function callback(error, stdout, stderr) {
            if (error) {
                me.showError('start solr: ', error + '\n' + stdout + '\n' + stderr, function () {
                    if (errAction) {
                        errAction();
                    }
                });
                return;
            }
            if (me.appConfig.flgDebug) {
                me.showInfoBox('start solr: ', 'Infos: ' + stdout + '\nFehler: ' + stderr, function () {});
            }
        });
    }

    stopSolr(allAction) {
        const me = this;

        exec(this.solrCmdPath + ' ' + this.cmdSolrStopArgs.join(' '), {'SOLR_JETTY_HOST': '127.0.0.1'}, function callback(error, stdout, stderr) {
            if (error) {
                me.showError('stop solr: ', error + '\n' + stdout + '\n' + stderr, function () {
                    if (allAction) {
                        allAction();
                    }
                });
                return;
            }
            if (me.appConfig.flgDebug) {
                me.showInfoBox('stop solr: ', 'Infos: ' + stdout + '\nFehler: ' + stderr, function () {
                    if (allAction) {
                        allAction();
                    }
                });
            } else {
                if (allAction) {
                    allAction();
                }
            }
        });
    }

    setAuthCookies() {
        if (this.firewallConfig.allowTokenCookieOnly) {
            const tokenCookieName = Object.keys(this.firewallConfig.allowTokenCookieOnly)[0];
            for (const url of [this.appConfig.frontendStartUrl, this.appConfig.backendCheckUrl]) {
                const urlParts = urlLib.parse(url);
                const cookie = {url: urlParts.protocol + '//' + urlParts.host, name: tokenCookieName,
                    value: this.firewallConfig.allowTokenCookieOnly[tokenCookieName][0]};
                console.error('set cookie', cookie.url, cookie.name, cookie.value);
                session.defaultSession.cookies.set(cookie, function (error) {
                    if (error) {
                        console.error('error while setting cookie', cookie, error);
                    }
                });
            }
        }

    }

    checkBackend() {
        const me = this;
        if (me.backendLoaded && me.frontendLoaded && (!me.appConfig.flgStartAdminBackend || me.adminBackendLoaded)) {
            return Promise.resolve('backend already loaded');
        }

        if (this.availableTries < 0) {
            return Promise.reject('cant load backend availableTries < 0');
        }

        this.availableTries = this.availableTries - 1;
        let tokenCookie = 'nope=nope';
        if (this.firewallConfig.allowTokenCookieOnly) {
            const tokenCookieName = Object.keys(this.firewallConfig.allowTokenCookieOnly)[0];
            tokenCookie = tokenCookieName + '=' + this.firewallConfig.allowTokenCookieOnly[tokenCookieName][0];
        }

        return Axios.get(this.appConfig.backendCheckUrl, {
            headers: {
                Cookie:  tokenCookie + ';'
            }
        }).then(response => {
            if (response.status !== 200) {
                return Promise.reject('cant start backend');
            }

            me.backendLoaded = true;
            if (me.frontendLoaded) {
                return Promise.resolve('backend already loaded');
            }

            var promise;
            if (me.appConfig.flgStartAdminBackend) {
                promise = Axios.post(this.appConfig.adminServerBackendCheckUrl, {}, {
                    headers: {
                        Cookie:  tokenCookie + ';'
                    }
                }).then(response => {
                    if (response.status !== 200) {
                        return Promise.reject('cant start adminbackend');
                    }

                    me.backendLoaded = true;
                    return Promise.resolve('adminbackend loaded')
                });
            } else {
                promise = Promise.resolve('adminbackend deactivated');
            }

            return promise.then(() => {
                return Axios.get(this.appConfig.frontendStartUrl, {
                    headers: {
                        Cookie:  tokenCookie + ';'
                    }
                });
            }).then(response => {
                if (response.status !== 200) {
                    return Promise.reject('cant start frontend: ' + response.status);
                }

                if (me.frontendLoaded) {
                    return Promise.resolve('backend already loaded');
                }

                // load app both backends are ready
                me.frontendLoaded = true;
                return me.mainWindow.loadURL(me.appConfig.frontendStartUrl, {
                    extraHeaders: {
                        Cookie: tokenCookie + ';'
                    }
                }).then(() => {
                    console.log('finished loading frontendUrl: ', me.appConfig.frontendStartUrl);
                    return Promise.resolve('finished loading frontendUrl');
                }).catch(error => {
                    return Promise.reject('cant load frontendurl: ' + me.appConfig.frontendStartUrl + ' error: "' + error + '"');
                });
            }).catch(error => {
                return Promise.reject('cant start frontend: "' + error + '"');
            });
        }).catch(error => {
            if (me.availableTries < 0) {
                me.showError('starting backends', error, function () {
                    me.shutdownApp()
                });
                return Promise.reject('cant start backends: "' + error + '"');
            }
            setTimeout(function () {
                me.checkBackend();
            }, me.checkIntervall);
        });
    }

    createWindow() {
        super.createWindow();

        // load loading-file
        this.mainWindow.loadURL(`file://${__dirname}/index.html`);

        // set cookies
        this.setAuthCookies();
    }

    catchWindowEvents() {
        const me = this;

        // catch download-url
        const contents = this.mainWindow.webContents;
        let tokenCookie = 'nope=nope';
        if (this.firewallConfig.allowTokenCookieOnly) {
            const tokenCookieName = Object.keys(this.firewallConfig.allowTokenCookieOnly)[0];
            tokenCookie = tokenCookieName + '=' + this.firewallConfig.allowTokenCookieOnly[tokenCookieName][0];
        }

        contents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures, referrer, postBody) => {
            const urlParts = urlLib.parse(url);
            if (url.startsWith(urlParts.protocol + '//' + urlParts.host)) {
                event.preventDefault();
                dialog.showSaveDialog(
                    {
                        title: 'Save Download',
                        defaultPath: me.suggestDownloadFileName(url)
                    }).then((file) => {
                        if (file !== undefined && !file.canceled && file.filePath !== undefined) {
                            Axios.get(url, {
                                headers: {
                                    Cookie:  tokenCookie + ';'
                                },
                                responseType: 'stream'
                            }).then(response => {
                                if (response.status === 200) {
                                    response.data.pipe(fs.createWriteStream(file.filePath));
                                }
                            });
                        }
                    }
                );
            }
        });
    }

    suggestDownloadFileName(downloadUrl) {
        let fileSuggestion = downloadUrl.replace(this.appConfig.backendStaticBaseUrl, '')
            .replace(/:/g, '')
            .replace(/\//g, '_')
            .toLowerCase();

        if ((fileSuggestion.includes('image') || fileSuggestion.includes('picture')) &&
            !fileSuggestion.endsWith('.jpg')) {
            fileSuggestion = fileSuggestion + '.jpg';
        } else if (fileSuggestion.includes('video') && !fileSuggestion.endsWith('.mp4')) {
            fileSuggestion = fileSuggestion + '.mp4';
        } else if (fileSuggestion.includes('audio') && !fileSuggestion.endsWith('.mp3')) {
            fileSuggestion = fileSuggestion + '.mp3';
        }

        return fileSuggestion;
    }

    createMenu() {
        const me = this;

        // create menu
        const menuTemplate = [
            {
                label: '<= BACK',
                click: function (menuItem, browserWindow, event) {
                    if (me.mainWindow.webContents.canGoBack()) {
                        me.mainWindow.webContents.goBack();
                    }
                }
            },
            {
                label: 'FORWARD =>',
                click: function (menuItem, browserWindow, event) {
                    if (me.mainWindow.webContents.canGoForward()) {
                        me.mainWindow.webContents.goForward();
                    }
                }
            }
        ];
        const mainMenu = Menu.buildFromTemplate(menuTemplate);
        Menu.setApplicationMenu(mainMenu);
    }

}

module.exports.MyCmsElectronApplication = MyCmsElectronApplication;
module.exports.MyCmsElectronApplicationConfiguration = MyCmsElectronApplicationConfiguration;
