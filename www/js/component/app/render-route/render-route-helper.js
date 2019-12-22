// @flow

/* eslint react/no-multi-comp: 0 */

import React, {type Node} from 'react';
import {Link, Redirect, Route} from 'react-router-dom';

import {Footer} from '../../client/footer/c-footer';
import {Header as ClientHeader} from '../../client/header/c-header';
import {CMSHeaderWrapper} from '../../cms/header/c-cms-header-wrapper';

import type {RedirectItemType, RenderPageInputDataType, RouteItemType} from './render-route-type';

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

export function renderPageComponent(pageInputData: RenderPageInputDataType, routeItem: RouteItemType): Node {
    const {
        location,
        history,
        match,
        initialContextData,
        popupContextData,
        snackbarContextData,
        userContextData,
        staticContext,
        themeContextData,
        screenContextData,
    } = pageInputData;

    const {component: PageComponent} = routeItem;

    return (
        <>
            <ClientHeader
                initialContextData={initialContextData}
                location={location}
                screenContextData={screenContextData}
                themeContextData={themeContextData}
            />
            <CMSHeaderWrapper location={location}/>
            <PageComponent
                history={history}
                initialContextData={initialContextData}
                location={location}
                match={match}
                popupContext={popupContextData}
                screenContextData={screenContextData}
                snackbarContext={snackbarContextData}
                staticContext={staticContext}
                themeContextData={themeContextData}
                userContextData={userContextData}
            />
            <Footer location={location}/>
        </>
    );
}
