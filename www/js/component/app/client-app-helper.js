// @flow

import type {InitialDataType} from '../../provider/intial-data/intial-data-type';
import {initialDataApiRouteMap} from '../../../../server/src/api/api-route-map';
import {fetchX} from '../../lib/fetch-x';

export function getInitialClientData(url: string, deep: number): Promise<InitialDataType | Error> {
    return fetchX<InitialDataType | Error>(initialDataApiRouteMap.getInitialData + `?url=${url}&deep=${deep}`);
}
