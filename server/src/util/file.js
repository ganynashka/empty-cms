// @flow

import {type $Request} from 'express';
import {type ExpressFormDataFileType} from 'express-fileupload';

import {isError, isObject} from '../../../www/js/lib/is';
import {fileApiConst} from '../api/file-const';

export function getFileList(request: $Request): Array<ExpressFormDataFileType> {
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

export function saveFile(fileData: ExpressFormDataFileType): Promise<null | Error> {
    const fileDataName = fileData.name;
    const [fileExtension] = fileDataName.match(/\.\w+$/) || ['']; // "some.file.txt" -> ".txt"
    const fileName = fileDataName.slice(0, fileDataName.length - fileExtension.length);
    const endFileName = `${fileName}-${Date.now()}${fileExtension}`;

    return new Promise<Error | null>((resolve: (Error | null) => mixed) => {
        fileData.mv(fileApiConst.pathToUploadFiles + '/' + endFileName, (error: Error | mixed) => {
            resolve(isError(error) ? error : null);
        });
    });
}
