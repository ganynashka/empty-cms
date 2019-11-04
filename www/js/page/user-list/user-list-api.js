// @flow

/* global fetch */

import type {MongoUserType} from '../../../../server/src/db/type';
import type {SortDirectionType} from '../../component/layout/table/enhanced-table/helper';
import {direction} from '../../component/layout/table/enhanced-table/helper';

export async function getUserList(
    pageIndex: number,
    rowsPerPage: number,
    orderBy: string,
    order: SortDirectionType
): Promise<Array<MongoUserType>> {
    const url = '/api/get-user-list';
    const urlParameters = [
        `page-index=${pageIndex}`,
        `page-size=${rowsPerPage}`,
        `sort-parameter=${orderBy}`,
        `sort-direction=${order === direction.asc ? 1 : -1}`,
    ].join('&');
    const rawFetchedData = await fetch(url + '?' + urlParameters);
    const rawList: string = await rawFetchedData.text();

    return JSON.parse('[' + rawList.replace(/,$/, '') + ']');
}

export async function getUserListSize(): Promise<number> {
    const rawFetchedData = await fetch('/api/get-user-list-size');
    const rawSize: string = await rawFetchedData.text();

    return parseInt(rawSize, 10);
}
