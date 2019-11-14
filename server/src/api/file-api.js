// @flow

import fileSystem from 'fs';

import sharp from 'sharp';
import {type $Application, type $Request, type $Response} from 'express';
import {type ExpressFormDataFileType} from 'express-fileupload';

import {getFormDataFileList, saveFile} from '../util/file';
import {cwd} from '../../../webpack/config';
import {promiseCatch} from '../../../www/js/lib/promise';
import {isError} from '../../../www/js/lib/is';

import {fileApiConst} from './file-const';
import {fileApiRouteMap} from './route-map';
import {getImageResizeParameters} from './helper';

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
        const imageName = String(request.params['0']);

        const resizeResult = await sharp(cwd + fileApiConst.pathToUploadFiles + '/' + imageName)
            .resize(getImageResizeParameters(request))
            .toFile(cwd + fileApiConst.pathToUploadFiles + '/output.jpg')
            .catch(promiseCatch);

        if (isError(resizeResult)) {
            response.json({isSuccessful: false, errorList: [resizeResult]});
            return;
        }

        response.sendFile(cwd + fileApiConst.pathToUploadFiles + '/output.jpg');
    });
}
