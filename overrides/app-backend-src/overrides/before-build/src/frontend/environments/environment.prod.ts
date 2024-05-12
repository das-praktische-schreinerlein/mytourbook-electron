import {AppEnvironment} from './app-environment';
import {DataMode} from '../shared/tdoc-commons/model/datamode.enum';
import {PrintDialogPdfGenerator} from '@dps/mycms-frontend-commons/dist/angular-commons/services/print-dialog-pdf.generator';

export const environment: AppEnvironment = {
    production: true,
    assetsPathVersionSnippet: '.v2',
    assetsPathVersionSuffix: '',
    backendApiBaseUrl: 'http://localhost:4402/api/v1/',
    tracksBaseUrl: 'http://localhost:4402/api/assets/tracks/',
    pdfsBaseUrl: 'http://localhost:4402/api/assets/pdfs/',
    audioBaseUrl: 'http://localhost:4402/api/static/audios/',
    picsBaseUrl: 'http://localhost:4402/api/static/pictures/',
    picsPreviewPathResolution: 'x300',
    videoBaseUrl: 'http://localhost:4402/api/static/videos/',
    defaultSearchTypes: 'route,location,track,trip,news',
    emptyDefaultSearchTypes: 'route,location,track,trip,news,image,video,info',
    useAssetStoreUrls: false,
    useAudioAssetStoreUrls: false,
    useVideoAssetStoreUrls: false,
    pdocWritable: false,
    pdocActionTagWritable: false,
    pdocEmptyDefaultSearchTypes: 'page',
    tdocWritable: false,
    tdocActionTagWritable: false,
    allowAutoPlay: true,
    tdocMaxItemsPerAlbum: 20000,
    m3uAvailable: true,
    cookieLawSeenName: 'cookieLawSeenV20180525',
    trackingProviders: [],
    hideInternalDescLinks: false,
    hideInternalImages: false,
    startDataMode: DataMode.BACKEND,
    availableDataModes: [DataMode.BACKEND],
    tourDocFacetsFiltered: true // TODO set this to false on sql-environments
};
if (console) {
// unset logger
console.trace = function() {};
console.debug = function() {};
console.log = function() {};
console.warn = function() {};
console.error = function() {};
}

// TODO if you want pdf replace PrintDialogPdfGenerator by JsPdfGenerator and move jspdf in package.json from optional to dep
export class EnvironmentPdfGenerator extends PrintDialogPdfGenerator {}
