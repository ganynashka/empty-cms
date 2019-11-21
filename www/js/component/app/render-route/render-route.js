// @flow

import React, {type Node} from 'react';
import {CSSTransition} from 'react-transition-group';
import {Redirect, Route} from 'react-router-dom';

import type {MatchType} from '../../../type/react-router-dom-v5-type-extract';
import {PageWrapper} from '../../page-wrapper/c-page-wrapper';
import type {PopupContextType} from '../../../provider/popup/popup-context-type';
import {PopupContextConsumer} from '../../../provider/popup/c-popup-context';
import type {SnackbarContextType} from '../../../provider/snackbar/snackbar-context-type';
import {SnackbarContextConsumer} from '../../../provider/snackbar/c-snackbar-context';
import type {UserContextConsumerType} from '../../../provider/user/user-context-type';
import {UserContextConsumer} from '../../../provider/user/c-user-context';

import type {RedirectItemType, RouteItemType} from './render-route-type';
import {routeCssTransitionClassNameMap} from './render-route-const';
import {isRedirect} from './render-route-helper';

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
                        classNames={routeCssTransitionClassNameMap}
                        in={match !== null}
                        // see ../page-wrapper/page-wrapper.style.scss to use the same transition duration
                        timeout={300}
                        unmountOnExit
                    >
                        <SnackbarContextConsumer>
                            {(snackbarContextData: SnackbarContextType): Node => {
                                return (
                                    <UserContextConsumer>
                                        {(userContextData: UserContextConsumerType): Node => {
                                            return (
                                                <PopupContextConsumer>
                                                    {(popupContextData: PopupContextType): Node => {
                                                        return (
                                                            <PageWrapper>
                                                                <PageComponent
                                                                    match={match}
                                                                    popupContext={popupContextData}
                                                                    snackbarContext={snackbarContextData}
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
