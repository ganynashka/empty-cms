/*
// @flow

import type {MongoDocumentTreeNodeType as MongoDTNType} from '../../database/database-type';
import {hasProperty, isError, isNull} from '../../../../www/js/lib/is';

import type {MayBeDocumentType} from './document-api-helper';
import {getDocumentBySlugMemoized} from './document-api-helper';

function getDocumentTree(slug: string, deep: number): Promise<MongoDTNType | Error> {
    return getDocumentBySlugMemoized(slug).then((mongoDocument: MayBeDocumentType): Promise<MongoDTNType | Error> => {
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
            subDocumentListViewType: mongoDocument.subDocumentListViewType,
            header: mongoDocument.header,
            author: mongoDocument.author,
            illustrator: mongoDocument.illustrator,
            artist: mongoDocument.artist,
            title: mongoDocument.title,
            meta: mongoDocument.meta,
            shortDescription: mongoDocument.shortDescription,
            content: mongoDocument.content,
            isActive: mongoDocument.isActive,
            fileList: mongoDocument.fileList,
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

    return Promise.all(subDocumentSlugList.map(getDocumentBySlugMemoized))
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
                    subDocumentListViewType: documentOrError.subDocumentListViewType,
                    title: documentOrError.title,
                    header: documentOrError.header,
                    author: documentOrError.author,
                    illustrator: documentOrError.illustrator,
                    artist: documentOrError.artist,
                    meta: documentOrError.meta,
                    shortDescription: documentOrError.shortDescription,
                    content: documentOrError.content,
                    isActive: documentOrError.isActive,
                    fileList: documentOrError.fileList,
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
*/
