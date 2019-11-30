// @flow

/* global fetch */

/* eslint react/no-multi-comp: 0 */

import React, {type Node} from 'react';
import {Link, Redirect, Route} from 'react-router-dom';

import type {InitialDataType} from '../../../../../server/src/intial-data/intial-data-type';
import {promiseCatch} from '../../../lib/promise';
import {initialDataApiRouteMap} from '../../../../../server/src/api/api-route-map';

import type {RedirectItemType, RouteItemType} from './render-route-type';

export function isRoute(routeItem: RouteItemType | RedirectItemType): boolean %checks {
    return routeItem.type === 'route';
}

export function isRedirect(routeItem: RouteItemType | RedirectItemType): boolean %checks {
    return routeItem.type === 'redirect';
}

export function redderEmptyRoute(routeItem: RouteItemType | RedirectItemType): Node {
    const {path} = routeItem;

    if (isRedirect(routeItem)) {
        return <Redirect from={routeItem.from} key={routeItem.from + path} to={path}/>;
    }

    return <Route exact key={path} path={path}/>;
}

export function redderLink(routeItem: RouteItemType): Node {
    const {path} = routeItem;

    return (
        <Link key={path} to={path}>
            {path}
        </Link>
    );
}

export function getInitialData(url: string): Promise<InitialDataType | Error> {
    return fetch(initialDataApiRouteMap.getInitialData + `?url=${url}`)
        .then((response: Response): Promise<InitialDataType> => response.json())
        .catch(promiseCatch);
}
