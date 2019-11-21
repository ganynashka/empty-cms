// @flow

/* eslint react/no-multi-comp: 0 */

import React, {type Node} from 'react';
import {CSSTransition} from 'react-transition-group';
import {Link, Redirect, Route} from 'react-router-dom';

import type {MatchType} from '../../type/react-router-dom-v5-type-extract';
import {PageWrapper} from '../page-wrapper/c-page-wrapper';
import pageWrapperStyle from '../page-wrapper/page-wrapper.scss';
import type {PopupContextType} from '../../provider/popup/popup-context-type';
import {PopupContextConsumer} from '../../provider/popup/c-popup-context';
import type {SnackbarContextType} from '../../provider/snackbar/snackbar-context-type';
import {SnackbarContextConsumer} from '../../provider/snackbar/c-snackbar-context';
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
                        <SnackbarContextConsumer>
                            {(snackbarPortalContextData: SnackbarContextType): Node => {
                                return (
                                    <UserContextConsumer>
                                        {(userContextData: UserContextConsumerType): Node => {
                                            return (
                                                <PopupContextConsumer>
                                                    {(popupPortalContextData: PopupContextType): Node => {
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
                                                </PopupContextConsumer>
                                            );
                                        }}
                                    </UserContextConsumer>
                                );
                            }}
                        </SnackbarContextConsumer>
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
