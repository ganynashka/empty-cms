// @flow

import {type $Application, type $Request, type $Response} from 'express';

import {getSession, isAdmin} from '../util/session';
import {routePathMap} from '../../../www/js/component/app/routes-path-map';

import {userApiRouteMap} from './route-map';

export function addDefendApi(app: $Application) {
    app.use((request: $Request, response: $Response, next: () => mixed) => {
        const userSession = getSession(request);

        console.log('---> Defend API:');
        console.log('--->     URL:', request.url);
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

        if (
            [
                userApiRouteMap.login,
                userApiRouteMap.register,
                routePathMap.login.path,
                routePathMap.register.path,
            ].includes(url)
        ) {
            next();
            return;
        }

        next(new Error('You are NOT admin. Go to ' + routePathMap.login.path));
    });
}
