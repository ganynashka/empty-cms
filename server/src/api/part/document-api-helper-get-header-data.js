// @flow

import type {MongoDocumentShortDataType} from '../../database/database-type';
import {hasProperty, isError} from '../../../../www/js/lib/is';
import type {HeaderDataType} from '../../../../www/js/provider/intial-data/intial-data-type';
import {documentToShortData} from '../../../../www/js/provider/intial-data/intial-data-helper';

import type {MayBeDocumentType} from './document-api-helper-get-document';
import {getDocumentBySlugMemoized} from './document-api-helper-get-document';
import {rootDocumentSlug} from './document-api-const';

export async function getHeaderData(): Promise<HeaderDataType> {
    const rootDocument = await getDocumentBySlugMemoized({slug: rootDocumentSlug});

    if (!rootDocument || isError(rootDocument)) {
        return {documentShortDataList: []};
    }

    const documentShortDataList: Array<MongoDocumentShortDataType> = [];

    const subDocumentList: Array<MayBeDocumentType> = await Promise.all(
        rootDocument.subDocumentIdList.map((idInList: string): Promise<MayBeDocumentType> =>
            getDocumentBySlugMemoized({id: idInList})
        )
    );

    subDocumentList.forEach((mongoDocumentInList: MayBeDocumentType) => {
        if (!mongoDocumentInList || isError(mongoDocumentInList)) {
            return;
        }

        if (mongoDocumentInList.isActive === false) {
            return;
        }

        documentShortDataList.push(documentToShortData(mongoDocumentInList));
    });

    return {
        documentShortDataList,
    };
}

const headerDataCache = {};

export function clearGetHeaderDataCache() {
    Object.keys(headerDataCache).forEach((key: string) => {
        headerDataCache[key] = null;
    });
}

export function getHeaderDataMemoized(): Promise<HeaderDataType> {
    const cacheKey = `key-slug:${rootDocumentSlug}`;

    if (hasProperty(headerDataCache, cacheKey) && headerDataCache[cacheKey]) {
        return headerDataCache[cacheKey];
    }

    headerDataCache[cacheKey] = getHeaderData()
        .then((result: HeaderDataType): HeaderDataType => {
            if (isError(result)) {
                headerDataCache[cacheKey] = null;
            }

            return result;
        })
        .catch((error: Error): Error => {
            headerDataCache[cacheKey] = null;
            return error;
        });

    return headerDataCache[cacheKey];
}

/*

export async function getArticlePathData(slug: string): Promise<ArticlePathDataType | null> {
    const mongoDocument = await getDocumentBySlugMemoized(slug);

    if (!mongoDocument || isError(mongoDocument)) {
        return null;
    }

    const subDocumentList: Array<MayBeDocumentType> = await Promise.all(
        mongoDocument.subDocumentSlugList.map(getDocumentBySlugMemoized)
    );

    const sudNodeShortDataList: Array<MongoDocumentShortDataType> = [];

    subDocumentList.forEach((mongoDocumentInList: MayBeDocumentType) => {
        if (!mongoDocumentInList || isError(mongoDocumentInList)) {
            return;
        }

        sudNodeShortDataList.push(documentToShortData(mongoDocumentInList));
    });

    return {
        mongoDocument,
        sudNodeShortDataList,
    };
}

const articlePathDataCache = {};

export function clearGetArticlePathDataCache() {
    Object.keys(articlePathDataCache).forEach((key: string) => {
        articlePathDataCache[key] = null;
    });
}

export function getArticlePathDataMemoized(slug: string): Promise<ArticlePathDataType | null> {
    const cacheKey = `key-slug:${slug}`;

    if (hasProperty(articlePathDataCache, cacheKey) && articlePathDataCache[cacheKey]) {
        return articlePathDataCache[cacheKey];
    }

    articlePathDataCache[cacheKey] = getArticlePathData(slug)
        .then((result: ArticlePathDataType | null): ArticlePathDataType | null => {
            if (isError(result)) {
                articlePathDataCache[cacheKey] = null;
            }

            return result;
        })
        .catch((error: Error): Error => {
            articlePathDataCache[cacheKey] = null;
            return error;
        });

    return articlePathDataCache[cacheKey];
}
*/
