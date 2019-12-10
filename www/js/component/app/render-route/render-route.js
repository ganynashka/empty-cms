// @flow

import React, {type Node} from 'react';
import {CSSTransition} from 'react-transition-group';
import {Redirect, Route} from 'react-router-dom';

import type {ContextRouterType} from '../../../type/react-router-dom-v5-type-extract';
import {isString} from '../../../lib/is';

import type {RedirectItemType, RouteItemType} from './render-route-type';
import {routeCssTransitionClassNameMap} from './render-route-const';
import {isRedirect} from './render-route-helper';
import {renderConsumerPyramid} from './render-consumer-pyramid';

export function redderRoute(routeItem: RouteItemType | RedirectItemType): Node {
    const {path, id} = routeItem;

    const routeKey = isString(id) ? id : path;

    if (isRedirect(routeItem)) {
        return <Redirect from={routeItem.from} key={routeItem.from + routeKey} to={path}/>;
    }

    return (
        <Route exact key={routeKey} path={path}>
            {(contextRouterData: ContextRouterType): Node => {
                const {match} = contextRouterData;

                return (
                    <CSSTransition
                        classNames={routeCssTransitionClassNameMap}
                        in={match !== null}
                        // see ../page-wrapper/page-wrapper.style.scss to use the same transition duration
                        timeout={1000}
                        unmountOnExit
                    >
                        {renderConsumerPyramid(routeItem, contextRouterData)}
                    </CSSTransition>
                );
            }}
        </Route>
    );
}
