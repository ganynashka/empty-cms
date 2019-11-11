// @flow

import fileSystem from 'fs';

import {type $Application, type $Request, type $Response} from 'express';
import {type ExpressFormDataFileType} from 'express-fileupload';

import {getFileList, saveFile} from '../util/file';
import {cwd} from '../../../webpack/config';

import {fileApiRouteMap} from './route-map';
import {fileApiConst} from './file-const';

export function addFileApi(app: $Application) {
    fileSystem.mkdir(fileApiConst.pathToUploadFiles, (): null => null);

    app.post(fileApiRouteMap.uploadImageList, async (request: $Request, response: $Response) => {
        const fileDataList: Array<ExpressFormDataFileType> = getFileList(request);
        const saveFileResultList = await Promise.all(fileDataList.map(saveFile));
        const errorMessageList: Array<string> = saveFileResultList
            .filter(Boolean)
            .map((error: Error): string => error.message);

        response.json({isSuccessful: errorMessageList.length === 0, errorList: errorMessageList});
    });
}
