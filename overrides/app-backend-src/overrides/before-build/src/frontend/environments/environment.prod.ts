import {AppEnvironment} from './app-environment';

export const environment: AppEnvironment = {
    production: true,
    assetsPathVersionSnippet: '',
    assetsPathVersionSuffix: '',
    defaultSearchTypes: '',
    emptyDefaultSearchTypes: '',
    useAssetStoreUrls: false,
    allowAutoPlay: false,
    backendApiBaseUrl: 'http://localhost:5102/api/v1/',
    cookieLawSeenName: 'cookieLawSeenV20180525',
    trackingProviders: []
};

// unset logger
console.trace = function() {};
console.debug = function() {};
console.log = function() {};
console.warn = function() {};
console.error = function() {};

