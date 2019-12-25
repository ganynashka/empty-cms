// @flow

import {type $Request, type $Response} from 'express';
import {type MongoCollection} from 'mongodb';

import type {MongoDocumentTreeNodeType, MongoDocumentType} from '../../../../server/src/database/database-type';
import {getCollection} from '../../../../server/src/database/database-helper';
import {dataBaseConst} from '../../../../server/src/database/database-const';
import {isError} from '../../lib/is';
import {routePathMap} from '../../component/app/routes-path-map';
import {rootDocumentSlug, rootDocumentTreeDefaultDeep} from '../../../../server/src/api/part/document-api-const';
import {getDocumentTree} from '../../../../server/src/api/part/document-api-helper';

import {getLinkToArticle} from '../../lib/string';

import {defaultInitialData, page404InitialData, rootPathMetaData} from './intial-data-const';
import type {InitialDataType} from './intial-data-type';

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
        const rootDocument = await collection.findOne({slug: rootDocumentSlug});

        if (rootDocument) {
            return {
                ...defaultInitialData,
                title: rootDocument.title,
                meta: rootDocument.meta,
                documentNodeTree,
            };
        }

        console.error('Can not get root document');

        return {
            ...defaultInitialData,
            ...rootPathMetaData,
            documentNodeTree,
        };
    }

    // article
    if (path.startsWith(routePathMap.article.staticPartPath)) {
        const slug = path.replace(getLinkToArticle(''), '');

        const articlePathData = await getDocumentTree(slug, 3);

        if (isError(articlePathData)) {
            console.error(articlePathData.message);

            return {...page404InitialData, documentNodeTree};
        }

        return {
            ...defaultInitialData,
            title: articlePathData.title,
            meta: articlePathData.meta,
            articlePathData,
            documentNodeTree,
        };
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
