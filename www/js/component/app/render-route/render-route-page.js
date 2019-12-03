// @flow

import React, {type Node} from 'react';

import {isFunction} from '../../../lib/is';
import {canNotLoadComponent} from '../../../lib/can-not-load-component';
import {LoadComponent} from '../../../lib/c-load-component';

import type {RenderPageInputDataType, RouteItemType} from './render-route-type';
import {renderPageComponent} from './render-route-helper';

export function renderPage(pageInputData: RenderPageInputDataType, routeItem: RouteItemType): Node {
    const {location} = pageInputData;

    const {asyncLoad, pageWrapper: PageWrapper} = routeItem;

    if (!isFunction(asyncLoad)) {
        const pageComponent = renderPageComponent(pageInputData, routeItem);

        return PageWrapper ? <PageWrapper location={location}>{pageComponent}</PageWrapper> : pageComponent;
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
                        pageWrapper: routeItem.pageWrapper,
                    };

                    return renderPage(pageInputData, syncRouteItem);
                })
                .catch(canNotLoadComponent)
        );
    }

    return <LoadComponent load={loadAsyncPageComponent}/>;
}
