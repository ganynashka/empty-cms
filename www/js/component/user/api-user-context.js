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

export function login(userLogin: string, userPassword: string): Promise<MongoUserFrontType | Error> {
    return window
        .fetch(userApiRouteMap.login, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({login: userLogin, password: userPassword}),
        })
        .then((response: Response): Promise<MongoUserFrontType> => response.json())
        .catch(promiseCatch);
}

export function register(userLogin: string, userPassword: string): Promise<MongoUserFrontType | Error> {
    return window
        .fetch(userApiRouteMap.register, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({login: userLogin, password: userPassword}),
        })
        .then((response: Response): Promise<MongoUserFrontType> => response.json())
        .catch(promiseCatch);
}
