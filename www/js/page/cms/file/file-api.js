// @flow

/* global FormData, window */

import {fileApiRouteMap} from '../../../../../server/src/api/api-route-map';
import {fileApiConst} from '../../../../../server/src/api/part/file-api-const';
import {promiseCatch} from '../../../lib/promise';
import type {MainServerApiResponseType} from '../../../type/response';
import {isError} from '../../../lib/is';

export type SharpFitResizeNameType = 'contain' | 'cover' | 'fill' | 'inside' | 'outside';

export const sharpFitResizeNameMap = {
    contain: 'contain',
    cover: 'cover',
    fill: 'fill',
    inside: 'inside',
    outside: 'outside',
};

export function uploadFileList(fileList: Array<File>): Promise<Error | Array<string>> {
    const formData = new FormData();

    fileList.forEach((file: File): mixed => formData.append(fileApiConst.fileListFormPropertyName, file));

    return window
        .fetch(fileApiRouteMap.uploadFileList, {method: 'POST', body: formData})
        .then((response: Response): Promise<Array<string>> => response.json())
        .then((savedFileList: Array<string>): Array<string> | Error => {
            if (savedFileList.length !== fileList.length) {
                return new Error('Not All files saved!');
            }

            return savedFileList;
        })
        .catch(promiseCatch);
}

export function uploadFile(file: File): Promise<Error | string> {
    return uploadFileList([file])
        .then((uploadResult: Error | Array<string>): Error | string => {
            if (isError(uploadResult)) {
                return uploadResult;
            }

            if (uploadResult.length === 0) {
                return new Error('Can not save file!');
            }

            return uploadResult[0];
        })
        .catch(promiseCatch);
}

export function getResizedImage(
    src: string,
    width: number,
    height: number,
    fit: SharpFitResizeNameType = sharpFitResizeNameMap.inside
): string {
    return `${fileApiRouteMap.getResizedImage}/${src}?width=${width}&height=${height}&fit=${fit}`;
}

export function getMarkdownResizedImage(src: string): string {
    return `![](${getResizedImage(src, 1024, 1024)})`;
}

export function getMarkdownAudio(src: string): string {
    const audioSrc = fileApiConst.pathToUploadFiles + '/' + src;

    return `<audio controls src="${audioSrc}"/>`;
}

export function getFileList(): Promise<Array<string> | Error | MainServerApiResponseType> {
    return window
        .fetch(fileApiRouteMap.getFileList)
        .then((response: Response): Promise<Array<string> | MainServerApiResponseType> => response.json())
        .catch(promiseCatch);
}
