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

function getArticleData(
    collection: MongoCollection<MongoDocumentType>,
    path: string
): Promise<MongoDocumentType | null> {
    const slug = path.replace(routePathMap.article.staticPartPath + '/', '');

    return collection.findOne({slug});
}

// eslint-disable-next-line complexity
export async function getInitialDataByPath(path: string): Promise<InitialDataType> {
    const collection = await getCollection<MongoDocumentType>(dataBaseConst.name, dataBaseConst.collection.document);

    if (isError(collection)) {
        return {...page404InitialData};
    }

    // check cms
    if (path.startsWith(routePathMap.cmsEnter.path)) {
        return {...defaultInitialData};
    }

    // root
    if (path === routePathMap.siteEnter.path) {
        return {
            ...defaultInitialData,
            ...rootPathMetaData,
            rootPathData: await getRootData(collection),
        };
    }

    // article
    if (path.startsWith(routePathMap.article.staticPartPath)) {
        const articlePathData = await getArticleData(collection, path);

        return articlePathData
            ? {
                ...defaultInitialData,
                title: articlePathData.title,
                description: articlePathData.description,
                articlePathData,
            }
            : {...page404InitialData};
    }

    return {...page404InitialData};
}

export async function getInitialData(request: $Request, response: $Response): Promise<InitialDataType> {
    if (String(response.statusCode) === '404') {
        return {...page404InitialData};
    }

    const {path} = request;

    return getInitialDataByPath(path);
}
