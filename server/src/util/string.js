// @flow

import {getSlug} from '../../../www/js/lib/string';

function getFileNamePartList(fullFleName: string): [string, string] {
    const [fileExtension] = fullFleName.match(/\.\w+$/) || ['']; // "some.file.txt" -> ".txt"
    const fileName = fullFleName.slice(0, fullFleName.length - fileExtension.length);

    return [fileName, fileExtension];
}

export function getHashFileName(startFileName: string, md5: string): string {
    const [fileName, fileExtension] = getFileNamePartList(startFileName);

    return `${getSlug(fileName)}--hash__${md5}__--${fileExtension}`;
}

export function getNoHashFileName(startFileName: string): string {
    return startFileName.replace(/--hash__[\S\s]+__--/, '');
}
