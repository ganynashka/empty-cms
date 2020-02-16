// @flow

import type {MongoDocumentType} from '../../database/database-type';
import {hasProperty, isError} from '../../../../www/js/lib/is';
import type {RootPathDataType} from '../../../../www/js/provider/intial-data/intial-data-type';

import type {MayBeDocumentType} from './document-api-helper-get-document';
import {getDocumentBySlugMemoized} from './document-api-helper-get-document';
import {rootDocumentSlug} from './document-api-const';

export async function getRootPathData(): Promise<RootPathDataType | null> {
    const mongoDocument = await getDocumentBySlugMemoized({slug: rootDocumentSlug});

    if (!mongoDocument || isError(mongoDocument)) {
        return null;
    }

    const mayBeSubDocumentList: Array<MayBeDocumentType> = await Promise.all(
        mongoDocument.subDocumentIdList.map((idInList: string): Promise<MayBeDocumentType> =>
            getDocumentBySlugMemoized({id: idInList})
        )
    );

    const subDocumentList: Array<MongoDocumentType> = [];

    mayBeSubDocumentList.forEach((mongoDocumentInList: MayBeDocumentType) => {
        if (!mongoDocumentInList || isError(mongoDocumentInList)) {
            return;
        }

        if (mongoDocumentInList.isActive === false) {
            return;
        }

        subDocumentList.push(mongoDocumentInList);
    });

    return {
        mongoDocument,
        subDocumentList,
    };
}

const rootPathDataCache = {};

export function clearGetRootPathDataCache() {
    Object.keys(rootPathDataCache).forEach((key: string) => {
        rootPathDataCache[key] = null;
    });
}

export function getRootPathDataMemoized(): Promise<RootPathDataType | null> {
    const cacheKey = `key-slug:${rootDocumentSlug}`;

    if (hasProperty(rootPathDataCache, cacheKey) && rootPathDataCache[cacheKey]) {
        return rootPathDataCache[cacheKey];
    }

    rootPathDataCache[cacheKey] = getRootPathData()
        .then((result: RootPathDataType | null): RootPathDataType | null => {
            if (isError(result)) {
                rootPathDataCache[cacheKey] = null;
            }

            return result;
        })
        .catch((error: Error): Error => {
            rootPathDataCache[cacheKey] = null;
            return error;
        });

    return rootPathDataCache[cacheKey];
}
