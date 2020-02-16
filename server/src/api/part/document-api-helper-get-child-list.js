// @flow

import type {MongoDocumentShortDataType, MongoDocumentType} from '../../database/database-type';
import {hasProperty, isError} from '../../../../www/js/lib/is';
import {promiseCatch} from '../../../../www/js/lib/promise';

import type {MayBeDocumentType} from './document-api-helper';
import {getDocumentBySlugMemoized} from './document-api-helper';
import {getDocumentParentListById} from './document-api-helper-get-parent-list';

export async function getSiblingLinkDataList(slug: string): Promise<Array<MongoDocumentShortDataType> | Error> {
    const parentList = await getDocumentParentListById(slug);

    if (isError(parentList)) {
        return parentList;
    }

    const slugList: Array<string> = [];

    parentList.forEach((parent: MongoDocumentType) => {
        slugList.push(...parent.subDocumentSlugList);
    });

    return Promise.all(slugList.map(getDocumentBySlugMemoized))
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

export function getSiblingLinkDataListMemoized(slug: string): Promise<Array<MongoDocumentShortDataType> | Error> {
    const cacheKey = `key-slug:${slug}`;

    if (hasProperty(siblingLinkDataListCache, cacheKey) && siblingLinkDataListCache[cacheKey]) {
        return siblingLinkDataListCache[cacheKey];
    }

    siblingLinkDataListCache[cacheKey] = getSiblingLinkDataList(slug)
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
