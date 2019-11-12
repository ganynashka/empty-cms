// @flow

import {promises as fsPromises} from 'fs';
import path from 'path';

import {pathToDist} from '../../webpack/config';
import {promiseCatch} from '../../www/js/lib/promise';

import {stringForReplace} from './config';

let indexHtmlTemplate: string = stringForReplace;

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
