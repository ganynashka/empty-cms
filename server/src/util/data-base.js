// @flow

import {exec} from 'child_process';

import type {PromiseResolveType} from '../../../www/js/lib/promise';
import {isError} from '../../../www/js/lib/is';
import {dataBaseConst} from '../database/database-const';
import {clearGetDocumentTreeCache} from '../api/part/document-api-helper-get-document-tree';
import {clearGetDocumentParentListCache} from '../api/part/document-api-helper-get-parent-list';
import {clearGetSiblingLinkDataListCache} from '../api/part/document-api-helper-get-child-list';
import {clearGetDocumentBySlugCache} from '../api/part/document-api-helper';
import {clearGetArticlePathDataCache} from '../api/part/document-api-helper-get-article-path-data';
import {clearGetRootPathDataCache} from '../api/part/document-api-helper-get-root-path-data';

import {updateSiteMapXml} from './site-map-xml-helper';

export function handleDataBaseChange(): Promise<mixed> {
    return updateSiteMapXml()
        .then((): mixed => console.log('/sitemap.xml has been updated'))
        .then(makeDataBaseBackUp)
        .then((): true => {
            clearGetDocumentTreeCache();
            clearGetDocumentBySlugCache();
            clearGetDocumentParentListCache();
            clearGetSiblingLinkDataListCache();
            clearGetArticlePathDataCache();
            clearGetRootPathDataCache();

            return true;
        })
        .catch((error: Error) => {
            console.log('---> handleDataBaseChange: error while execution!');
            console.log(error.message);
        });
}

export async function makeDataBaseBackUp(): Promise<null | Error> {
    return new Promise((resolve: PromiseResolveType<null | Error>) => {
        exec(dataBaseConst.shallCommand.backup, (error: ?Error, stdout: string | Buffer, stderr: string | Buffer) => {
            if (isError(error)) {
                console.log('---> Error:', stderr);
                resolve(error);
                return;
            }

            console.log(stdout);

            resolve(null);
        });
    });
}
