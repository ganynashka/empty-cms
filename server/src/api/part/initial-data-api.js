// @flow

import {type $Application, type $Request, type $Response} from 'express';

import {initialDataApiRouteMap} from '../api-route-map';
import {getInitialDataByPath} from '../../intial-data/intial-data-helper';
import {routePathMap} from '../../../../www/js/component/app/routes-path-map';

export function initialDataApi(app: $Application) {
    app.get(initialDataApiRouteMap.getInitialData, async (request: $Request, response: $Response) => {
        const url = String(request.query.url || routePathMap.siteEnter.path);

        const initialData = await getInitialDataByPath(url);

        if (initialData.is404) {
            response.status(404);
        }

        response.json(initialData);
    });
}
