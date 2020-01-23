// @flow

import React, {type Node} from 'react';
import {Switch} from 'react-router-dom';

import {ThemeProvider} from '../../provider/theme/c-theme-context';
import {LocaleProvider} from '../../provider/locale/c-locale-context';
import {ScreenProvider} from '../../provider/screen/c-screen-context';
import {UserProvider} from '../../provider/user/c-user-context';
import {PopupProvider} from '../../provider/popup/c-popup-context';
import {SnackbarProvider} from '../../provider/snackbar/c-snackbar-context';
import {MainWrapper} from '../main-wrapper/c-main-wrapper';
import {type InitialDataType} from '../../provider/intial-data/intial-data-type';
import {InitialDataProvider} from '../../provider/intial-data/c-initial-data-context';
import {Header} from '../client/header/c-header';
import {ScrollRestoration} from '../../provider/screen/scroll-restoration/c-scroll-restoration.js';

import {routeItemMap, routeItemPage404} from './routes';
import {redderRoute} from './render-route/render-route';
import {renderWrapperList} from './wrapper-list';
import {starPath} from './render-route/render-route-const';

const wrapperList = [
    ThemeProvider,
    LocaleProvider,
    ScreenProvider,
    UserProvider,
    PopupProvider,
    SnackbarProvider,
    MainWrapper,
];

const routeItemKeyList = Object.keys(routeItemMap);

type PropsType = {|
    +initialData: InitialDataType,
|};

export function ClientApp(props: PropsType): Node {
    const {initialData} = props;

    const routeList = initialData.is404
        ? null
        : routeItemKeyList.map((key: string): Node => redderRoute(routeItemMap[key]));

    const staticList = [
        redderRoute({
            path: starPath,
            component: ScrollRestoration,
            type: 'route',
            id: 'scroll-restoration',
            pageWrapper: null,
        }),
        redderRoute({
            path: starPath,
            component: Header,
            type: 'route',
            id: 'client-header',
            pageWrapper: null,
        }),
    ];

    return (
        <InitialDataProvider defaultValue={initialData}>
            {renderWrapperList(wrapperList, [
                ...staticList,
                <Switch key="switch">
                    {routeList}
                    {redderRoute(routeItemPage404)}
                </Switch>,
            ])}
        </InitialDataProvider>
    );
}
