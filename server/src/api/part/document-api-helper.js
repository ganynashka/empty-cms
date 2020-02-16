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
            if (isError(collection)) {
                return collection;
            }

            return collection.findOne({slug});
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

export async function getOrphanList(): Promise<Array<MongoDocumentType> | Error> {
    const collection = await getCollection<MongoDocumentType>(dataBaseConst.name, dataBaseConst.collection.document);

    if (isError(collection)) {
        return collection;
    }

    return new Promise((resolve: (documentList: Array<MongoDocumentType> | Error) => mixed) => {
        collection.find({}).toArray((error: ?Error, documentList: ?Array<MongoDocumentType>) => {
            if (error || !Array.isArray(documentList)) {
                resolve(new Error('Can not read document list'));
                return;
            }

            const orphanList = documentList.filter((orphanDocument: MongoDocumentType): boolean => {
                return documentList.every((mongoDocument: MongoDocumentType): boolean => {
                    return !mongoDocument.subDocumentIdList.includes(orphanDocument.id);
                });
            });

            resolve(orphanList);
        });
    });
}
