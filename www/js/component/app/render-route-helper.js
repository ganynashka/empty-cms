// @flow

/* eslint react/no-multi-comp: 0 */

import React, {type Node} from 'react';
import {CSSTransition} from 'react-transition-group';
import {Link, Redirect, Route} from 'react-router-dom';

import type {MatchType} from '../../type/react-router-dom-v5-type-extract';
import {PageWrapper} from '../page-wrapper/c-page-wrapper';
import pageWrapperStyle from '../page-wrapper/page-wrapper.scss';
import type {PopupPortalContextType} from '../layout/popup/popup-portal/c-popup-portal';
import {PopupPortalContextConsumer} from '../layout/popup/popup-portal/c-popup-portal';
import type {SnackbarPortalContextType} from '../layout/snackbar/snackbar-portal/c-snackbar-portal';
import {SnackbarPortalContextConsumer} from '../layout/snackbar/snackbar-portal/c-snackbar-portal';
import type {UserContextConsumerType} from '../../provider/user/user-context-type';
import {UserContextConsumer} from '../../provider/user/c-user-context';

export type RouteItemType = {|
    +path: string,
    +staticPartPath?: string,
    // eslint-disable-next-line id-match
    +component: React$ComponentType<*>,
    +type: 'route',
|};

export type RedirectItemType = {|
    +from: string,
    +path: string,
    +staticPartPath?: string,
    +type: 'redirect',
|};

const cssTransitionClassNameMap = {
    enter: pageWrapperStyle.transition_enter,
    enterActive: pageWrapperStyle.transition_enter_active,
    exit: pageWrapperStyle.transition_exit,
    exitActive: pageWrapperStyle.transition_exit_active,
};

function isRoute(routeItem: RouteItemType | RedirectItemType): boolean %checks {
    return routeItem.type === 'route';
}

function isRedirect(routeItem: RouteItemType | RedirectItemType): boolean %checks {
    return routeItem.type === 'redirect';
}

export function redderRoute(routeItem: RouteItemType | RedirectItemType): Node {
    const {path} = routeItem;

    if (isRedirect(routeItem)) {
        return <Redirect from={routeItem.from} key={routeItem.from + path} to={path}/>;
    }

    const {component: PageComponent} = routeItem;

    return (
        <Route exact key={path} path={path}>
            {(contextRouterData: {match: MatchType | null}): Node => {
                const {match} = contextRouterData;

                return (
                    <CSSTransition
                        classNames={cssTransitionClassNameMap}
                        in={match !== null}
                        // see ../page-wrapper/page-wrapper.style.scss to use the same transition duration
                        timeout={300}
                        unmountOnExit
                    >
                        <SnackbarPortalContextConsumer>
                            {(snackbarPortalContextData: SnackbarPortalContextType): Node => {
                                return (
                                    <UserContextConsumer>
                                        {(userContextData: UserContextConsumerType): Node => {
                                            return (
                                                <PopupPortalContextConsumer>
                                                    {(popupPortalContextData: PopupPortalContextType): Node => {
                                                        return (
                                                            <PageWrapper>
                                                                <PageComponent
                                                                    match={match}
                                                                    popupPortalContext={popupPortalContextData}
                                                                    snackbarPortalContext={snackbarPortalContextData}
                                                                    userContextData={userContextData}
                                                                />
                                                            </PageWrapper>
                                                        );
                                                    }}
                                                </PopupPortalContextConsumer>
                                            );
                                        }}
                                    </UserContextConsumer>
                                );
                            }}
                        </SnackbarPortalContextConsumer>
                    </CSSTransition>
                );
            }}
        </Route>
    );
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
