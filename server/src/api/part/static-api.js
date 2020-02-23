// @flow

/* global process */

import path from 'path';

import {type $Application, type $Request, type $Response} from 'express';

import {pathToDist, pathToStaticFileFolder} from '../../../../webpack/config';
import {staticFilesList} from '../../config';
import {getResizedImageSrc} from '../../../../www/js/lib/url';
import {defaultOpenGraphData} from '../../../../www/js/provider/intial-data/intial-data-const';
import {sharpKernelResizeNameMap} from '../../../../www/js/page/cms/file/file-api';

import {fileApiConst} from './file-api-const';

const {pathToUploadFiles} = fileApiConst;
const CWD = process.cwd();
const manifestIconSizeList = [36, 48, 72, 96, 144, 192, 512, 1024, 2048];

type ManifestIconType = {|
    +src: string,
    +sizes: string,
    +type: 'image/png',
|};

export function addStaticApi(app: $Application) {
    const manifest = {
        name: 'Skazki Land',
        lang: 'ru-RU',
        display: 'standalone',
        /* eslint-disable camelcase, id-match */
        short_name: 'Skazki Land', // name for icon on home page on phone
        start_url: '/',
        background_color: '#f0ece3',
        theme_color: '#f0ece3',
        /* eslint-enable camelcase, id-match */
        icons: manifestIconSizeList.map((size: number): ManifestIconType => {
            return {
                src: getResizedImageSrc({
                    src: defaultOpenGraphData.image,
                    width: size,
                    height: size,
                    kernel: sharpKernelResizeNameMap.nearest,
                    hasEnlargement: true,
                }),
                sizes: `${size}x${size}`,
                type: 'image/png',
            };
        }),
    };

    app.get('/manifest.json', (request: $Request, response: $Response) => {
        response.json(manifest);
    });

    const assetlinks = [
        {
            relation: ['delegate_permission/common.handle_all_urls'],
            target: {
                namespace: 'android_app',
                // eslint-disable-next-line id-match, camelcase
                package_name: 'land.skazki.twa',
                // eslint-disable-next-line id-match, camelcase
                sha256_cert_fingerprints: [
                    'D1:EF:1E:15:27:01:5D:1F:89:81:00:C7:E3:05:A1:22:4F:BB:5D:EB:1D:D7:F4:C1:C9:FE:A9:2E:FB:8D:54:19',
                ],
            },
        },
    ];

    app.get('/.well-known/assetlinks.json', (request: $Request, response: $Response) => {
        response.json(assetlinks);
    });

    // root's static files
    staticFilesList.forEach((pathToFile: string) => {
        app.get(pathToFile, (request: $Request, response: $Response) => {
            response.sendFile(path.join(CWD, pathToDist + pathToFile));
        });
    });

    // usual static files
    app.get(pathToStaticFileFolder + '/*', (request: $Request, response: $Response) => {
        // console.log(pathToStaticFileFolder + '/*');
        // console.log(request.url);
        response.sendFile(path.join(CWD, pathToDist, request.params['0']));
    });

    // upload files
    app.get(pathToUploadFiles + '/*', (request: $Request, response: $Response) => {
        // console.log(pathToUploadFiles + '/*');
        // console.log(request.url);
        response.sendFile(path.join(CWD, pathToUploadFiles, request.params['0']));
    });

    // service worker
    app.get('/sw.js', (request: $Request, response: $Response) => {
        // console.log(pathToStaticFileFolder + '/*');
        // console.log(request.url);
        response.sendFile(path.join(CWD, pathToDist, 'asset/sw.js'));
    });
}
