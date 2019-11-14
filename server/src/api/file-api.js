// @flow

import fileSystem from 'fs';
import path from 'path';

import sharp from 'sharp';
import {type $Application, type $Request, type $Response} from 'express';
import {type ExpressFormDataFileType} from 'express-fileupload';

import {compressImage, getFormDataFileList, getIsFileExists, saveFile} from '../util/file';
import {cwd} from '../../../webpack/config';
import {promiseCatch} from '../../../www/js/lib/promise';
import {isError} from '../../../www/js/lib/is';
import {getSlug} from '../../../www/js/lib/string';

import {fileApiConst} from './file-const';
import {fileApiRouteMap} from './route-map';
import {getImageResizeParameters} from './helper';

export function addFileApi(app: $Application) {
    fileSystem.mkdir(path.join(cwd, fileApiConst.pathToUploadFiles), (): null => null);
    fileSystem.mkdir(path.join(cwd, fileApiConst.pathToUploadFilesCache), (): null => null);
    fileSystem.mkdir(path.join(cwd, fileApiConst.pathToUploadFilesTemp), (): null => null);

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
        const resizeConfig = getImageResizeParameters(request);
        const configId = getSlug(JSON.stringify(resizeConfig));
        const endFileName = configId + '--' + imageName;
        const pathToFile = path.join(cwd, fileApiConst.pathToUploadFilesCache, endFileName);

        const isFileExists = await getIsFileExists(pathToFile);

        if (isFileExists) {
            console.log('get file from cache', pathToFile);
            response.sendFile(pathToFile);
            return;
        }

        console.log('make new file and send', pathToFile);

        const pathToTemporaryFile = path.join(cwd, fileApiConst.pathToUploadFilesTemp, endFileName);

        const resizeResult = await sharp(path.join(cwd, fileApiConst.pathToUploadFiles, imageName))
            .resize(resizeConfig)
            .toFile(pathToTemporaryFile)
            .catch(promiseCatch);

        if (isError(resizeResult)) {
            response.json({isSuccessful: false, errorList: [resizeResult]});
            return;
        }

        const compressImageResult = await compressImage(
            pathToTemporaryFile,
            path.join(cwd, fileApiConst.pathToUploadFilesCache)
        );

        fileSystem.unlink(pathToTemporaryFile, () => {});

        if (isError(compressImageResult)) {
            response.json({isSuccessful: false, errorList: [compressImageResult]});
            return;
        }

        response.sendFile(pathToFile);
    });
}
