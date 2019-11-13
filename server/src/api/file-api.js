// @flow

import fileSystem from 'fs';
import sharp, {fit as sharpFit} from 'sharp';
import {type $Application, type $Request, type $Response} from 'express';
import {type ExpressFormDataFileType} from 'express-fileupload';

import {getFormDataFileList, saveFile} from '../util/file';
import {cwd} from '../../../webpack/config';

import {fileApiRouteMap} from './route-map';
import {fileApiConst} from './file-const';

export function addFileApi(app: $Application) {
    fileSystem.mkdir(cwd + fileApiConst.pathToUploadFiles, (): null => null);

    app.post(fileApiRouteMap.uploadImageList, async (request: $Request, response: $Response) => {
        const fileDataList: Array<ExpressFormDataFileType> = getFormDataFileList(request);
        const saveFileResultList = await Promise.all(fileDataList.map(saveFile));
        const errorMessageList: Array<string> = saveFileResultList
            .filter(Boolean)
            .map((error: Error): string => error.message);

        response.json({isSuccessful: errorMessageList.length === 0, errorList: errorMessageList});
    });

    app.get(fileApiRouteMap.getFileList, async (request: $Request, response: $Response) => {
        fileSystem.readdir(cwd + fileApiConst.pathToUploadFiles, (error: Error | mixed, fileList: Array<string>) => {
            const result = Array.isArray(fileList) ? fileList : {isSuccessful: false, errorList: [error]};

            response.json(result);
        });
    });

    app.get(fileApiRouteMap.getResizedImage + '/*', async (request: $Request, response: $Response) => {

        const width = parseInt(request.query.width, 10) || 0;
        const height = parseInt(request.query.height, 10) || 0;
        const fit = String(request.query.fit);
        const imageName = String(request.params['0']);

        console.log(sharpFit)

/*
        console.log('sharp.fit');
        console.log(sharp.fit);

        const fitData = {
            contain: 'contain',
            cover: 'cover',
            fill: 'fill',
            inside: 'inside',
            outside: 'outside'
        };
*/

        console.log(width, height, fit, imageName);

        sharp(cwd + fileApiConst.pathToUploadFiles + '/' + imageName)
            .resize({
                width,
                height,
                fit: sharp.fit.inside,
                // withoutEnlargement: true
            })
            .toFile(cwd + fileApiConst.pathToUploadFiles + '/output.jpg')
            .then(() => {
                response.json({maxWidth, maxHeight, imageName, fit});
            });
    });
}
