// @flow

import {type $Application, type $Request, type $Response} from 'express';

// eslint-disable-next-line max-len
import {type JsonToMongoDocumentType} from '../../../../www/js/component/layout/form-generator/field/input-upload-json-as-document/input-upload-json-as-document-type';
import {typeConverter} from '../../../../www/js/lib/type';
import {getCollection} from '../../database/database-helper';
import type {MongoDocumentShortDataType, MongoDocumentType} from '../../database/database-type';
import {dataBaseConst} from '../../database/database-const';
import {getTime} from '../../util/time';
import {isError} from '../../../../www/js/lib/is';
import {getListParameters, getSearchExactParameters, getSearchParameters} from '../api-helper';
import {documentApiRouteMap} from '../api-route-map';
import {getLinkToReadArticle, getSlug} from '../../../../www/js/lib/string';
import {convertJsonToDocument} from '../../util/json-to-document';
import {handleDataBaseChange} from '../../util/data-base';
import {documentToShortData} from '../../../../www/js/provider/intial-data/intial-data-helper';
import {getPasswordSha256} from '../../util/user';

import {rootDocumentId, rootDocumentSlug} from './document-api-const';
import {getDocumentParentListById} from './document-api-helper-get-parent-list';
// import {getDocumentTreeMemoized} from './document-api-helper-get-document-tree';
import {getOrphanList} from './document-api-helper';

// import {getDocumentTreeMemoized} from './document-api-helper-get-document-tree';

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
            .toArray((error: ?Error, documentList: ?Array<MongoDocumentType>) => {
                if (error || !Array.isArray(documentList)) {
                    response.status(400);
                    response.json({
                        isSuccessful: false,
                        errorList: [documentApiRouteMap.getDocumentList + ': Can not read document collection!'],
                    });
                    return;
                }

                response.json(documentList);
            });
    });

    app.get(documentApiRouteMap.getDocumentSlugList, async (request: $Request, response: $Response) => {
        const collection = await getCollection<MongoDocumentType>(
            dataBaseConst.name,
            dataBaseConst.collection.document
        );

        if (isError(collection)) {
            response.status(400);
            response.json([]);
            return;
        }

        collection.find({}).toArray((error: ?Error, documentList: ?Array<MongoDocumentType>) => {
            if (!Array.isArray(documentList)) {
                response.status(400);
                response.json([]);
                return;
            }

            response.json(
                documentList.map((documentListInList: MongoDocumentType): string => {
                    const {slug} = documentListInList;

                    if (slug === rootDocumentSlug) {
                        return '/';
                    }

                    return getLinkToReadArticle(slug);
                })
            );
        });
    });

    /*
    app.get(documentApiRouteMap.getDocumentTree, async (request: $Request, response: $Response) => {
        const {slug, deep} = getDocumentTreeParameters(request);
        const tree = await getDocumentTreeMemoized(slug, deep);

        if (isError(tree)) {
            response.status(400);
            response.json({slug, deep});
            return;
        }

        response.json(tree);
    });
*/

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
            id: getPasswordSha256(JSON.stringify(mongoDocument) + date + Math.random()),
            createdDate: date,
            updatedDate: date,
        };

        await collection.insertOne(newDocument);

        handleDataBaseChange();

        response.json({isSuccessful: true, errorList: []});
    });

    // eslint-disable-next-line max-statements
    app.post(documentApiRouteMap.uploadDocumentAsJson, async (request: $Request, response: $Response) => {
        const jsonDocument: JsonToMongoDocumentType = typeConverter<JsonToMongoDocumentType>(request.body);

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

        const {header} = jsonDocument;

        if (!header.trim()) {
            response.status(400);
            response.json({isSuccessful: false, errorList: ['Header is required.']});
            return;
        }

        const slug = getSlug(header);

        const existedDocument = await collection.findOne({slug});

        if (existedDocument) {
            // await collection.deleteOne({slug}, {});

            response.status(400);
            response.json({isSuccessful: false, errorList: [`Document with slug: '${slug}' already exists.`]});
            return;
        }

        const newDocument: MongoDocumentType = await convertJsonToDocument(jsonDocument);

        await collection.insertOne(newDocument);

        handleDataBaseChange();

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

        const {id} = mongoDocument;

        const existedDocumentById = await collection.findOne({id});

        if (!existedDocumentById) {
            response.status(400);
            response.json({isSuccessful: false, errorList: [`Document with id: '${id}' is NOT exists.`]});
            return;
        }

        const date = getTime();

        const newDocument: MongoDocumentType = {
            ...mongoDocument,
            updatedDate: date,
        };

        const result = await collection.updateOne({id}, {$set: newDocument}, {});

        handleDataBaseChange();

        response.json({isSuccessful: true, errorList: []});
    });

    app.get(documentApiRouteMap.documentSearch, async (request: $Request, response: $Response) => {
        const collection = await getCollection<MongoDocumentType>(
            dataBaseConst.name,
            dataBaseConst.collection.document
        );

        if (isError(collection)) {
            response.status(400);
            response.json([]);
            return;
        }

        collection
            // $FlowFixMe
            .find({$or: [...getSearchParameters(request)], isActive: true})
            .toArray((error: ?Error, documentList: ?Array<MongoDocumentType>) => {
                if (error || !Array.isArray(documentList)) {
                    response.status(400);
                    response.json([]);
                    return;
                }

                response.json(documentList);
            });
    });

    app.get(documentApiRouteMap.documentShortDataSearch, async (request: $Request, response: $Response) => {
        const collection = await getCollection<MongoDocumentType>(
            dataBaseConst.name,
            dataBaseConst.collection.document
        );

        if (isError(collection)) {
            response.status(400);
            response.json([]);
            return;
        }

        collection
            // $FlowFixMe
            .find({$or: [...getSearchParameters(request)], isActive: true})
            .toArray((error: ?Error, documentList: ?Array<MongoDocumentType>) => {
                if (error || !Array.isArray(documentList)) {
                    response.status(400);
                    response.json([]);
                    return;
                }

                response.json(documentList.map(documentToShortData));
            });
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

        const documentParentList = await getDocumentParentListById(String(request.query.id));

        if (isError(documentParentList)) {
            response.status(400);
            response.json({
                isSuccessful: false,
                errorList: [documentParentList.message],
            });
            return;
        }

        response.json(documentParentList);
    });

    app.get(documentApiRouteMap.getOrphanList, async (request: $Request, response: $Response) => {
        const orphanList = await getOrphanList();

        if (isError(orphanList)) {
            response.status(400);
            response.json({
                isSuccessful: false,
                errorList: [`Can not get collection: ${dataBaseConst.collection.document}`],
            });
            return;
        }

        response.json(orphanList);
    });

    // eslint-disable-next-line complexity, max-statements
    app.delete(documentApiRouteMap.removeDocumentById, async (request: $Request, response: $Response) => {
        const removeData: {id: string} = typeConverter<{id: string}>(request.body);

        const {id} = removeData;

        if (id === rootDocumentId) {
            response.json({
                isSuccessful: false,
                errorList: ['Can not delete root document'],
            });
            return;
        }

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

        const mongoDocument = await collection.findOne({id});

        if (!mongoDocument) {
            response.status(404);
            response.json({
                isSuccessful: false,
                errorList: [`Can not find a document with id: ${id}`],
            });
            return;
        }

        const {
            titleImage,
            meta,
            content,
            subDocumentIdList,
            tagList,
            fileList,
            shortDescription,
            author,
            illustrator,
            artist,
            publicationDate,
        } = mongoDocument;

        if (
            titleImage
            || author
            || illustrator
            || artist
            || publicationDate
            || meta
            || shortDescription
            || content
            || subDocumentIdList.length > 0
            || tagList.length > 0
            || fileList.length > 0
        ) {
            response.json({
                isSuccessful: false,
                errorList: ['Document should be totally empty (no titleImage, no content ...)'],
            });
            return;
        }

        const documentParentList = await getDocumentParentListById(id);

        if (isError(documentParentList)) {
            response.status(400);
            response.json({
                isSuccessful: false,
                errorList: [documentParentList.message],
            });
            return;
        }

        if (documentParentList.length > 0) {
            const parentSlugList = documentParentList.map((parent: MongoDocumentType): string => {
                return parent.id;
            });

            response.json({
                isSuccessful: false,
                errorList: [`Document has parents: ${parentSlugList.join(', ')}.`],
            });
            return;
        }

        await collection.deleteOne({id}, {});

        handleDataBaseChange();

        response.json({
            isSuccessful: true,
            errorList: [],
        });
    });

    app.get(documentApiRouteMap.getDocumentShortDataList, async (request: $Request, response: $Response) => {
        const collection = await getCollection<MongoDocumentType>(
            dataBaseConst.name,
            dataBaseConst.collection.document
        );

        if (isError(collection)) {
            response.status(400);
            response.json([]);
            return;
        }

        collection.find({}).toArray((error: ?Error, documentList: ?Array<MongoDocumentType>) => {
            if (error || !Array.isArray(documentList)) {
                response.status(400);
                response.json([]);
                return;
            }

            const slugTitleList = documentList.map((documentInList: MongoDocumentType): MongoDocumentShortDataType => {
                const {
                    id,
                    slug,
                    type,
                    header,
                    titleImage,
                    subDocumentSlugList,
                    subDocumentIdList,
                    fileList,
                    isActive,
                    content,
                } = documentInList;

                return {
                    id,
                    slug,
                    type,
                    header,
                    titleImage,
                    subDocumentSlugList,
                    subDocumentIdList,
                    fileList,
                    isActive,
                    contentLength: content.length,
                };
            });

            response.json(slugTitleList);
        });
    });
}
