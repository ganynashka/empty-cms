// @flow

/* global window */

import type {MongoUserFrontType} from '../../../../server/src/db/type';
import {userApiRouteMap} from '../../../../server/src/api/route-map';
import {promiseCatch} from '../../lib/promise';

export function getCurrentUser(): Promise<MongoUserFrontType | Error> {
    return window
        .fetch(userApiRouteMap.getCurrentUser)
        .then((response: Response): Promise<MongoUserFrontType> => response.json())
        .catch(promiseCatch);
}
