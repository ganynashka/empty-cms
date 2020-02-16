// @flow

import {type MongoCollection} from 'mongodb';

import type {MongoDocumentType} from '../../database/database-type';
import {getCollection} from '../../database/database-helper';
import {dataBaseConst} from '../../database/database-const';
import {isError} from '../../../../www/js/lib/is';

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
