// @flow

import type {MongoDocumentType} from '../database/database-type';
import type {PromiseResolveType} from '../../../www/js/lib/promise';
import {getCollection} from '../database/database-helper';
import {dataBaseConst} from '../database/database-const';
import {isError} from '../../../www/js/lib/is';

export async function getAllDocumentList(): Promise<Array<MongoDocumentType> | Error> {
    const collection = await getCollection<MongoDocumentType>(dataBaseConst.name, dataBaseConst.collection.document);

    if (isError(collection)) {
        return collection;
    }

    return new Promise((resolve: PromiseResolveType<Array<MongoDocumentType> | Error>) => {
        collection.find({}).toArray((error: ?Error, documentList: ?Array<MongoDocumentType>) => {
            if (isError(error)) {
                resolve(error);
                return;
            }

            if (!Array.isArray(documentList)) {
                resolve(new Error('Can not get document list'));
                return;
            }

            resolve(documentList);
        });
    });
}

export async function findDocumentListByOrList(
    search: Array<{[property: string]: string | RegExp}>
): Promise<Array<MongoDocumentType> | Error> {
    const collection = await getCollection<MongoDocumentType>(dataBaseConst.name, dataBaseConst.collection.document);

    if (isError(collection)) {
        return collection;
    }

    return new Promise((resolve: PromiseResolveType<Array<MongoDocumentType> | Error>) => {
        collection
            // $FlowFixMe
            .find({$or: search})
            .toArray((error: ?Error, documentList: ?Array<MongoDocumentType>) => {
                if (error) {
                    resolve(error);
                    return;
                }

                if (!documentList) {
                    resolve([]);
                    return;
                }

                resolve(documentList);
            });
    });
}
