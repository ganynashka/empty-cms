// @flow

/* global fetch */

import type {InitialDataType} from '../../../../server/src/intial-data/intial-data-type';
import {initialDataApiRouteMap} from '../../../../server/src/api/api-route-map';
import {promiseCatch} from '../../lib/promise';

export function getInitialClientData(url: string): Promise<InitialDataType | Error> {
    return fetch(initialDataApiRouteMap.getInitialData + `?url=${url}`)
        .then((response: Response): Promise<InitialDataType> => response.json())
        .catch(promiseCatch);
}
