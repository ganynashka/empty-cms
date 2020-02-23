// @flow

/* eslint-disable max-len */

import React, {type Node} from 'react';

import type {ContextRouterType} from '../../../type/react-router-dom-v5-type-extract';
import {ThemeContextConsumer} from '../../../provider/theme/c-theme-context';
import type {ThemeContextType} from '../../../provider/theme/theme-context-type';
import {InitialDataContextConsumer} from '../../../provider/intial-data/c-initial-data-context';
import type {InitialDataType} from '../../../provider/intial-data/intial-data-type';
import {SnackbarContextConsumer} from '../../../provider/snackbar/c-snackbar-context';
import type {SnackbarContextType} from '../../../provider/snackbar/snackbar-context-type';
import {UserContextConsumer} from '../../../provider/user/c-user-context';
import type {UserContextType} from '../../../provider/user/user-context-type';
import {PopupContextConsumer} from '../../../provider/popup/c-popup-context';
import type {PopupContextType} from '../../../provider/popup/popup-context-type';
import {ScreenContextConsumer} from '../../../provider/screen/c-screen-context';
import type {ScreenContextType} from '../../../provider/screen/screen-context-type';
import {AudioPlayerContextConsumer} from '../../../provider/audio-player/c-audio-player-context';
import type {AudioPlayerContextType} from '../../../provider/audio-player/audio-player-type';

import type {RenderPageInputDataType, RouteItemType} from './render-route-type';
import {renderPage} from './render-route-page';

export function renderConsumerPyramid(routeItem: RouteItemType, contextRouterData: ContextRouterType): Node {
    const {match, history, location, staticContext} = contextRouterData;

    return (
        <AudioPlayerContextConsumer>
            {(audioPlayerContextData: AudioPlayerContextType): Node => {
                return (
                    <ScreenContextConsumer>
                        {(screenContextData: ScreenContextType): Node => {
                            return (
                                <ThemeContextConsumer>
                                    {(themeContextData: ThemeContextType): Node => {
                                        return (
                                            <InitialDataContextConsumer>
                                                {(initialContextData: InitialDataType): Node => {
                                                    return (
                                                        <SnackbarContextConsumer>
                                                            {(snackbarContextData: SnackbarContextType): Node => {
                                                                return (
                                                                    <UserContextConsumer>
                                                                        {(userContextData: UserContextType): Node => {
                                                                            return (
                                                                                <PopupContextConsumer>
                                                                                    {(
                                                                                        popupContextData: PopupContextType
                                                                                    ): Node => {
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
                                                                                            screenContextData,
                                                                                            audioPlayerContextData,
                                                                                        };

                                                                                        return renderPage(
                                                                                            pageInputData,
                                                                                            routeItem
                                                                                        );
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
                                            </InitialDataContextConsumer>
                                        );
                                    }}
                                </ThemeContextConsumer>
                            );
                        }}
                    </ScreenContextConsumer>
                );
            }}
        </AudioPlayerContextConsumer>
    );
}
