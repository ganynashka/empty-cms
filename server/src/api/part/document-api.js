// @flow

import {type $Application, type $Request, type $Response} from 'express';

import {typeConverter} from '../../../../www/js/lib/type';
import {getCollection} from '../../database/database-helper';
import type {MongoDocumentType} from '../../database/database-type';
import {dataBaseConst} from '../../database/database-const';
import {getTime} from '../../util/time';
import {isError} from '../../../../www/js/lib/is';

import {
    getDocumentTreeParameters,
    getListParameters,
    getSearchExactParameters,
    streamOptionsArray,
} from '../api-helper';
import {documentApiRouteMap} from '../api-route-map';

import {getDocumentTree} from './document-api-helper';

export function addDocumentApi(app: $Application) {
    app.get(documentApiRouteMap.getDocumentList, async (request: $Request, response: $Response) => {
        const collection = await getCollection<MongoDocumentType>(
            dataBaseConst.name,
            dataBaseConst.collection.document
        );

        if (isError(collection)) {
            response.status(400);
            response.json({
                isSuccessful: false,
                errorList: [`Can not get collection: ${dataBaseConst.collection.document}`],
            });
            return;
        }

        const {pageIndex, pageSize, sortParameter, sortDirection} = getListParameters(request);

        collection
            .find({})
            .sort({[sortParameter]: sortDirection})
            .skip(pageSize * pageIndex)
            .limit(pageSize)
            .stream(streamOptionsArray)
            .pipe(response);
    });

    app.get(documentApiRouteMap.getDocumentTree, async (request: $Request, response: $Response) => {
        const {slug, deep} = getDocumentTreeParameters(request);
        const tree = await getDocumentTree(slug, deep);

        if (isError(tree)) {
            response.status(400);
            response.json({slug, deep});
            return;
        }

        response.json(tree);
    });

    app.get(documentApiRouteMap.getDocumentListSize, async (request: $Request, response: $Response) => {
        const collection = await getCollection<MongoDocumentType>(
            dataBaseConst.name,
            dataBaseConst.collection.document
        );

        if (isError(collection)) {
            response.status(400);
            response.json({
                isSuccessful: false,
                errorList: [`Can not get collection: ${dataBaseConst.collection.document}`],
            });
            return;
        }

        const count = await collection.countDocuments();

        response.send(String(count));
    });

    app.post(documentApiRouteMap.createDocument, async (request: $Request, response: $Response) => {
        const mongoDocument: MongoDocumentType = typeConverter<MongoDocumentType>(request.body);

        const collection = await getCollection<MongoDocumentType>(
            dataBaseConst.name,
            dataBaseConst.collection.document
        );

        if (isError(collection)) {
            response.status(400);
            response.json({
                isSuccessful: false,
                errorList: [`Can not get collection: ${dataBaseConst.collection.document}`],
            });
            return;
        }

        const {slug} = mongoDocument;

        const existedDocument = await collection.findOne({slug});

        if (existedDocument) {
            response.status(400);
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

        await collection.insertOne(newDocument);

        response.json({isSuccessful: true, errorList: []});
    });

    app.post(documentApiRouteMap.updateDocument, async (request: $Request, response: $Response) => {
        const mongoDocument: MongoDocumentType = typeConverter<MongoDocumentType>(request.body);

        const collection = await getCollection<MongoDocumentType>(
            dataBaseConst.name,
            dataBaseConst.collection.document
        );

        if (isError(collection)) {
            response.status(400);
            response.json({
                isSuccessful: false,
                errorList: [`Can not get collection: ${dataBaseConst.collection.document}`],
            });
            return;
        }

        const {slug} = mongoDocument;

        const existedDocument = await collection.findOne({slug});

        if (!existedDocument) {
            response.status(400);
            response.json({isSuccessful: false, errorList: [`Document with slug: '${slug}' is NOT exists.`]});
            return;
        }

        const date = getTime();

        const newDocument: MongoDocumentType = {
            ...mongoDocument,
            createdDate: existedDocument.createdDate,
            updatedDate: date,
        };

        const result = await collection.updateOne({slug}, {$set: newDocument}, {});

        response.json({isSuccessful: true, errorList: []});
    });

    app.get(documentApiRouteMap.documentSearchExact, async (request: $Request, response: $Response) => {
        const collection = await getCollection<MongoDocumentType>(
            dataBaseConst.name,
            dataBaseConst.collection.document
        );

        if (isError(collection)) {
            response.status(400);
            response.json({
                isSuccessful: false,
                errorList: [`Can not get collection: ${dataBaseConst.collection.document}`],
            });
            return;
        }

        const {key, value} = getSearchExactParameters(request);

        const existedDocument = await collection.findOne({[key]: value});

        if (existedDocument) {
            response.json(existedDocument);
            return;
        }

        response.status(400);
        response.json({
            isSuccessful: false,
            errorList: [`Can not find a document by 'key = ${key}' and 'value = ${value}'`],
        });
    });

    app.get(documentApiRouteMap.getParentList, async (request: $Request, response: $Response) => {
        const collection = await getCollection<MongoDocumentType>(
            dataBaseConst.name,
            dataBaseConst.collection.document
        );

        if (isError(collection)) {
            response.status(400);
            response.json({
                isSuccessful: false,
                errorList: [`Can not get collection: ${dataBaseConst.collection.document}`],
            });
            return;
        }

        collection
            // $FlowFixMe
            .find({subDocumentSlugList: String(request.query.slug)})
            .stream(streamOptionsArray)
            .pipe(response);
    });

    app.get(documentApiRouteMap.getOrphanList, async (request: $Request, response: $Response) => {
        const collection = await getCollection<MongoDocumentType>(
            dataBaseConst.name,
            dataBaseConst.collection.document
        );

        if (isError(collection)) {
            response.status(400);
            response.json({
                isSuccessful: false,
                errorList: [`Can not get collection: ${dataBaseConst.collection.document}`],
            });
            return;
        }

        collection.find({}).toArray((error: Error | null, documentList: Array<MongoDocumentType> | null) => {
            if (error || !Array.isArray(documentList)) {
                response.status(400);
                response.json({
                    isSuccessful: false,
                    errorList: ['Can not read collection!'],
                });
                return;
            }

            const orphanList = documentList.filter((orphanDocument: MongoDocumentType): boolean => {
                return documentList.every((mongoDocument: MongoDocumentType): boolean => {
                    return !mongoDocument.subDocumentSlugList.includes(orphanDocument.slug);
                });
            });

            response.send(JSON.stringify(orphanList));
        });
    });
}
