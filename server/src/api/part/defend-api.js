// @flow

import {type $Application, type $Request, type $Response} from 'express';

import {getSession, isAdmin as getIsAdmin} from '../../util/session';
import {routePathMap} from '../../../../www/js/component/app/routes-path-map';
import {documentApiRouteMap, fileApiRouteMap, initialDataApiRouteMap, userApiRouteMap} from '../api-route-map';

export function addDefendApi(app: $Application) {
    const publicPathList = [routePathMap.login.path, routePathMap.register.path, routePathMap.siteEnter.path];

    const publicApiList = [
        userApiRouteMap.login,
        userApiRouteMap.unLogin,
        userApiRouteMap.register,
        userApiRouteMap.getCurrentUser,
        initialDataApiRouteMap.getInitialData,
        documentApiRouteMap.documentSearch,
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

    // eslint-disable-next-line complexity, max-statements
    app.use((request: $Request, response: $Response, next: (error?: ?Error) => mixed) => {
        const {path} = request;

        if (publicApiList.includes(path)) {
            next();
            return;
        }

        if (publicPathList.includes(path)) {
            next();
            return;
        }

        // check resized image
        if (path.startsWith(fileApiRouteMap.getResizedImage)) {
            next();
            return;
        }

        // article
        if (path.startsWith(routePathMap.article.staticPartPath)) {
            next();
            return;
        }

        const isAdmin = getIsAdmin(request);

        if (path.startsWith('/api/')) {
            if (isAdmin) {
                next();
                return;
            }

            response.status(403);
            next(new Error('You are not admin.'));
            return;
        }

        // check cms
        if (path.startsWith(routePathMap.cmsEnter.path)) {
            if (isAdmin) {
                next();
                return;
            }

            response.redirect(routePathMap.login.path);
            return;
        }

        response.status(404);
        next();
    });
}
