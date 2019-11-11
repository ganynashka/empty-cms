// @flow

import {type $Application, type $Request, type $Response} from 'express';
import {type ExpressFormDataFileType} from 'express-fileupload';

import {getFileList} from '../util/file';

import {fileApiRouteMap} from './route-map';

export function addFileApi(app: $Application) {
    app.post(fileApiRouteMap.uploadImageList, async (request: $Request, response: $Response) => {
        const fileDataList: Array<ExpressFormDataFileType> = getFileList(request);

        console.log(fileDataList);

        response.send('1');
    });
}
