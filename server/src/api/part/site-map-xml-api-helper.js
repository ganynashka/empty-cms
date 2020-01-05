// @flow

import {MongoCollection} from 'mongodb';

import {getCollection} from '../../database/database-helper';
import type {MongoDocumentType} from '../../database/database-type';
import {dataBaseConst} from '../../database/database-const';
import {promiseCatch} from '../../../../www/js/lib/promise';
import {isError} from '../../../../www/js/lib/is';
import {documentApiRouteMap} from '../api-route-map';
import type {PromiseResolveType} from '../../../../www/js/lib/promise';

export function getAllDocumentList(): Promise<Array<MongoDocumentType> | Error> {
    return new Promise(async (resolve: PromiseResolveType<Array<MongoDocumentType> | Error>) => {
        const collection = await getCollection<MongoDocumentType>(
            dataBaseConst.name,
            dataBaseConst.collection.document
        );

        if (isError(collection)) {
            resolve(collection);
            return;
        }

        collection.find({}).toArray((error: Error | null, documentList: Array<MongoDocumentType> | null) => {
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

export function mongoDocumentToSiteMapXml(mongoDocument: MongoDocumentType): string {
    const locTag = 'http://134.209.235.147/';
    const lastmodTag = new Date(mongoDocument.updatedDate);
    const changefreqTag = 'http://134.209.235.147/';
    const priorityTag = 'http://134.209.235.147/';

    return ['<url>', ''].join('\n');
}
