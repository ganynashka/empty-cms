// @flow

import {type $Request} from 'express';
import {type ExpressFormDataFileType} from 'express-fileupload';

import {fileApiConst} from '../api/route-map';
import {isObject} from '../../../www/js/lib/is';

export function getFileList(request: {
    ...$Request,
    files?: {[key: string]: Array<ExpressFormDataFileType>},
}): Array<ExpressFormDataFileType> {
    const {files} = request;

    if (!isObject(files)) {
        return [];
    }

    const filesList = files[fileApiConst.fileListFormPropertyName];

    return filesList || [];
}
