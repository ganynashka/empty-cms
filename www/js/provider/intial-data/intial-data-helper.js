// @flow

import {type $Request, type $Response} from 'express';

import {isError} from '../../lib/is';
import {routePathMap} from '../../component/app/routes-path-map';
import {rootDocumentSlug, rootDocumentTreeDefaultDeep} from '../../../../server/src/api/part/document-api-const';
// import {getDocumentTreeMemoized} from '../../../../server/src/api/part/document-api-helper-get-document-tree';
import {getLinkToReadArticle} from '../../lib/string';
import {getDeviceData} from '../../../../server/src/util/device/device';
import {getDocumentParentListMemoized} from '../../../../server/src/api/part/document-api-helper-get-parent-list';
import {getSiblingLinkDataListMemoized} from '../../../../server/src/api/part/document-api-helper-get-child-list';
import {getDocumentBySlugMemoized} from '../../../../server/src/api/part/document-api-helper';
import type {
    MongoDocumentShortDataType,
    MongoDocumentType,
    OpenGraphDataType,
} from '../../../../server/src/database/database-type';
import {getResizedImageSrc} from '../../lib/url';
import {sharpKernelResizeNameMap} from '../../page/cms/file/file-api';
import {getArticlePathDataMemoized} from '../../../../server/src/api/part/document-api-helper-get-article-path-data';
import {getRootPathDataMemoized} from '../../../../server/src/api/part/document-api-helper-get-root-path-data';
import {getHeaderDataMemoized} from '../../../../server/src/api/part/document-api-helper-get-header-data';

import {defaultInitialData, defaultOpenGraphData, page404InitialData, rootPathMetaData} from './intial-data-const';
import type {InitialDataType} from './intial-data-type';

// eslint-disable-next-line complexity, max-statements, sonarjs/cognitive-complexity
export async function getInitialDataByRequest(request: $Request): Promise<InitialDataType> {
    const path = String(request.query.url || request.path || routePathMap.siteEnter.path);
    // const mayBeDocumentNodeTree = await getDocumentTreeMemoized(rootDocumentSlug, rootDocumentTreeDefaultDeep);
    const defaultRequestInitialData = {
        headerData: await getHeaderDataMemoized(),
        // documentNodeTree: isError(mayBeDocumentNodeTree) ? null : mayBeDocumentNodeTree,
        device: getDeviceData(request),
    };

    // root
    if (path === routePathMap.siteEnter.path) {
        const rootPathData = await getRootPathDataMemoized();

        if (!rootPathData) {
            console.error('Can not get root document');

            return {
                ...defaultInitialData,
                ...rootPathMetaData,
                ...defaultRequestInitialData,
            };
        }

        return {
            ...defaultInitialData,
            rootPathData,
            parentNodeList: [],
            title: rootPathData.mongoDocument.title,
            header: rootPathData.mongoDocument.header,
            meta: rootPathData.mongoDocument.meta,
            openGraphData: getOpenGraphData(rootPathData.mongoDocument),
            ...defaultRequestInitialData,
        };
    }

    // article
    if (path.startsWith(routePathMap.article.staticPartPath)) {
        const slug = path.replace(getLinkToReadArticle(''), '');
        const parentNodeList = await getDocumentParentListMemoized(slug, 5);
        const articlePathData = await getArticlePathDataMemoized(slug);
        const siblingDataList = await getSiblingLinkDataListMemoized(slug);

        if (!articlePathData) {
            console.error('getInitialDataByRequest: can not get article by slug:', slug);

            return {...page404InitialData, ...defaultRequestInitialData};
        }

        const mongoDocument = await getDocumentBySlugMemoized(slug);

        return {
            ...defaultInitialData,
            parentNodeList: isError(parentNodeList) ? [] : parentNodeList.map(documentToShortData),
            title: articlePathData.mongoDocument.title,
            header: articlePathData.mongoDocument.header,
            meta: articlePathData.mongoDocument.meta,
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
        // const mayBeDocumentNodeTree = await getDocumentTreeMemoized(rootDocumentSlug, rootDocumentTreeDefaultDeep);
        const defaultRequestInitialData = {
            headerData: await getHeaderDataMemoized(),
            // documentNodeTree: isError(mayBeDocumentNodeTree) ? null : mayBeDocumentNodeTree,
            device: getDeviceData(request),
        };

        return {...page404InitialData, ...defaultRequestInitialData};
    }

    return getInitialDataByRequest(request);
}

function getOpenGraphImagPathData(mongoDocument: MongoDocumentType): string {
    const {titleImage, imageList} = mongoDocument;
    const image = titleImage || imageList[0];
    const size = 512;
    const kernel = image ? sharpKernelResizeNameMap.cubic : sharpKernelResizeNameMap.nearest;
    const src = image || defaultOpenGraphData.image;

    return getResizedImageSrc({src, width: size, height: size, hasEnlargement: true, kernel});
}

export function getOpenGraphData(mongoDocument: MongoDocumentType): OpenGraphDataType {
    const {header, shortDescription} = mongoDocument;
    const title = header || defaultOpenGraphData.title;
    const type = defaultOpenGraphData.type;
    const description = shortDescription || defaultOpenGraphData.description;

    return {
        title,
        type,
        image: getOpenGraphImagPathData(mongoDocument),
        description,
        locale: defaultOpenGraphData.locale,
    };
}

export function getOpenGraphMetaString(openGraphData: OpenGraphDataType): string {
    const template = '<meta property="og:{{key}}" content="{{value}}"/>';
    const metaList: Array<string> = [];

    Object.keys(openGraphData).forEach((key: string) => {
        const value = openGraphData[key];

        if (!value) {
            return;
        }

        metaList.push(template.replace('{{key}}', key).replace('{{value}}', String(value)));
    });

    return metaList.join('\n');
}

export function documentToShortData(mongoDocument: MongoDocumentType): MongoDocumentShortDataType {
    const {slug, type, header, titleImage, subDocumentSlugList, imageList, isActive} = mongoDocument;

    return {
        slug,
        type,
        header,
        titleImage,
        subDocumentSlugList,
        imageList,
        isActive,
    };
}
