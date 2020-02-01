// @flow

import type {MongoDocumentType} from '../../database/database-type';
import {hasProperty, isError} from '../../../../www/js/lib/is';
import type {RootPathDataType} from '../../../../www/js/provider/intial-data/intial-data-type';

import type {MayBeDocumentType} from './document-api-helper';
import {getDocumentBySlugMemoized} from './document-api-helper';
import {rootDocumentSlug} from './document-api-const';

export async function getRootPathData(): Promise<RootPathDataType | null> {
    const mongoDocument = await getDocumentBySlugMemoized(rootDocumentSlug);

    if (!mongoDocument || isError(mongoDocument)) {
        return null;
    }

    const mayBeSubDocumentList: Array<MayBeDocumentType> = await Promise.all(
        mongoDocument.subDocumentSlugList.map(getDocumentBySlugMemoized)
    );

    const subDocumentList: Array<MongoDocumentType> = [];

    mayBeSubDocumentList.forEach((mongoDocumentInList: MayBeDocumentType) => {
        if (!mongoDocumentInList || isError(mongoDocumentInList)) {
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
