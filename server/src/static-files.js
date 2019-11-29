// @flow

import {promises as fsPromises} from 'fs';
import path from 'path';

import {pathToDist} from '../../webpack/config';
import {promiseCatch} from '../../www/js/lib/promise';

import {stringForReplaceContent} from './config';

let indexHtmlTemplate: string = stringForReplaceContent;

fsPromises
    .readFile(path.join('.', pathToDist, 'index.html'), 'utf8')
    .then((fileText: string): string => {
        indexHtmlTemplate = fileText;
        return fileText;
    })
    .catch(promiseCatch);

export function getIndexHtmlTemplate(): string {
    return indexHtmlTemplate;
}
