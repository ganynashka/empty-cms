// @flow

import {promises as fsPromises} from 'fs';
import path from 'path';

import {pathToDist} from '../../webpack/config';
import {promiseCatch} from '../../www/js/lib/promise';

import {stringForReplaceContent, stringForReplaceIconList} from './config';
import {generateIconList} from './util/icon';

let indexHtmlTemplate: string = stringForReplaceContent;

fsPromises
    .readFile(path.join('.', pathToDist, 'index.html'), 'utf8')
    .then((fileText: string): string => {
        indexHtmlTemplate = fileText.replace(stringForReplaceIconList, generateIconList());
        return indexHtmlTemplate;
    })
    .catch(promiseCatch);

export function getIndexHtmlTemplate(): string {
    return indexHtmlTemplate;
}
