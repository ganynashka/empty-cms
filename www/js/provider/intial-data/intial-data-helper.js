// @flow

import {type $Request, type $Response} from 'express';

import type {MongoDocumentType} from '../../../../server/src/database/database-type';
import {getCollection} from '../../../../server/src/database/database-helper';
import {dataBaseConst} from '../../../../server/src/database/database-const';
import {isError} from '../../lib/is';
import {routePathMap} from '../../component/app/routes-path-map';
import {rootDocumentSlug, rootDocumentTreeDefaultDeep} from '../../../../server/src/api/part/document-api-const';
import {getDocumentTree} from '../../../../server/src/api/part/document-api-helper';
import {getLinkToReadArticle} from '../../lib/string';
import {getDeviceData} from '../../../../server/src/util/device/device';

import {defaultInitialData, page404InitialData, rootPathMetaData} from './intial-data-const';
import type {InitialDataType} from './intial-data-type';

// eslint-disable-next-line complexity, max-statements
export async function getInitialDataByRequest(request: $Request): Promise<InitialDataType> {
    const path = String(request.query.url || request.path || routePathMap.siteEnter.path);
    const collection = await getCollection<MongoDocumentType>(dataBaseConst.name, dataBaseConst.collection.document);
    const mayBeDocumentNodeTree = await getDocumentTree(rootDocumentSlug, rootDocumentTreeDefaultDeep);
    const defaultRequestInitialData = {
        documentNodeTree: isError(mayBeDocumentNodeTree) ? null : mayBeDocumentNodeTree,
        device: getDeviceData(request),
    };

    if (isError(collection)) {
        return {...page404InitialData, ...defaultRequestInitialData};
    }

    // root
    if (path === routePathMap.siteEnter.path) {
        const rootDocument = await collection.findOne({slug: rootDocumentSlug});

        if (rootDocument) {
            return {
                ...defaultInitialData,
                title: rootDocument.title,
                meta: rootDocument.meta,
                ...defaultRequestInitialData,
            };
        }

        console.error('Can not get root document');

        return {
            ...defaultInitialData,
            ...rootPathMetaData,
            ...defaultRequestInitialData,
        };
    }

    // article
    if (path.startsWith(routePathMap.article.staticPartPath)) {
        const slug = path.replace(getLinkToReadArticle(''), '');

        const articlePathData = await getDocumentTree(slug, 3);

        if (isError(articlePathData)) {
            console.error(articlePathData.message);

            return {...page404InitialData, ...defaultRequestInitialData};
        }

        return {
            ...defaultInitialData,
            title: articlePathData.title,
            meta: articlePathData.meta,
            articlePathData,
            ...defaultRequestInitialData,
        };
    }

    // check cms
    if (path.startsWith(routePathMap.cmsEnter.path)) {
        return {...defaultInitialData, ...defaultRequestInitialData};
    }

    return {...page404InitialData, ...defaultRequestInitialData};
}

export async function getInitialData(request: $Request, response: $Response): Promise<InitialDataType> {
    if (String(response.statusCode) === '404') {
        return {...page404InitialData};
    }

    return getInitialDataByRequest(request);
}
