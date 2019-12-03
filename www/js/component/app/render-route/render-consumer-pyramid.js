// @flow

import React, {type Node} from 'react';

import type {ContextRouterType} from '../../../type/react-router-dom-v5-type-extract';
import {ThemeContextConsumer} from '../../../provider/theme/c-theme-context';
import type {ThemeContextType} from '../../../provider/theme/theme-context-type';
import {InitialDataConsumer} from '../../../../../server/src/intial-data/c-initial-data-context';
import type {InitialDataType} from '../../../../../server/src/intial-data/intial-data-type';
import {SnackbarContextConsumer} from '../../../provider/snackbar/c-snackbar-context';
import type {SnackbarContextType} from '../../../provider/snackbar/snackbar-context-type';
import {UserContextConsumer} from '../../../provider/user/c-user-context';
import type {UserContextConsumerType} from '../../../provider/user/user-context-type';
import {PopupContextConsumer} from '../../../provider/popup/c-popup-context';
import type {PopupContextType} from '../../../provider/popup/popup-context-type';

import type {RenderPageInputDataType, RouteItemType} from './render-route-type';
import {renderPage} from './render-route-page';

export function renderConsumerPyramid(routeItem: RouteItemType, contextRouterData: ContextRouterType): Node {
    const {match, history, location, staticContext} = contextRouterData;

    return (
        <ThemeContextConsumer>
            {(themeContextData: ThemeContextType): Node => {
                return (
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
                                                                    themeContextData,
                                                                    staticContext,
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
                );
            }}
        </ThemeContextConsumer>
    );
}
