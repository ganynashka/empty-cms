// @flow

/* global fetch */

import type {MongoUserType} from '../../../../../server/src/database/database-type';
import type {SortDirectionType} from '../../../component/layout/table/enhanced-table/enhanced-table-type';
import {getLisParametersToUrl} from '../../../lib/url';
import {userApiRouteMap} from '../../../../../server/src/api/api-route-map';

export async function getUserList(
    pageIndex: number,
    rowsPerPage: number,
    orderBy: string,
    order: SortDirectionType
): Promise<Array<MongoUserType>> {
    const url = getLisParametersToUrl(userApiRouteMap.getUserList, pageIndex, rowsPerPage, orderBy, order);
    const rawFetchedData = await fetch(url);
    const rawList: string = await rawFetchedData.text();

    return JSON.parse('[' + rawList.replace(/,$/, '') + ']');
}

export async function getUserListSize(): Promise<number> {
    const rawFetchedData = await fetch(userApiRouteMap.getUserListSize);
    const rawSize: string = await rawFetchedData.text();

    return parseInt(rawSize, 10);
}
