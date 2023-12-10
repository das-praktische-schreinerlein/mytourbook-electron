const minimist = require('../app-backend/node_modules/minimist');
const fs = require('fs');
const { BaseElectronApplication, BaseElectronApplicationConfiguration } = require('./base-electron-app');
const { MyCmsElectronApplication, MyCmsElectronApplicationConfiguration } = require('./mycms-electron-app');

const argv = minimist(process.argv.slice(1));
const environment = argv['environment'];
const mode = argv['mode'];
const availableEnvironments = ['dev', 'beta', 'prod'];
if (!availableEnvironments.includes(environment)) {
    const appConfiguration = new BaseElectronApplicationConfiguration(
        {flgDebug: true});
    const myCmsElectronApplication = new BaseElectronApplication(appConfiguration);
    myCmsElectronApplication.startServices = function () {
        const me = this;
        console.error("argv", argv);
        console.error("processargv", process.argv);
        console.error("argv['environment']", argv['environment']);
        me.showError('starting app', 'illegal environment: "' + environment + '"' +
            ' - accepted values: "' + availableEnvironments.join(', ') + '"', function () {
            me.shutdownApp();
        });
    };
    myCmsElectronApplication.startApp();
} else {
    const appConfiguration = new MyCmsElectronApplicationConfiguration(
        JSON.parse(fs.readFileSync('../config/electron-app.' + environment + '.json')));
    const myCmsElectronApplication = new MyCmsElectronApplication(appConfiguration);
    switch (mode) {
        case 'cli':
            myCmsElectronApplication.startCli();
            break;
        default:
            myCmsElectronApplication.startApp();
    }
}

