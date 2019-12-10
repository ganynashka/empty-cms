// @flow

/* global fetch */

import type {MongoUserType} from '../../../../../server/src/database/database-type';
import type {SortDirectionType} from '../../../component/layout/table/enhanced-table/enhanced-table-type';
import {getLisParametersToUrl} from '../../../lib/url';
import {userApiRouteMap} from '../../../../../server/src/api/api-route-map';
import {promiseCatch} from '../../../lib/promise';
import {fetchNumber} from '../../../lib/fetch-x';

export function getUserList(
    pageIndex: number,
    rowsPerPage: number,
    orderBy: string,
    order: SortDirectionType
): Promise<Array<MongoUserType> | Error> {
    const url = getLisParametersToUrl(userApiRouteMap.getUserList, pageIndex, rowsPerPage, orderBy, order);

    return fetch(url)
        .then((response: Response): Promise<Array<MongoUserType> | Error> => response.json())
        .catch(promiseCatch);
}

export function getUserListSize(): Promise<number | Error> {
    return fetchNumber(userApiRouteMap.getUserListSize);
}
