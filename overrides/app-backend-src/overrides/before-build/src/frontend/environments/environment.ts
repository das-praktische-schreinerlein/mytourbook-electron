// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

import {AppEnvironment} from './app-environment';

export const environment: AppEnvironment = {
    production: false,
    assetsPathVersionSnippet: '',
    assetsPathVersionSuffix: '',
    defaultSearchTypes: '',
    emptyDefaultSearchTypes: '',
    useAssetStoreUrls: false,
    allowAutoPlay: false,
    backendApiBaseUrl: 'http://localhost:5100/api/v1/',
    cookieLawSeenName: 'cookieLawSeenV20180525',
    trackingProviders: [],
    adminBackendApiBaseUrl: 'http://localhost:5190/adminapi/v1/',
    adminWritable: true
};
