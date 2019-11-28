// @flow

import {type $Application, type $Request, type $Response} from 'express';

import {getSession, isAdmin} from '../../util/session';
import {routePathMap} from '../../../../www/js/component/app/routes-path-map';
import {userApiRouteMap} from '../api-route-map';

export function addDefendApi(app: $Application) {
    const publicPathList = [
        userApiRouteMap.login,
        userApiRouteMap.register,
        userApiRouteMap.getCurrentUser,
        routePathMap.login.path,
        routePathMap.register.path,

        routePathMap.siteEnter.path,
    ];

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

        if (publicPathList.includes(url)) {
            next();
            return;
        }

        if (isAdmin(request)) {
            next();
            return;
        }

        response.redirect(routePathMap.login.path);
    });
}
