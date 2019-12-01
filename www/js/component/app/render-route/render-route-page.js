// @flow

import React, {type Node} from 'react';

import {isFunction} from '../../../lib/is';
import {PageWrapper} from '../../page-wrapper/c-page-wrapper';
import {canNotLoadComponent} from '../../../lib/can-not-load-component';
import {LoadComponent} from '../../../lib/c-load-component';

import type {RenderPageInputDataType, RouteItemType} from './render-route-type';

// eslint-disable-next-line id-match
export function renderPage(pageInputData: RenderPageInputDataType, routeItem: RouteItemType): Node {
    const {
        location,
        history,
        match,
        initialContextData,
        popupContextData,
        snackbarContextData,
        userContextData,
        staticContext,
    } = pageInputData;

    const {component: PageComponent, asyncLoad} = routeItem;

    if (!isFunction(asyncLoad)) {
        return (
            <PageWrapper location={location}>
                <PageComponent
                    history={history}
                    initialContextData={initialContextData}
                    location={location}
                    match={match}
                    popupContext={popupContextData}
                    snackbarContext={snackbarContextData}
                    staticContext={staticContext}
                    userContextData={userContextData}
                />
            </PageWrapper>
        );
    }

    function loadAsyncPageComponent(): Promise<Node> {
        return (
            asyncLoad()
                // eslint-disable-next-line id-match
                .then((AsyncPageComponent: React$ComponentType<*>): Node => {
                    const syncRouteItem: RouteItemType = {
                        path: routeItem.path,
                        staticPartPath: routeItem.staticPartPath,
                        component: AsyncPageComponent,
                        type: routeItem.type,
                    };

                    return renderPage(pageInputData, syncRouteItem);
                })
                .catch(canNotLoadComponent)
        );
    }

    return <LoadComponent load={loadAsyncPageComponent}/>;
}
