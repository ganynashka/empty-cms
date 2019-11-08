// @flow

import {type $Application, type $Request, type $Response} from 'express';

import {typeConverter} from '../../../www/js/lib/type';
import {getCollection} from '../db/util';
import type {MongoDocumentType} from '../db/type';
import {dataBaseConst} from '../db/const';
import {getTime} from '../util/time';

import {getListParameters, getSearchExactParameters, streamOptionsArray} from './helper';
import {documentApiRouteMap} from './route-map';

export function addDocumentApi(app: $Application) {
    app.get(documentApiRouteMap.getDocumentList, async (request: $Request, response: $Response) => {
        const collection = await getCollection<MongoDocumentType>(
            dataBaseConst.name,
            dataBaseConst.collection.document
        );

        const {pageIndex, pageSize, sortParameter, sortDirection} = getListParameters(request);

        // TODO: try to remove "await", because work without it
        (await collection)
            .find({})
            .sort({[sortParameter]: sortDirection})
            .skip(pageSize * pageIndex)
            .limit(pageSize)
            .stream(streamOptionsArray)
            .pipe(response);
    });

    app.get(documentApiRouteMap.getDocumentListSize, async (request: $Request, response: $Response) => {
        const collection = await getCollection<MongoDocumentType>(
            dataBaseConst.name,
            dataBaseConst.collection.document
        );

        const count = await collection.countDocuments();

        response.send(String(count));
    });

    app.post(documentApiRouteMap.createDocument, async (request: $Request, response: $Response) => {
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

    app.post(documentApiRouteMap.updateDocument, async (request: $Request, response: $Response) => {
        const mongoDocument: MongoDocumentType = typeConverter<MongoDocumentType>(request.body);

        const documentCollection = await getCollection<MongoDocumentType>(
            dataBaseConst.name,
            dataBaseConst.collection.document
        );

        const {slug} = mongoDocument;

        const existedDocument = await documentCollection.findOne({slug});

        if (!existedDocument) {
            response.json({isSuccessful: false, errorList: [`Document with slug: '${slug}' is NOT exists.`]});
            return;
        }

        const date = getTime();

        const newDocument: MongoDocumentType = {
            ...mongoDocument,
            createdDate: existedDocument.createdDate,
            updatedDate: date,
        };

        const result = await documentCollection.updateOne({slug}, {$set: newDocument}, {});

        response.json({isSuccessful: true, errorList: []});
    });

    app.get(documentApiRouteMap.documentSearchExact, async (request: $Request, response: $Response) => {
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

    app.get(documentApiRouteMap.getParentList, async (request: $Request, response: $Response) => {
        const promiseCollection = await getCollection<MongoDocumentType>(
            dataBaseConst.name,
            dataBaseConst.collection.document
        );

        const collection = await promiseCollection;

        (await collection)
            .find({subDocumentList: String(request.query.slug)})
            .stream(streamOptionsArray)
            .pipe(response);
    });
}
