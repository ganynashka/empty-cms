// @flow

import fileSystem from 'fs';
import path from 'path';

import sharp from 'sharp';
import {type $Application, type $Request, type $Response} from 'express';
import {type ExpressFormDataFileType} from 'express-fileupload';

import {compressImage, getFormDataFileList, getIsFileExists, saveFile} from '../../util/file';
import {cwd} from '../../../../webpack/config';
import {promiseCatch} from '../../../../www/js/lib/promise';
import {isError, isNotError, isString} from '../../../../www/js/lib/is';
import {getSlug} from '../../../../www/js/lib/string';
import {fileApiRouteMap} from '../api-route-map';
import {getImageResizeParameters} from '../api-helper';
import {findDocumentListByOrList} from '../../util/document-helper';
import {faviconPngFileName} from '../../../../www/js/provider/intial-data/intial-data-const';

import {fileApiConst} from './file-api-const';

export function addFileApi(app: $Application) {
    fileSystem.mkdir(path.join(cwd, fileApiConst.pathToUploadFiles), (): null => null);
    fileSystem.mkdir(path.join(cwd, fileApiConst.pathToUploadFilesCache), (): null => null);
    fileSystem.mkdir(path.join(cwd, fileApiConst.pathToUploadFilesTemp), (): null => null);

    app.post(fileApiRouteMap.uploadFileList, async (request: $Request, response: $Response) => {
        const fileDataList: Array<ExpressFormDataFileType> = getFormDataFileList(request);
        const saveFileResultList: Array<string | Error> = await Promise.all(fileDataList.map(saveFile));

        const savedImageList: Array<string> = [];

        saveFileResultList.forEach((saveFileResult: string | Error) => {
            if (isString(saveFileResult)) {
                savedImageList.push(saveFileResult);
            }
        });

        response.json(savedImageList);
    });

    app.get(fileApiRouteMap.getFileList, async (request: $Request, response: $Response) => {
        fileSystem.readdir(cwd + fileApiConst.pathToUploadFiles, (error: Error | mixed, fileList: Array<string>) => {
            if (Array.isArray(fileList)) {
                response.json(fileList);
                return;
            }

            response.status(400);
            response.json({isSuccessful: false, errorList: [String(error)]});
        });
    });

    app.get(fileApiRouteMap.getFileListWithoutParent, async (request: $Request, response: $Response) => {
        fileSystem.readdir(cwd + fileApiConst.pathToUploadFiles, (error: Error | mixed, fileList: Array<string>) => {
            if (isError(error) || !Array.isArray(fileList)) {
                response.status(400);
                response.json({isSuccessful: false, errorList: [String(error)]});
                return;
            }

            // eslint-disable-next-line complexity
            (async () => {
                const fileListWithoutParent: Array<string> = [];

                // eslint-disable-next-line no-loops/no-loops
                for (const fileName of fileList) {
                    const documentList = await findDocumentListByOrList([{fileList: fileName}, {titleImage: fileName}]);

                    if (isError(documentList)) {
                        console.error('Error: can not get document for:', fileName);
                    }

                    if (isNotError(documentList) && documentList.length === 0 && fileName !== faviconPngFileName) {
                        fileListWithoutParent.push(fileName);
                    }
                }

                response.json(fileListWithoutParent);
            })();
        });
    });

    // eslint-disable-next-line max-statements
    app.get(fileApiRouteMap.getResizedImage + '/*', async (request: $Request, response: $Response) => {
        const imageName = String(request.params['0']);

        if (imageName.endsWith('.svg')) {
            response.sendFile(path.join(cwd, fileApiConst.pathToUploadFiles, imageName));
            return;
        }

        const resizeConfig = getImageResizeParameters(request);
        const configId = getSlug(JSON.stringify(resizeConfig));
        const endFileName = configId + '--' + imageName;
        const pathToCachedFile = path.join(cwd, fileApiConst.pathToUploadFilesCache, endFileName);
        const isFileExists = await getIsFileExists(pathToCachedFile);

        if (isFileExists) {
            // console.log('get file from cache', pathToCachedFile);
            response.sendFile(pathToCachedFile);
            return;
        }

        const pathToTemporaryFile = path.join(cwd, fileApiConst.pathToUploadFilesTemp, endFileName);

        const resizeResult = await sharp(path.join(cwd, fileApiConst.pathToUploadFiles, imageName))
            .resize(resizeConfig)
            .toFile(pathToTemporaryFile)
            .catch(promiseCatch);

        if (isError(resizeResult)) {
            response.status(400);
            response.json({isSuccessful: false, errorList: [resizeResult]});
            return;
        }

        const compressImageResult = await compressImage(
            pathToTemporaryFile,
            path.join(cwd, fileApiConst.pathToUploadFilesCache)
        );

        fileSystem.unlink(pathToTemporaryFile, () => {});

        if (isError(compressImageResult)) {
            response.status(400);
            response.json({isSuccessful: false, errorList: [compressImageResult]});
            return;
        }

        // console.log('send new file', pathToCachedFile);

        response.sendFile(pathToCachedFile);
    });
}
