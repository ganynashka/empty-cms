// @flow

import type {MongoDocumentShortDataType} from '../../database/database-type';
import {hasProperty, isError} from '../../../../www/js/lib/is';
import type {ArticlePathDataType} from '../../../../www/js/provider/intial-data/intial-data-type';
import {documentToShortData} from '../../../../www/js/provider/intial-data/intial-data-helper';

import type {MayBeDocumentType} from './document-api-helper';
import {getDocumentBySlugMemoized} from './document-api-helper';

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
