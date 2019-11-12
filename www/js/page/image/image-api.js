// @flow

/* global FormData, window */

import {fileApiRouteMap} from '../../../../server/src/api/route-map';
import {fileApiConst} from '../../../../server/src/api/file-const';
import {promiseCatch} from '../../lib/promise';
import type {MainServerApiResponseType} from '../../type/response';

export function uploadImageList(fileList: Array<File>): Promise<Error | MainServerApiResponseType> {
    const formData = new FormData();

    fileList.forEach((file: File): mixed => formData.append(fileApiConst.fileListFormPropertyName, file));

    return window
        .fetch(fileApiRouteMap.uploadImageList, {method: 'POST', body: formData})
        .then((response: Response): Promise<MainServerApiResponseType> => response.json())
        .catch(promiseCatch);
}

export function getImageList(): Promise<Array<string> | Error | MainServerApiResponseType> {
    return window
        .fetch(fileApiRouteMap.getFileList)
        .then((response: Response): Promise<Array<string> | MainServerApiResponseType> => response.json())
        .catch(promiseCatch);
}
