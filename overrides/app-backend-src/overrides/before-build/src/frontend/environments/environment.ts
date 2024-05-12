// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

import {AppEnvironment} from './app-environment';
import {DataMode} from '../shared/tdoc-commons/model/datamode.enum';
import {PrintDialogPdfGenerator} from '@dps/mycms-frontend-commons/dist/angular-commons/services/print-dialog-pdf.generator';

export const environment: AppEnvironment = {
    hideCopyrightFooter: true,
    production: false,
    assetsPathVersionSnippet: '.v2',
    assetsPathVersionSuffix: '',
    backendApiBaseUrl: 'http://localhost:4400/api/v1/',
    tracksBaseUrl: 'http://localhost:4400/api/assets/tracks/',
    pdfsBaseUrl: 'http://localhost:4400/api/assets/pdfs/',
    audioBaseUrl: 'http://localhost:4400/api/static/audios/',
    picsBaseUrl: 'http://localhost:4400/api/static/pictures/',
    picsPreviewPathResolution: 'x300',
    videoBaseUrl: 'http://localhost:4400/api/static/videos/',
    defaultSearchTypes: 'route,location,track,trip,news',
    emptyDefaultSearchTypes: 'route,location,track,trip,news,image,video,info',
    useAssetStoreUrls: false,
    useAudioAssetStoreUrls: false,
    useVideoAssetStoreUrls: false,
    skipMediaCheck: false,
    pdocWritable: true,
    pdocActionTagWritable: true,
    pdocEmptyDefaultSearchTypes: 'page',
    tdocWritable: true,
    tdocActionTagWritable: true,
    allowAutoPlay: true,
    tdocMaxItemsPerAlbum: 20000,
    m3uAvailable: true,
    cookieLawSeenName: 'cookieLawSeenV20180525',
    trackingProviders: [],
    adminBackendApiBaseUrl: 'http://localhost:4490/adminapi/v1/',
    adminWritable: true,
    hideInternalDescLinks: false,
    hideInternalImages: false,
    startDataMode: DataMode.BACKEND,
    availableDataModes: [DataMode.BACKEND],
    tourDocDateFormatPipePattern: 'LONG',
    tourDocFacetsFiltered: false // TODO set this to false on sql-environments
};

// TODO if you want pdf replace PrintDialogPdfGenerator by JsPdfGenerator and move jspdf in package.json from optional to dep
export class EnvironmentPdfGenerator extends PrintDialogPdfGenerator {}
