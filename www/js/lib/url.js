// @flow

/* global window */

import type {SortDirectionType} from '../component/layout/table/enhanced-table/enhanced-table-type';
import {enhancedTableDirection} from '../component/layout/table/enhanced-table/enhanced-table-const';
import type {LocationType} from '../type/react-router-dom-v5-type-extract';
import {routePathMap} from '../component/app/routes-path-map';
import type {SharpFitResizeNameType} from '../page/cms/file/file-api';
import {fileApiRouteMap, pdfApiRouteMap} from '../../../server/src/api/api-route-map';
import {sharpFitResizeNameMap} from '../page/cms/file/file-api';

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

export function getResizedImageSrc(
    src: string,
    width: number,
    height: number,
    fit: SharpFitResizeNameType,
    aspectRatio: number
): string {
    const endWidth = Math.floor(width * aspectRatio);
    const endHeight = Math.floor(height * aspectRatio);
    const {getResizedImage} = fileApiRouteMap;

    return `${getResizedImage}/${src}?width=${endWidth}&height=${endHeight}&fit=${fit}`;
}

export function getResizedInsideImageSrc(src: string, width: number, height: number, aspectRatio: number): string {
    return getResizedImageSrc(src, width, height, sharpFitResizeNameMap.inside, aspectRatio);
}

export function getPdfUrlFromImage(imageSrc: string): string {
    if (typeof window === 'undefined') {
        return '';
    }

    const {location} = window;
    const {origin} = location;
    const src = encodeURIComponent(origin + getResizedImageSrc(imageSrc, 3e3, 3e3, sharpFitResizeNameMap.outside, 1));

    return origin + pdfApiRouteMap.getImageAsPdf + '?src=' + src;
}
