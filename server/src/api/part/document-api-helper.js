// @flow

import {type MongoCollection} from 'mongodb';

import type {MongoDocumentTreeNodeType as MongoDTNType, MongoDocumentType} from '../../database/database-type';
import {getCollection} from '../../database/database-helper';
import {dataBaseConst} from '../../database/database-const';
import {promiseCatch} from '../../../../www/js/lib/promise';
import {hasProperty, isError, isNull} from '../../../../www/js/lib/is';
import {documentApiRouteMap} from '../api-route-map';

type MayBeDocumentType = MongoDocumentType | Error | null;

export function getDocumentBySlug(slug: string): Promise<MayBeDocumentType> {
    return getCollection<MongoDocumentType>(dataBaseConst.name, dataBaseConst.collection.document)
        .then((collection: MongoCollection<MongoDocumentType> | Error): Promise<MongoDocumentType | null> => {
            if (isError(collection)) {
                throw collection;
            }

            return collection.findOne({slug});
        })
        .catch(promiseCatch);
}

export async function getDocumentParentListBySlug(slug: string): Promise<Array<MongoDocumentType> | Error> {
    const collection = await getCollection<MongoDocumentType>(dataBaseConst.name, dataBaseConst.collection.document);

    if (isError(collection)) {
        return collection;
    }

    return new Promise((resolve: (documentListOrError: Array<MongoDocumentType> | Error) => mixed) => {
        collection
            // $FlowFixMe
            .find({subDocumentSlugList: slug})
            .toArray((error: Error | null, rawDocumentList: Array<MongoDocumentType> | null) => {
                if (error) {
                    resolve(new Error(documentApiRouteMap.getParentList + ': Can not read document collection!'));
                    return;
                }

                if (!Array.isArray(rawDocumentList)) {
                    resolve(new Error(documentApiRouteMap.getParentList + ': Can not read document collection!'));
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

function getDocumentTree(slug: string, deep: number): Promise<MongoDTNType | Error> {
    return getDocumentBySlug(slug).then((mongoDocument: MayBeDocumentType): Promise<MongoDTNType | Error> => {
        if (isError(mongoDocument) || isNull(mongoDocument) || !mongoDocument.isActive) {
            // console.error('Can not get document tree');
            // console.error(mongoDocument);

            // eslint-disable-next-line promise/no-return-wrap
            return Promise.resolve(new Error('Can not get document tree'));
        }

        const rootDocumentTreeNode: MongoDTNType = {
            subNodeList: [],
            subDocumentSlugList: [...mongoDocument.subDocumentSlugList],
            slug: mongoDocument.slug,
            titleImage: mongoDocument.titleImage,
            type: mongoDocument.type,
            header: mongoDocument.header,
            meta: mongoDocument.meta,
            shortDescription: mongoDocument.shortDescription,
            content: mongoDocument.content,
            isActive: mongoDocument.isActive,
            imageList: mongoDocument.imageList,
        };

        return getDocumentTreeRecursively(rootDocumentTreeNode, deep);
    });
}

const documentTreeCache = {};

export function clearGetDocumentTreeCache() {
    Object.keys(documentTreeCache).forEach((key: string) => {
        documentTreeCache[key] = null;
    });
}

export function getDocumentTreeMemoized(slug: string, deep: number): Promise<MongoDTNType | Error> {
    const cacheKey = `key-slug:${slug}-deep:${deep}`;

    if (hasProperty(documentTreeCache, cacheKey) && documentTreeCache[cacheKey]) {
        return documentTreeCache[cacheKey];
    }

    documentTreeCache[cacheKey] = getDocumentTree(slug, deep)
        .then((result: MongoDTNType | Error): MongoDTNType | Error => {
            if (isError(result)) {
                documentTreeCache[cacheKey] = null;
            }

            return result;
        })
        .catch((error: Error): Error => {
            documentTreeCache[cacheKey] = null;
            return error;
        });

    return documentTreeCache[cacheKey];
}

function getDocumentTreeRecursively(
    currentRoot: MongoDTNType,
    deep: number
    // collection: MongoCollection<MongoDocumentType>
): Promise<MongoDTNType | Error> {
    if (deep === 0) {
        // console.log('---> Error: deep is 0');
        return Promise.resolve(currentRoot);
    }

    const {subDocumentSlugList} = currentRoot;

    if (subDocumentSlugList.length === 0) {
        return Promise.resolve(currentRoot);
    }

    return Promise.all(subDocumentSlugList.map(getDocumentBySlug))
        .then((documentListOrError: Array<MayBeDocumentType>): Promise<MongoDTNType> => {
            documentListOrError.map((documentOrError: MayBeDocumentType) => {
                if (isError(documentOrError) || isNull(documentOrError)) {
                    // console.error('can not get document');
                    // console.error(documentOrError);
                    return;
                }

                if (!documentOrError) {
                    // console.log('document is not active');
                    return;
                }

                if (documentOrError.isActive !== true) {
                    return;
                }

                currentRoot.subNodeList.push({
                    subNodeList: [],
                    subDocumentSlugList: [...documentOrError.subDocumentSlugList],
                    slug: documentOrError.slug,
                    titleImage: documentOrError.titleImage,
                    type: documentOrError.type,
                    header: documentOrError.header,
                    meta: documentOrError.meta,
                    shortDescription: documentOrError.shortDescription,
                    content: documentOrError.content,
                    isActive: documentOrError.isActive,
                    imageList: documentOrError.imageList,
                });
            });

            const promiseList = currentRoot.subNodeList.map((subNode: MongoDTNType): Promise<MongoDTNType | Error> => {
                return getDocumentTreeRecursively(subNode, deep - 1);
            });

            // eslint-disable-next-line promise/no-nesting
            return Promise.all(promiseList).then((): MongoDTNType => currentRoot);
        })
        .catch((error: Error): MongoDTNType => {
            // console.error(error.message);
            // console.error(error);

            return currentRoot;
        });
}

export async function getOrphanList(): Promise<Array<MongoDocumentType> | Error> {
    const collection = await getCollection<MongoDocumentType>(dataBaseConst.name, dataBaseConst.collection.document);

    if (isError(collection)) {
        return collection;
    }

    return new Promise((resolve: (documentList: Array<MongoDocumentType> | Error) => mixed) => {
        collection.find({}).toArray((error: Error | null, documentList: Array<MongoDocumentType> | null) => {
            if (error || !Array.isArray(documentList)) {
                resolve(new Error('Can not read document list'));
                return;
            }

            const orphanList = documentList.filter((orphanDocument: MongoDocumentType): boolean => {
                return documentList.every((mongoDocument: MongoDocumentType): boolean => {
                    return !mongoDocument.subDocumentSlugList.includes(orphanDocument.slug);
                });
            });

            resolve(orphanList);
        });
    });
}
