// @flow

import React, {type Node} from 'react';
import {CSSTransition} from 'react-transition-group';
import {Redirect, Route} from 'react-router-dom';

import type {ContextRouterType} from '../../../type/react-router-dom-v5-type-extract';
import type {InitialDataType} from '../../../../../server/src/intial-data/intial-data-type';
import type {PopupContextType} from '../../../provider/popup/popup-context-type';
import {PopupContextConsumer} from '../../../provider/popup/c-popup-context';
import type {SnackbarContextType} from '../../../provider/snackbar/snackbar-context-type';
import {SnackbarContextConsumer} from '../../../provider/snackbar/c-snackbar-context';
import type {UserContextConsumerType} from '../../../provider/user/user-context-type';
import {UserContextConsumer} from '../../../provider/user/c-user-context';
import {InitialDataConsumer} from '../../../../../server/src/intial-data/c-initial-data-context';

import type {RedirectItemType, RenderPageInputDataType, RouteItemType} from './render-route-type';
import {routeCssTransitionClassNameMap} from './render-route-const';
import {isRedirect} from './render-route-helper';
import {renderPage} from './render-route-page';

export function redderRoute(routeItem: RouteItemType | RedirectItemType): Node {
    const {path} = routeItem;

    if (isRedirect(routeItem)) {
        return <Redirect from={routeItem.from} key={routeItem.from + path} to={path}/>;
    }

    return (
        <Route exact key={path} path={path}>
            {(contextRouterData: ContextRouterType): Node => {
                const {match, history, location} = contextRouterData;

                return (
                    <CSSTransition
                        classNames={routeCssTransitionClassNameMap}
                        in={match !== null}
                        // see ../page-wrapper/page-wrapper.style.scss to use the same transition duration
                        timeout={300}
                        unmountOnExit
                    >
                        <InitialDataConsumer>
                            {(initialContextData: InitialDataType): Node => {
                                return (
                                    <SnackbarContextConsumer>
                                        {(snackbarContextData: SnackbarContextType): Node => {
                                            return (
                                                <UserContextConsumer>
                                                    {(userContextData: UserContextConsumerType): Node => {
                                                        return (
                                                            <PopupContextConsumer>
                                                                {(popupContextData: PopupContextType): Node => {
                                                                    const pageInputData: RenderPageInputDataType = {
                                                                        location,
                                                                        history,
                                                                        match,
                                                                        initialContextData,
                                                                        popupContextData,
                                                                        snackbarContextData,
                                                                        userContextData,
                                                                    };

                                                                    return renderPage(pageInputData, routeItem);
                                                                }}
                                                            </PopupContextConsumer>
                                                        );
                                                    }}
                                                </UserContextConsumer>
                                            );
                                        }}
                                    </SnackbarContextConsumer>
                                );
                            }}
                        </InitialDataConsumer>
                    </CSSTransition>
                );
            }}
        </Route>
    );
}
