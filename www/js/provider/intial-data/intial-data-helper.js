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

import type {MongoDocumentType, OpenGraphDataType} from '../../../../server/src/database/database-type';

import {defaultInitialData, defaultOpenGraphData, page404InitialData, rootPathMetaData} from './intial-data-const';
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
            openGraphData: getOpenGraphData(rootDocument),
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

        const mongoDocument = await getDocumentBySlugMemoized(slug);

        return {
            ...defaultInitialData,
            parentNodeList: isError(parentNodeList) ? [] : parentNodeList,
            title: articlePathData.title,
            header: articlePathData.header,
            meta: articlePathData.meta,
            openGraphData:
                !mongoDocument || isError(mongoDocument) ? defaultOpenGraphData : getOpenGraphData(mongoDocument),
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

export function getOpenGraphData(mongoDocument: MongoDocumentType): OpenGraphDataType {
    const {header, titleImage, imageList, shortDescription} = mongoDocument;
    const title = header || defaultOpenGraphData.title;
    const type = defaultOpenGraphData.type;
    const image = titleImage || imageList[0] || defaultOpenGraphData.image;
    const description = shortDescription || defaultOpenGraphData.description;

    return {title, type, image, description};
}

export function getOpenGraphMetaString(openGraphData: OpenGraphDataType): string {
    const template = '<meta property="og:{{key}}" content="{{value}}"/>';

    const metaList: Array<string> = [];

    Object.keys(openGraphData).forEach((key: string) => {
        const value = openGraphData[key];

        if (!value) {
            return;
        }

        const metaString = template.replace('{{key}}', key).replace('{{value}}', String(value));

        metaList.push(metaString);
    });

    return metaList.join('\n');
}
