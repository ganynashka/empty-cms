// @flow

import type {MongoDocumentShortDataType, MongoDocumentType} from '../../database/database-type';
import {hasProperty, isError} from '../../../../www/js/lib/is';
import {promiseCatch} from '../../../../www/js/lib/promise';

import type {MayBeDocumentType} from './document-api-helper-get-document';
import {getDocumentBySlugMemoized} from './document-api-helper-get-document';
import {getDocumentParentListById} from './document-api-helper-get-parent-list';

export async function getSiblingLinkDataList(id: string): Promise<Array<MongoDocumentShortDataType> | Error> {
    const parentList = await getDocumentParentListById(id);

    if (isError(parentList)) {
        return parentList;
    }

    const idList: Array<string> = [];

    parentList.forEach((parent: MongoDocumentType) => {
        idList.push(...parent.subDocumentIdList);
    });

    return Promise.all(
        idList.map((idInList: string): Promise<MayBeDocumentType> => getDocumentBySlugMemoized({id: idInList}))
    )
        .then((documentList: Array<MayBeDocumentType>): Array<MongoDocumentShortDataType> => {
            const filteredDocumentList: Array<MongoDocumentShortDataType> = [];

            documentList.forEach((documentInList: MayBeDocumentType) => {
                if (isError(documentInList) || !documentInList) {
                    return;
                }

                if (documentInList.isActive === false) {
                    return;
                }

                filteredDocumentList.push({
                    id: documentInList.id,
                    slug: documentInList.slug,
                    type: documentInList.type,
                    header: documentInList.header,
                    titleImage: documentInList.titleImage,
                    subDocumentSlugList: documentInList.subDocumentSlugList,
                    subDocumentIdList: documentInList.subDocumentIdList,
                    fileList: documentInList.fileList,
                    isActive: documentInList.isActive,
                    contentLength: documentInList.content.length,
                });
            });

            return filteredDocumentList;
        })
        .catch(promiseCatch);
}

const siblingLinkDataListCache = {};

export function clearGetSiblingLinkDataListCache() {
    Object.keys(siblingLinkDataListCache).forEach((key: string) => {
        siblingLinkDataListCache[key] = null;
    });
}

export function getSiblingLinkDataListMemoized(id: string): Promise<Array<MongoDocumentShortDataType> | Error> {
    const cacheKey = `key-id:${id}`;

    if (hasProperty(siblingLinkDataListCache, cacheKey) && siblingLinkDataListCache[cacheKey]) {
        return siblingLinkDataListCache[cacheKey];
    }

    siblingLinkDataListCache[cacheKey] = getSiblingLinkDataList(id)
        .then((result: Array<MongoDocumentShortDataType> | Error): Array<MongoDocumentShortDataType> | Error => {
            if (isError(result)) {
                siblingLinkDataListCache[cacheKey] = null;
            }

            return result;
        })
        .catch((error: Error): Error => {
            siblingLinkDataListCache[cacheKey] = null;
            return error;
        });

    return siblingLinkDataListCache[cacheKey];
}
