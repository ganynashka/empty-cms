// @flow

import {type $Request, type $Response} from 'express';

import type {MongoDocumentType} from '../../../../server/src/database/database-type';
import {getCollection} from '../../../../server/src/database/database-helper';
import {dataBaseConst} from '../../../../server/src/database/database-const';
import {isError} from '../../lib/is';
import {routePathMap} from '../../component/app/routes-path-map';
import {rootDocumentSlug, rootDocumentTreeDefaultDeep} from '../../../../server/src/api/part/document-api-const';
import {getDocumentTreeMemoized} from '../../../../server/src/api/part/document-api-helper-get-document-tree';
import {getLinkToReadArticle} from '../../lib/string';
import {getDeviceData} from '../../../../server/src/util/device/device';

import {getDocumentParentListMemoized} from '../../../../server/src/api/part/document-api-helper-get-parent-list';

import {defaultInitialData, page404InitialData, rootPathMetaData} from './intial-data-const';
import type {InitialDataType} from './intial-data-type';

// eslint-disable-next-line complexity, max-statements
export async function getInitialDataByRequest(request: $Request): Promise<InitialDataType> {
    const path = String(request.query.url || request.path || routePathMap.siteEnter.path);
    const collection = await getCollection<MongoDocumentType>(dataBaseConst.name, dataBaseConst.collection.document);
    const mayBeDocumentNodeTree = await getDocumentTreeMemoized(rootDocumentSlug, rootDocumentTreeDefaultDeep);
    const defaultRequestInitialData = {
        documentNodeTree: isError(mayBeDocumentNodeTree) ? null : mayBeDocumentNodeTree,
        device: getDeviceData(request),
    };

    if (isError(collection)) {
        return {...page404InitialData, ...defaultRequestInitialData};
    }

    // root
    if (path === routePathMap.siteEnter.path) {
        const parentNodeList = await getDocumentParentListMemoized(rootDocumentSlug, 5);
        const rootDocument = await collection.findOne({slug: rootDocumentSlug});

        if (rootDocument) {
            return {
                ...defaultInitialData,
                parentNodeList: isError(parentNodeList) ? [] : parentNodeList,
                title: rootDocument.title,
                header: rootDocument.header,
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
        const parentNodeList = await getDocumentParentListMemoized(slug, 5);
        const articlePathData = await getDocumentTreeMemoized(slug, 3);

        if (isError(articlePathData)) {
            console.error(articlePathData.message);

            return {...page404InitialData, ...defaultRequestInitialData};
        }

        return {
            ...defaultInitialData,
            parentNodeList: isError(parentNodeList) ? [] : parentNodeList,
            title: articlePathData.title,
            header: articlePathData.header,
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
