// @flow

import {type MongoCollection} from 'mongodb';

import type {MongoDocumentTreeNodeType as MongoDTNType, MongoDocumentType} from '../../database/database-type';
import {getCollection} from '../../database/database-helper';
import {dataBaseConst} from '../../database/database-const';
import {promiseCatch} from '../../../../www/js/lib/promise';
import {isError, isNull} from '../../../../www/js/lib/is';

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

export function getDocumentTree(slug: string, deep: number): Promise<MongoDTNType | Error> {
    return getDocumentBySlug(slug).then((mongoDocument: MayBeDocumentType): Promise<MongoDTNType | Error> => {
        if (isError(mongoDocument) || isNull(mongoDocument)) {
            console.error('Can not get document tree');
            console.error(mongoDocument);

            // eslint-disable-next-line promise/no-return-wrap
            return Promise.resolve(new Error('Can not get document tree'));
        }

        const rootDocumentTreeNode: MongoDTNType = {
            subNodeList: [],
            subDocumentSlugList: [...mongoDocument.subDocumentSlugList],
            slug: mongoDocument.slug,
            titleImage: mongoDocument.titleImage,
            type: mongoDocument.type,
            title: mongoDocument.title,
            isActive: mongoDocument.isActive,
        };

        return getDocumentTreeRecursively(rootDocumentTreeNode, deep);
    });
}

function getDocumentTreeRecursively(
    currentRoot: MongoDTNType,
    deep: number
    // collection: MongoCollection<MongoDocumentType>
): Promise<MongoDTNType | Error> {
    if (deep === 0) {
        console.log('---> Error: deep is 0');
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
                    console.error('can not get document');
                    console.error(documentOrError);
                    return;
                }

                currentRoot.subNodeList.push({
                    subNodeList: [],
                    subDocumentSlugList: [...documentOrError.subDocumentSlugList],
                    slug: documentOrError.slug,
                    titleImage: documentOrError.titleImage,
                    type: documentOrError.type,
                    title: documentOrError.title,
                    isActive: documentOrError.isActive,
                });
            });

            const promiseList = currentRoot.subNodeList.map((subNode: MongoDTNType): Promise<MongoDTNType | Error> => {
                return getDocumentTreeRecursively(subNode, deep - 1);
            });

            // eslint-disable-next-line promise/no-nesting
            return Promise.all(promiseList).then((): MongoDTNType => currentRoot);
        })
        .catch((error: Error): MongoDTNType => {
            console.error(error.message);
            console.error(error);

            return currentRoot;
        });
}
