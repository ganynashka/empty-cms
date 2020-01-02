// @flow

/* global process */

import path from 'path';

import {type $Application, type $Request, type $Response} from 'express';

import {pathToDist, pathToStaticFileFolder} from '../../../../webpack/config';
import {staticFilesList} from '../../config';

import {fileApiConst} from './file-api-const';
const {pathToUploadFiles} = fileApiConst;
const CWD = process.cwd();

export function addStaticApi(app: $Application) {
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
