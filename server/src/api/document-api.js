// @flow

import {type $Application, type $Request, type $Response} from 'express';

import {typeConverter} from '../../../www/js/lib/type';
import {getCollection} from '../db/util';
import type {MongoDocumentType} from '../db/type';
import {dataBaseConst} from '../db/const';
import {getTime} from '../util/time';

import {getListParameters, getSearchExactParameters, streamOptionsArray} from './helper';

export function addDocumentApi(app: $Application) {
    app.get('/api/get-document-list', async (request: $Request, response: $Response) => {
        console.log(
            '---> /api/get-document-list?page-index=11&page-size=33&sort-direction=1|-1&sort-parameter=createdDate'
        );

        const collection = await getCollection<MongoDocumentType>(
            dataBaseConst.name,
            dataBaseConst.collection.document
        );

        const {pageIndex, pageSize, sortParameter, sortDirection} = getListParameters(request);

        console.log('---> get document list', pageSize, pageIndex, sortParameter, sortDirection);

        // TODO: try to remove "await", because work without it
        (await collection)
            .find({})
            .sort({[sortParameter]: sortDirection})
            .skip(pageSize * pageIndex)
            .limit(pageSize)
            .stream(streamOptionsArray)
            .pipe(response.type('json'));
    });

    app.get('/api/get-document-list-size', async (request: $Request, response: $Response) => {
        console.log('---> /api/get-document-list-size');

        const collection = await getCollection<MongoDocumentType>(
            dataBaseConst.name,
            dataBaseConst.collection.document
        );

        const count = await collection.countDocuments();

        response.send(String(count));
    });

    app.post('/api/create-document', async (request: $Request, response: $Response) => {
        console.log('---> /api/create-document');

        const mongoDocument: MongoDocumentType = typeConverter<MongoDocumentType>(request.body);

        const documentCollection = await getCollection<MongoDocumentType>(
            dataBaseConst.name,
            dataBaseConst.collection.document
        );

        const {slug} = mongoDocument;

        const existedDocument = await documentCollection.findOne({slug});

        if (existedDocument) {
            response.json({isSuccessful: false, errorList: [`Document with slug: '${slug}' already exists.`]});
            return;
        }

        console.log('---- mongoDocument ----');
        console.log(mongoDocument);

        const date = getTime();

        const newDocument: MongoDocumentType = {
            ...mongoDocument,
            slug,
            createdDate: date,
            updatedDate: date,
        };

        await documentCollection.insertOne(newDocument);

        response.json({isSuccessful: true, errorList: []});
    });

    app.get('/api/document-search-exact', async (request: $Request, response: $Response) => {
        console.log('---> /api/document-search-exact');

        const documentCollection = await getCollection<MongoDocumentType>(
            dataBaseConst.name,
            dataBaseConst.collection.document
        );

        const {key, value} = getSearchExactParameters(request);

        const existedDocument = await documentCollection.findOne({[key]: value});

        if (existedDocument) {
            response.json({
                isSuccessful: true,
                errorList: [],
                data: existedDocument,
            });
            return;
        }

        response.json({
            isSuccessful: false,
            errorList: [`Can not find a document by 'key = ${key}' and 'value = ${value}'`],
            data: null,
        });
    });
}
