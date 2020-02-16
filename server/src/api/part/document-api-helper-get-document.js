// @flow

import {type MongoCollection} from 'mongodb';

import type {MongoDocumentType} from '../../database/database-type';
import {getCollection} from '../../database/database-helper';
import {dataBaseConst} from '../../database/database-const';
import {promiseCatch} from '../../../../www/js/lib/promise';
import {hasProperty, isError} from '../../../../www/js/lib/is';

export type MayBeDocumentType = ?MongoDocumentType | ?Error;

export function getDocumentBySlug(slug: string): Promise<MayBeDocumentType> {
    return getCollection<MongoDocumentType>(dataBaseConst.name, dataBaseConst.collection.document)
        .then((collection: MongoCollection<MongoDocumentType> | Error): Promise<MayBeDocumentType> | Error => {
            return isError(collection) ? collection : collection.findOne({slug});
        })
        .catch(promiseCatch);
}

const getDocumentBySlugCache = {};

export function clearGetDocumentBySlugCache() {
    Object.keys(getDocumentBySlugCache).forEach((key: string) => {
        getDocumentBySlugCache[key] = null;
    });
}

export function getDocumentBySlugMemoized(slug: string): Promise<MayBeDocumentType> {
    const cacheKey = `key-slug:${slug}`;

    if (hasProperty(getDocumentBySlugCache, cacheKey) && getDocumentBySlugCache[cacheKey]) {
        return getDocumentBySlugCache[cacheKey];
    }

    getDocumentBySlugCache[cacheKey] = getDocumentBySlug(slug)
        .then((result: MayBeDocumentType): MayBeDocumentType => {
            if (isError(result) || !result) {
                getDocumentBySlugCache[cacheKey] = null;
            }

            return result;
        })
        .catch((error: Error): Error => {
            getDocumentBySlugCache[cacheKey] = null;
            return error;
        });

    return getDocumentBySlugCache[cacheKey];
}
