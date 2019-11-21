// @flow

import type {SortDirectionType} from '../component/layout/table/enhanced-table/enhanced-table-type';
import {enhancedTableDirection} from '../component/layout/table/enhanced-table/enhanced-table-const';

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
