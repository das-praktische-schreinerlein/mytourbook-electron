const {app, BrowserWindow, dialog} = require('electron');

class BaseElectronApplicationConfiguration {
    constructor (appConfig) {
        this.flgDebug = this.getOrDefault(appConfig, 'flgDebug', false);
        this.origAppConfig = appConfig;
    }

    getOrDefault(appConfig, name, defaultValue) {
        return appConfig !== undefined && appConfig[name] !== undefined ? appConfig[name] : defaultValue;
    }
}

class BaseElectronApplication {
    constructor (appConfig) {
        this.appConfig = appConfig;
        this.cwd = process.cwd();
        this.onShutdown = false;
        this.onStart = false;

        // defaults
        this.defaultWindowOptions = {width: 1650, height: 1000};

        // redirect logs
        this.logs = [];

        // Keep a global reference of the window object, if you don't, the window will
        // be closed automatically when the JavaScript object is garbage collected.
        this.mainWindow = undefined;
    }

    startApp() {
        this.changeAppDir();
        this.initLogRedirection();
        this.initApplicationEventHandler();
        this.initConfigs();
    }

    startCli() {
        this.changeAppDir();
        this.initConfigs();
        this.startCliCommand();
    }

    changeAppDir() {
        process.chdir(process.cwd() + '/resources/app-backend');
    }

    initConfigs() {
    }

    initLogRedirection() {
        const me = this;

        // redirect logs
        this.logs = [];
        console.error = function (log, log2, log3, log4, log5, log6) {
            me.logs.push([log, log2, log3, log4, log5, log6]);
        }
        console.warn = function (log, log2, log3, log4, log5, log6) {
            me.logs.push([log, log2, log3, log4, log5, log6]);
        }
        console.log = function (log, log2, log3, log4, log5, log6) {
            me.logs.push([log, log2, log3, log4, log5, log6]);
        }
    }

    initApplicationEventHandler() {
        const me = this;

        // This method will be called when Electron quits
        app.on('quit', function () {
            me.shutdownApp();
        });
        app.on('exit', function () {
            me.shutdownApp();
        });

        // This method will be called when Electron get errors
        app.on('uncaughtException', function () {
            me.shutdownApp();
        });

        // Quit when all windows are closed.
        app.on('window-all-closed', function () {
            // On OS X it is common for applications and their menu bar
            // to stay active until the user quits explicitly with Cmd + Q
            if (process.platform !== 'darwin') {
                me.shutdownApp();
            }
        });

        app.on('activate', function () {
            if (process.platform === 'darwin') {
                // On OS X it's common to re-create a window in the app when the
                // dock icon is clicked and there are no other windows open.
                if (me.mainWindow === null) {
                    me.createWindow();
                }
            }
        });

        // This method will be called when Electron has finished
        // initialization and is ready to create browser windows.
        // Some APIs can only be used after this event occurs.
        app.on('ready', function () {
            me.startAppBrowser();
        });
    }

    startAppBrowser() {
        if (this.onStart) {
            return;
        }

        this.onStart = true;
        this.createWindow();
        this.startServices();
    }

    startServices() {

    }

    startCliCommand() {

    }

    shutdownApp(event) {
        if (this.onShutdown) {
            return;
        }

        const me = this;
        me.onShutdown = true;
        if (event) {
            event.preventDefault();
        }

        me.stopServices(function () {
            me.exitApp();
        });
    }

    stopServices(allAction) {
        if (allAction) {
            allAction();
        }
    }

    exitApp() {
        if (this.appConfig.flgDebug) {
            this.showInfoBox('backendlogs: ', 'Infos: ' + this.logs.map(logParams => {
                return logParams.filter(log => log !== undefined).join(', ');
            }).join('\n'), function () {
                app.quit();
                return process.kill(process.pid);
            });
        } else {
            app.quit();
            return process.kill(process.pid);
        }
    }

    createWindow() {
        const me = this;

        // Create the browser window.
        this.mainWindow = new BrowserWindow(me.defaultWindowOptions);
        this.mainWindow.setAutoHideMenuBar(false);
        this.mainWindow.setMenuBarVisibility(true);

        // create Menu
        this.createMenu()

        // catchWindowEvents
        this.catchWindowEvents();

        // Open the DevTools.
        if (this.appConfig.flgDebug) {
            this.mainWindow.openDevTools();
        }

        // Emitted when the window is closed.
        this.mainWindow.on('closed', function (event) {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            me.mainWindow = null;
            me.shutdownApp(event);
        });
    }

    catchWindowEvents() {
    }

    createMenu() {
    }

    showError(actionText, error, action) {
        const me = this;
        const options = {
            type: 'question',
            buttons: ['OK Beenden'],
            defaultId: 2,
            title: 'Huston wir haben ein Problem....',
            message: actionText + 'Ooops... das ist wohl was fehlgeschlagen :-( ',
            detail: '' + me.logSplit(error, 50)
        };

        dialog.showMessageBox(null, options).then(() => {
            if (action) {
                action();
            }
        });
    }

    showInfoBox(actionText, infos, action) {
        const me = this;
        const options = {
            type: 'question',
            buttons: ['OK'],
            defaultId: 2,
            title: 'Nur zur Info....',
            message: actionText + 'Das waren die Logs',
            detail: '' + me.logSplit(infos, 50)
        };

        dialog.showMessageBox(null, options).then(() => {
            if (action) {
                action();
            }
        });
    }

    logSplit(str, maxLength) {
        if (typeof str !== 'string' && !(str instanceof String)) {
            return str
        }

        if (str.length <= maxLength) {
            return str;
        }

        const reg = new RegExp("[^ ]{1," + maxLength + "}","g");
        const  parts = str.match(reg);

        return parts.join(' ');
    }

}

module.exports.BaseElectronApplication = BaseElectronApplication;
module.exports.BaseElectronApplicationConfiguration = BaseElectronApplicationConfiguration;
