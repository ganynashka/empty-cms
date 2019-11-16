// @flow

/* global FormData, window */

import {fileApiRouteMap} from '../../../../server/src/api/route-map';
import {fileApiConst} from '../../../../server/src/api/file-const';
import {promiseCatch} from '../../lib/promise';
import type {MainServerApiResponseType} from '../../type/response';

export type SharpFitResizeNameType = 'contain' | 'cover' | 'fill' | 'inside' | 'outside';

export const sharpFitResizeNameMap = {
    contain: 'contain',
    cover: 'cover',
    fill: 'fill',
    inside: 'inside',
    outside: 'outside',
};

export function uploadImageList(fileList: Array<File>): Promise<Error | MainServerApiResponseType> {
    const formData = new FormData();

    fileList.forEach((file: File): mixed => formData.append(fileApiConst.fileListFormPropertyName, file));

    return window
        .fetch(fileApiRouteMap.uploadImageList, {method: 'POST', body: formData})
        .then((response: Response): Promise<MainServerApiResponseType> => response.json())
        .catch(promiseCatch);
}

export function getResizedImage(
    src: string,
    width: number,
    height: number,
    fit?: SharpFitResizeNameType = sharpFitResizeNameMap.inside
): string {
    return `${fileApiRouteMap.getResizedImage}/${src}?width=${width}&height=${height}&fit=${fit}`;
}

export function getImageList(): Promise<Array<string> | Error | MainServerApiResponseType> {
    return window
        .fetch(fileApiRouteMap.getFileList)
        .then((response: Response): Promise<Array<string> | MainServerApiResponseType> => response.json())
        .catch(promiseCatch);
}
