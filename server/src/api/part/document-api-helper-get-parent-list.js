// @flow

import type {MongoDocumentType} from '../../database/database-type';
import {getCollection} from '../../database/database-helper';
import {dataBaseConst} from '../../database/database-const';
import {hasProperty, isError} from '../../../../www/js/lib/is';
import {documentApiRouteMap} from '../api-route-map';
import {promiseCatch} from '../../../../www/js/lib/promise';

import type {MayBeDocumentType} from './document-api-helper';
import {getDocumentBySlugMemoized} from './document-api-helper';

export async function getDocumentParentListBySlug(slug: string): Promise<Array<MongoDocumentType> | Error> {
    const collection = await getCollection<MongoDocumentType>(dataBaseConst.name, dataBaseConst.collection.document);

    if (isError(collection)) {
        return collection;
    }

    return new Promise((resolve: (documentListOrError: Array<MongoDocumentType> | Error) => mixed) => {
        collection
            // $FlowFixMe
            .find({subDocumentSlugList: slug})
            .toArray((error: ?Error, rawDocumentList: ?Array<MongoDocumentType>) => {
                if (error) {
                    resolve(new Error(documentApiRouteMap.getParentList + ': Can not find document!'));
                    return;
                }

                if (!Array.isArray(rawDocumentList)) {
                    resolve(new Error(documentApiRouteMap.getParentList + ': Result is not Array!'));
                    return;
                }

                const documentList: Array<MongoDocumentType> = [];

                rawDocumentList.forEach((rawDocument: MongoDocumentType | null) => {
                    if (!rawDocument) {
                        return;
                    }

                    documentList.push(rawDocument);
                });

                resolve(documentList);
            });
    });
}

async function getDocumentFirstParentBySlug(slug: string): Promise<MayBeDocumentType> {
    const collection = await getCollection<MongoDocumentType>(dataBaseConst.name, dataBaseConst.collection.document);

    if (isError(collection)) {
        return collection;
    }

    // $FlowFixMe
    return collection.findOne({subDocumentSlugList: slug});
}

function getDocumentParentListRecursively(
    currentRoot: MongoDocumentType,
    deep: number,
    parentList: Array<MongoDocumentType>
): Promise<Array<MongoDocumentType> | Error> {
    if (parentList.length === 0) {
        parentList.push(currentRoot);
    }

    if (deep === 0) {
        // console.log('---> Error: deep is 0');
        return Promise.resolve(parentList);
    }

    return getDocumentFirstParentBySlug(currentRoot.slug)
        .then((documentOrError: MayBeDocumentType): Promise<Array<MongoDocumentType> | Error> => {
            if (isError(documentOrError)) {
                // eslint-disable-next-line promise/no-return-wrap
                return Promise.resolve(new Error('Can not get parent'));
            }

            if (!documentOrError) {
                // eslint-disable-next-line promise/no-return-wrap
                return Promise.resolve(parentList);
            }

            parentList.push(documentOrError);

            return getDocumentParentListRecursively(documentOrError, deep - 1, parentList);
        })
        .catch(promiseCatch);
}

async function getDocumentParentList(slug: string, deep: number): Promise<Array<MongoDocumentType> | Error> {
    const mongoDocument = await getDocumentBySlugMemoized(slug);

    if (isError(mongoDocument) || !mongoDocument) {
        return new Error('Can not get docuemnt by slug');
    }

    return getDocumentParentListRecursively(mongoDocument, deep, []);
}

const documentParentListCache = {};

export function clearGetDocumentParentListCache() {
    Object.keys(documentParentListCache).forEach((key: string) => {
        documentParentListCache[key] = null;
    });
}

export async function getDocumentParentListMemoized(
    slug: string,
    deep: number
): Promise<Array<MongoDocumentType> | Error> {
    const cacheKey = `key-slug:${slug}-deep:${deep}`;

    if (hasProperty(documentParentListCache, cacheKey) && documentParentListCache[cacheKey]) {
        return documentParentListCache[cacheKey];
    }

    documentParentListCache[cacheKey] = getDocumentParentList(slug, deep)
        .then((result: Array<MongoDocumentType> | Error): Array<MongoDocumentType> | Error => {
            if (isError(result)) {
                documentParentListCache[cacheKey] = null;
            }

            return result;
        })

        .catch((error: Error): Error => {
            documentParentListCache[cacheKey] = null;
            return error;
        });

    return documentParentListCache[cacheKey];
}
