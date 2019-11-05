// @flow

import type {SortDirectionType} from '../component/layout/table/enhanced-table/type';
import {direction} from '../component/layout/table/enhanced-table/helper';

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
        `sort-direction=${order === direction.asc ? 1 : -1}`,
    ].join('&');

    return url + '?' + urlParameters;
}
