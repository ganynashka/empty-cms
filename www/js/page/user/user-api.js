// @flow

/* global fetch */

import type {MongoUserType} from '../../../../server/src/db/type';
import type {SortDirectionType} from '../../component/layout/table/enhanced-table/type';
import {getLisParametersToUrl} from '../../lib/url';

export async function getUserList(
    pageIndex: number,
    rowsPerPage: number,
    orderBy: string,
    order: SortDirectionType
): Promise<Array<MongoUserType>> {
    const url = getLisParametersToUrl('/api/get-user-list', pageIndex, rowsPerPage, orderBy, order);
    const rawFetchedData = await fetch(url);
    const rawList: string = await rawFetchedData.text();

    return JSON.parse('[' + rawList.replace(/,$/, '') + ']');
}

export async function getUserListSize(): Promise<number> {
    const rawFetchedData = await fetch('/api/get-user-list-size');
    const rawSize: string = await rawFetchedData.text();

    return parseInt(rawSize, 10);
}
