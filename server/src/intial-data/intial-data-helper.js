// @flow

import {type $Request, type $Response} from 'express';
import {MongoCollection} from 'mongodb';

import type {MongoDocumentType} from '../database/database-type';
import {getCollection} from '../database/database-helper';
import {dataBaseConst} from '../database/database-const';
import {isError} from '../../../www/js/lib/is';
import {routePathMap} from '../../../www/js/component/app/routes-path-map';
import {rootDocumentSlug} from '../api/part/document-api-const';

import {defaultInitialData, page404InitialData, rootPathMetaData} from './intial-data-const';
import type {InitialDataType, InitialRootDataType} from './intial-data-type';

async function getRootData(collection: MongoCollection<MongoDocumentType>): Promise<InitialRootDataType | null> {
    const rootDocument = await collection.findOne({slug: rootDocumentSlug});

    if (!rootDocument) {
        return null;
    }

    const subDocumentSlugList = rootDocument.subDocumentList;

    const subDocumentList: Array<MongoDocumentType | null> = await Promise.all(
        subDocumentSlugList.map((slug: string): Promise<MongoDocumentType | null> => collection.findOne({slug}))
    );

    return {rootDocument, subDocumentList: subDocumentList.filter(Boolean)};
}

export async function getInitialDataByPath(path: string): Promise<InitialDataType> {
    const collection = await getCollection<MongoDocumentType>(dataBaseConst.name, dataBaseConst.collection.document);

    if (isError(collection)) {
        return {...page404InitialData};
    }

    // check cms
    if (path.startsWith(routePathMap.cmsEnter.path)) {
        return {...defaultInitialData};
    }

    if (path === routePathMap.siteEnter.path) {
        return {
            ...defaultInitialData,
            ...rootPathMetaData,
            rootPathData: await getRootData(collection),
        };
    }

    console.log(path);

    return {...page404InitialData};
}

export async function getInitialData(request: $Request, response: $Response): Promise<InitialDataType> {
    if (String(response.statusCode) === '404') {
        return {...page404InitialData};
    }

    const {path} = request;

    return getInitialDataByPath(path);
}
