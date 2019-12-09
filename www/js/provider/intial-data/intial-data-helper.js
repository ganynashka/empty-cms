// @flow

import {type $Request, type $Response} from 'express';
import {MongoCollection} from 'mongodb';

import type {
    MongoDocumentTreeNodeType as MongoDTNType,
    MongoDocumentType,
} from '../../../../server/src/database/database-type';
import {getCollection} from '../../../../server/src/database/database-helper';
import {dataBaseConst} from '../../../../server/src/database/database-const';
import {isError} from '../../lib/is';
import {routePathMap} from '../../component/app/routes-path-map';
import {rootDocumentSlug, rootDocumentTreeDefaultDeep} from '../../../../server/src/api/part/document-api-const';

import {getDocumentTree} from '../../../../server/src/api/part/document-api-helper';

import {defaultInitialData, page404InitialData, rootPathMetaData} from './intial-data-const';
import type {InitialDataType, InitialRootDataType} from './intial-data-type';

async function getRootData(collection: MongoCollection<MongoDocumentType>): Promise<InitialRootDataType | null> {
    const rootDocument = await collection.findOne({slug: rootDocumentSlug});

    if (!rootDocument) {
        return null;
    }

    const subDocumentSlugList = rootDocument.subDocumentSlugList;

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

// eslint-disable-next-line complexity, max-statements
export async function getInitialDataByPath(path: string): Promise<InitialDataType> {
    const collection = await getCollection<MongoDocumentType>(dataBaseConst.name, dataBaseConst.collection.document);
    const mayBeDocumentNodeTree = await getDocumentTree(rootDocumentSlug, rootDocumentTreeDefaultDeep);
    const documentNodeTree = isError(mayBeDocumentNodeTree) ? null : mayBeDocumentNodeTree;

    if (isError(collection)) {
        return {...page404InitialData, documentNodeTree};
    }

    // root
    if (path === routePathMap.siteEnter.path) {
        return {
            ...defaultInitialData,
            ...rootPathMetaData,
            rootPathData: await getRootData(collection),
            documentNodeTree,
        };
    }

    // article
    if (path.startsWith(routePathMap.article.staticPartPath)) {
        const articlePathData = await getArticleData(collection, path);

        return articlePathData && articlePathData.isActive
            ? {
                ...defaultInitialData,
                title: articlePathData.title,
                description: articlePathData.description,
                articlePathData,
                documentNodeTree,
            }
            : {...page404InitialData, documentNodeTree};
    }

    // check cms
    if (path.startsWith(routePathMap.cmsEnter.path)) {
        return {...defaultInitialData, documentNodeTree};
    }

    return {...page404InitialData, documentNodeTree};
}

export async function getInitialData(request: $Request, response: $Response): Promise<InitialDataType> {
    if (String(response.statusCode) === '404') {
        return {...page404InitialData};
    }

    const {path} = request;

    return getInitialDataByPath(path);
}
