// @flow

import {type $Application, type $Request, type $Response} from 'express';

import {getSession, isAdmin as getIsAdmin} from '../../util/session';
import {routePathMap} from '../../../../www/js/component/app/routes-path-map';
import {userApiRouteMap} from '../api-route-map';

export function addDefendApi(app: $Application) {
    const publicPathList = [routePathMap.login.path, routePathMap.register.path, routePathMap.siteEnter.path];

    const publicApiList = [
        userApiRouteMap.login,
        userApiRouteMap.unLogin,
        userApiRouteMap.register,
        userApiRouteMap.getCurrentUser,
    ];

    app.use((request: $Request, response: $Response, next: () => mixed) => {
        const userSession = getSession(request);

        console.log('---> Defend API:');
        console.log('--->     url:', request.url);
        console.log('--->     path:', request.path);
        console.log('--->     Session.login:', String(userSession.login));
        console.log('--->     Session.role:', String(userSession.role));

        next();
    });

    app.use((request: $Request, response: $Response, next: (error?: ?Error) => mixed) => {
        const {path} = request;

        const isAdmin = getIsAdmin(request);

        if (isAdmin) {
            next();
            return;
        }

        if (publicPathList.includes(path)) {
            next();
            return;
        }

        if (publicApiList.includes(path)) {
            next();
            return;
        }

        // check cms
        if (path.startsWith(routePathMap.cmsEnter.path)) {
            response.redirect(routePathMap.login.path);
            return;
        }

        // actually show 404 page
        next();
    });
}
