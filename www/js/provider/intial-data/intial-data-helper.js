// @flow

import {type $Request, type $Response} from 'express';

import {isError} from '../../lib/is';
import {routePathMap} from '../../component/app/routes-path-map';
import {rootDocumentSlug, rootDocumentTreeDefaultDeep} from '../../../../server/src/api/part/document-api-const';
import {getDocumentTreeMemoized} from '../../../../server/src/api/part/document-api-helper-get-document-tree';
import {getLinkToReadArticle} from '../../lib/string';
import {getDeviceData} from '../../../../server/src/util/device/device';
import {getDocumentParentListMemoized} from '../../../../server/src/api/part/document-api-helper-get-parent-list';
import {getSiblingLinkDataListMemoized} from '../../../../server/src/api/part/document-api-helper-get-child-list';
import {getDocumentBySlugMemoized} from '../../../../server/src/api/part/document-api-helper';

import {defaultInitialData, page404InitialData, rootPathMetaData} from './intial-data-const';
import type {InitialDataType} from './intial-data-type';

// eslint-disable-next-line complexity, max-statements, sonarjs/cognitive-complexity
export async function getInitialDataByRequest(request: $Request): Promise<InitialDataType> {
    const path = String(request.query.url || request.path || routePathMap.siteEnter.path);
    const mayBeDocumentNodeTree = await getDocumentTreeMemoized(rootDocumentSlug, rootDocumentTreeDefaultDeep);
    const defaultRequestInitialData = {
        documentNodeTree: isError(mayBeDocumentNodeTree) ? null : mayBeDocumentNodeTree,
        device: getDeviceData(request),
    };

    // root
    if (path === routePathMap.siteEnter.path) {
        const parentNodeList = await getDocumentParentListMemoized(rootDocumentSlug, 5);
        const rootDocument = await getDocumentBySlugMemoized(rootDocumentSlug);

        if (!rootDocument || isError(rootDocument)) {
            console.error('Can not get root document');

            return {
                ...defaultInitialData,
                ...rootPathMetaData,
                ...defaultRequestInitialData,
            };
        }

        return {
            ...defaultInitialData,
            parentNodeList: isError(parentNodeList) ? [] : parentNodeList,
            title: rootDocument.title,
            header: rootDocument.header,
            meta: rootDocument.meta,
            ...defaultRequestInitialData,
        };
    }

    // article
    if (path.startsWith(routePathMap.article.staticPartPath)) {
        const slug = path.replace(getLinkToReadArticle(''), '');
        const parentNodeList = await getDocumentParentListMemoized(slug, 5);
        const articlePathData = await getDocumentTreeMemoized(slug, 1);
        const siblingDataList = await getSiblingLinkDataListMemoized(slug);

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
            siblingDataList: isError(siblingDataList) ? [] : siblingDataList,
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
