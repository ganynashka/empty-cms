// @flow

/* global fetch */

import type {InitialDataType} from '../../../../server/src/intial-data/intial-data-type';
import {initialDataApiRouteMap} from '../../../../server/src/api/api-route-map';
import {fetchX} from '../../lib/fetch-x';

export function getInitialClientData(url: string): Promise<InitialDataType | Error> {
    return fetchX<InitialDataType | Error>(initialDataApiRouteMap.getInitialData + `?url=${url}`);
}
