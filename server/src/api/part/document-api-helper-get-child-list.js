// @flow

import type {MongoDocumentLinkType, MongoDocumentType} from '../../database/database-type';
import {hasProperty, isError} from '../../../../www/js/lib/is';
import {promiseCatch} from '../../../../www/js/lib/promise';

import type {MayBeDocumentType} from './document-api-helper';
import {getDocumentBySlugMemoized} from './document-api-helper';
import {getDocumentParentListBySlug} from './document-api-helper-get-parent-list';

export async function getSiblingLinkDataList(slug: string): Promise<Array<MongoDocumentLinkType> | Error> {
    const parentList = await getDocumentParentListBySlug(slug);

    if (isError(parentList)) {
        return parentList;
    }

    const slugList: Array<string> = [];

    parentList.forEach((parent: MongoDocumentType) => {
        slugList.push(...parent.subDocumentSlugList);
    });

    return Promise.all(slugList.map(getDocumentBySlugMemoized))
        .then((documentList: Array<MayBeDocumentType>): Array<MongoDocumentLinkType> => {
            const filteredDocumentList: Array<MongoDocumentLinkType> = [];

            documentList.forEach((documentInList: MayBeDocumentType) => {
                if (isError(documentInList) || !documentInList) {
                    return;
                }

                filteredDocumentList.push({
                    type: documentInList.type,
                    slug: documentInList.slug,
                    header: documentInList.header,
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

export function getSiblingLinkDataListMemoized(slug: string): Promise<Array<MongoDocumentLinkType> | Error> {
    const cacheKey = `key-slug:${slug}`;

    if (hasProperty(siblingLinkDataListCache, cacheKey) && siblingLinkDataListCache[cacheKey]) {
        return siblingLinkDataListCache[cacheKey];
    }

    siblingLinkDataListCache[cacheKey] = getSiblingLinkDataList(slug)
        .then((result: Array<MongoDocumentLinkType> | Error): Array<MongoDocumentLinkType> | Error => {
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
