// @flow

import {type $Application, type $Request, type $Response} from 'express';

import {typeConverter} from '../../../www/js/lib/type';
import {getSession, isAdmin} from '../util/session';
import {getCollection} from '../db/util';
import type {MongoUserType} from '../db/type';
import {dataBaseConst} from '../db/const';
import {getTime} from '../util/time';
import type {UserLoginPasswordType} from '../util/user';
import {getPasswordSha256, getUserByLogin} from '../util/user';

import {routePathMap} from '../../../www/js/component/app/routes-path-map';

import {getListParameters, streamOptionsArray} from './helper';

export function addDefendApi(app: $Application) {
    app.use((request: $Request, response: $Response, next: () => mixed) => {
        const userSession = getSession(request);

        console.log('---> Defend API:');
        console.log('--->     Session.login:', String(userSession.login));
        console.log('--->     Session.role:', String(userSession.role));

        next();
    });

    app.use((request: $Request, response: $Response, next: (error?: ?Error) => mixed) => {
        const {url} = request;

        if (isAdmin(request)) {
            next();
            return;
        }

        if (['/api/login', '/api/register', routePathMap.login.path, routePathMap.register.path].includes(url)) {
            next();
            return;
        }

        next(new Error('You are NOT admin. Go to ' + routePathMap.login.path));
    });
}
