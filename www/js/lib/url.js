// @flow

/* global window */

import type {SortDirectionType} from '../component/layout/table/enhanced-table/enhanced-table-type';
import {enhancedTableDirection} from '../component/layout/table/enhanced-table/enhanced-table-const';
import type {LocationType} from '../type/react-router-dom-v5-type-extract';
import {routePathMap} from '../component/app/routes-path-map';
import type {SharpFitResizeNameType, SharpKernelResizeNameType} from '../page/cms/file/file-api';
import {fileApiRouteMap, pdfApiRouteMap} from '../../../server/src/api/api-route-map';
import {sharpFitResizeNameMap, sharpKernelResizeNameMap} from '../page/cms/file/file-api';

import {isNumber} from './is';

export function getLisParametersToUrl(
    url: string,
    pageIndex: number,
    rowsPerPage: number,
    orderBy: string,
    order: SortDirectionType
): string {
    const urlParameters = [
        `page-index=${pageIndex}`,
        `page-size=${rowsPerPage}`,
        `sort-parameter=${orderBy}`,
        `sort-direction=${order === enhancedTableDirection.asc ? 1 : -1}`,
    ].join('&');

    return url + '?' + urlParameters;
}

export function getSearchExactParametersToUrl(url: string, key: string, value: string): string {
    const urlParameters = [`key=${key}`, `value=${value}`].join('&');

    return url + '?' + urlParameters;
}

export function isCMS(location: LocationType): boolean {
    const {pathname} = location;

    return pathname.startsWith(routePathMap.cmsEnter.path);
}

type GetResizedImageSrcConfigType = {|
    src: string,
    width: number,
    height: number,
    aspectRatio?: number,
    fit?: SharpFitResizeNameType,
    kernel?: SharpKernelResizeNameType,
    hasEnlargement?: boolean,
|};

export function getResizedImageSrc(config: GetResizedImageSrcConfigType): string {
    const {src, width, height, fit, kernel, aspectRatio, hasEnlargement} = config;
    const endAspectRatio = isNumber(aspectRatio) ? aspectRatio : 1;
    const endWidth = Math.floor(width * endAspectRatio);
    const endHeight = Math.floor(height * endAspectRatio);

    const parameterList = [
        `width=${endWidth}`,
        `height=${endHeight}`,
        `fit=${fit || sharpFitResizeNameMap.inside}`,
        `has-enlargement=${hasEnlargement ? '1' : '0'}`,
        `kernel=${kernel || sharpKernelResizeNameMap.cubic}`,
    ];

    return `${fileApiRouteMap.getResizedImage}/${src}?${parameterList.join('&')}`;
}
