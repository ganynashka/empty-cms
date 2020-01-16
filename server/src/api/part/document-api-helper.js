// @flow

import {type MongoCollection} from 'mongodb';

import type {MongoDocumentTreeNodeType as MongoDTNType, MongoDocumentType} from '../../database/database-type';
import {getCollection} from '../../database/database-helper';
import {dataBaseConst} from '../../database/database-const';
import {promiseCatch} from '../../../../www/js/lib/promise';
import {hasProperty, isError, isNull} from '../../../../www/js/lib/is';
import {documentApiRouteMap} from '../api-route-map';

export type MayBeDocumentType = MongoDocumentType | Error | null;

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
