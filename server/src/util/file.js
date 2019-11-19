// @flow

import path from 'path';
import fileSystem from 'fs';

import {type $Request} from 'express';
import {type ExpressFormDataFileType} from 'express-fileupload';
import imagemin from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';
import imageminJpegtran from 'imagemin-jpegtran';

import {isError, isObject} from '../../../www/js/lib/is';
import {fileApiConst} from '../api/file-const';
import {cwd} from '../../../webpack/config';
import {promiseCatch} from '../../../www/js/lib/promise';
import {getSlug} from '../../../www/js/lib/string';

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

export function saveFile(fileData: ExpressFormDataFileType): Promise<string | Error> {
    const [fileName, fileExtension] = getFileNamePartList(fileData.name);
    const endFileName = `${getSlug(fileName)}--md5__${fileData.md5}__--${fileExtension}`;

    return new Promise<string | Error>((resolve: (string | Error) => mixed) => {
        fileData.mv(path.join(cwd, fileApiConst.pathToUploadFiles, endFileName), (error: Error | mixed) => {
            resolve(isError(error) ? error : endFileName);
        });
    });
}

export function getIsFileExists(pathToFile: string): Promise<boolean> {
    return fileSystem.promises
        .access(pathToFile)
        .then((): true => true)
        .catch((): false => false);
}

export function compressImage(pathToFile: string, pathToFolder: string): Promise<null | Error> {
    return imagemin([pathToFile], {
        destination: pathToFolder,
        plugins: [imageminJpegtran(), imageminPngquant({quality: [0.6, 0.8]})],
    })
        .then((): null => null)
        .catch(promiseCatch);
}
