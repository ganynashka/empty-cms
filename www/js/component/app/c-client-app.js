// @flow

import React, {type Node} from 'react';
import {Route, Switch} from 'react-router-dom';

import {ThemeProvider} from '../../provider/theme/c-theme-context';
import {LocaleProvider} from '../../provider/locale/c-locale-context';
import {ScreenProvider} from '../../provider/screen/c-screen-context';
import {UserProvider} from '../../provider/user/c-user-context';
import {PopupProvider} from '../../provider/popup/c-popup-context';
import {SnackbarProvider} from '../../provider/snackbar/c-snackbar-context';
import {MainWrapper} from '../main-wrapper/c-main-wrapper';
import {type InitialDataType} from '../../provider/intial-data/intial-data-type';
import {InitialDataProvider} from '../../provider/intial-data/c-initial-data-context';

import {routeItemClientHeader, routeItemCmsHeader, routeItemFooter, routeItemMap, routeItemPage404} from './routes';
import {redderEmptyRoute} from './render-route/render-route-helper';
import {redderRoute} from './render-route/render-route';
import {renderWrapperList} from './wrapper-list';

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

    if (initialData.is404) {
        return (
            <InitialDataProvider defaultValue={initialData}>
                {renderWrapperList(wrapperList, [redderRoute(routeItemPage404)])}
            </InitialDataProvider>
        );
    }

    return (
        <InitialDataProvider defaultValue={initialData}>
            {renderWrapperList(wrapperList, [
                // redderRoute(routeItemClientHeader),
                // redderRoute(routeItemCmsHeader),
                routeItemKeyList.map((key: string): Node => redderRoute(routeItemMap[key])),
                <Switch key="switch">
                    {routeItemKeyList.map((key: string): Node => redderEmptyRoute(routeItemMap[key]))}
                    {redderRoute(routeItemPage404)}
                </Switch>,
                // redderRoute(routeItemFooter),
            ])}
        </InitialDataProvider>
    );
}
