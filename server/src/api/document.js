// @flow

import {type $Application, type $Request, type $Response} from 'express';

import {typeConverter} from '../../../www/js/lib/type';
import {getCollection} from '../db/util';
import type {MongoDocumentType} from '../db/type';
import {dataBaseConst} from '../db/const';
import {getTime} from '../util/time';

import {streamOptionsArray} from './helper';

export function addDocumentApi(app: $Application) {
    app.get('/api/get-document-list', async (request: $Request, response: $Response) => {
        console.log('---> /api/get-document-list');

        const collection = await getCollection<MongoDocumentType>(
            dataBaseConst.name,
            dataBaseConst.collection.document
        );

        // TODO: try to remove "await", because work without it
        (await collection)
            .find({})
            .stream(streamOptionsArray)
            .pipe(response.type('json'));
    });

    app.post('/api/create-document', async (request: $Request, response: $Response) => {
        console.log('---> /api/create-document');

        const mongoDocument: MongoDocumentType = typeConverter<MongoDocumentType>(request.body);

        const documentCollection = await getCollection<MongoDocumentType>(
            dataBaseConst.name,
            dataBaseConst.collection.document
        );

        console.log('---- mongoDocument ----');
        console.log(mongoDocument);

        const date = getTime();

        const newDocument: MongoDocumentType = {
            ...mongoDocument,
            createdDate: date,
            updatedDate: date,
        };

        await documentCollection.insertOne(newDocument);

        response.json({created: true});
    });
}
