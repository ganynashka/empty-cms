// @flow

import path from 'path';
import fileSystem from 'fs';

import {type $Request} from 'express';
import {type ExpressFormDataFileType} from 'express-fileupload';

import {isError, isObject} from '../../../www/js/lib/is';
import {fileApiConst} from '../api/file-const';
import {cwd} from '../../../webpack/config';

export function getFormDataFileList(request: $Request): Array<ExpressFormDataFileType> {
    // $FlowFixMe
    const {files} = request;

    if (!isObject(files)) {
        return [];
    }

    const fileOrFileList: Array<ExpressFormDataFileType> | ExpressFormDataFileType
        = files[fileApiConst.fileListFormPropertyName];

    if (Array.isArray(fileOrFileList)) {
        return fileOrFileList;
    }

    return [fileOrFileList];
}

export function getFileNamePartList(fullFleName: string): [string, string] {
    const [fileExtension] = fullFleName.match(/\.\w+$/) || ['']; // "some.file.txt" -> ".txt"
    const fileName = fullFleName.slice(0, fullFleName.length - fileExtension.length);

    return [fileName, fileExtension];
}

export function saveFile(fileData: ExpressFormDataFileType): Promise<null | Error> {
    const [fileName, fileExtension] = getFileNamePartList(fileData.name);
    const endFileName = `${fileName}-${Date.now()}${fileExtension}`;

    return new Promise<Error | null>((resolve: (Error | null) => mixed) => {
        fileData.mv(path.join(cwd, fileApiConst.pathToUploadFiles, endFileName), (error: Error | mixed) => {
            resolve(isError(error) ? error : null);
        });
    });
}

export function getIsFileExists(pathToFile: string): Promise<boolean> {
    return fileSystem.promises
        .access(pathToFile)
        .then((): true => true)
        .catch((): false => false);
}
