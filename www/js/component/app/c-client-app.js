// @flow

import React, {type Node} from 'react';
import {Route, Switch} from 'react-router-dom';

import {PageNotFound} from '../../page/client/page-not-found/c-page-not-found';
import {LocaleProvider} from '../../provider/locale/c-locale-context';
import {ScreenProvider} from '../../provider/screen/c-screen-context';
import {UserProvider} from '../../provider/user/c-user-context';
import {PopupProvider} from '../../provider/popup/c-popup-context';
import {SnackbarProvider} from '../../provider/snackbar/c-snackbar-context';
import {MainWrapper} from '../main-wrapper/c-main-wrapper';
import {type InitialDataType} from '../../../../server/src/intial-data/intial-data-type';
import {InitialDataProvider} from '../../../../server/src/intial-data/c-initial-data-context';
import {CMSHeaderWrapper} from '../cms/header/c-cms-header-wrapper';
import {Header} from '../client/header/c-header';

import {routeItemMap, routeItemPage404} from './routes';
import {redderEmptyRoute} from './render-route/render-route-helper';
import {redderRoute} from './render-route/render-route';
import {renderWrapperList} from './wrapper-list';

const wrapperList = [LocaleProvider, ScreenProvider, UserProvider, PopupProvider, SnackbarProvider, MainWrapper];

const routeItemKeyList = Object.keys(routeItemMap);

type PropsType = {|
    +initialData: InitialDataType,
|};

export function ClientApp(props: PropsType): Node {
    const {initialData} = props;

    if (initialData.is404) {
        return (
            <InitialDataProvider value={initialData}>
                {renderWrapperList(wrapperList, [redderRoute(routeItemPage404)])}
            </InitialDataProvider>
        );
    }

    return (
        <InitialDataProvider value={initialData}>
            {renderWrapperList(wrapperList, [
                <Route component={CMSHeaderWrapper} key="cms-header"/>,
                <Route component={Header} key="client-header"/>,
                routeItemKeyList.map((key: string): Node => redderRoute(routeItemMap[key])),
                <Switch key="switch">
                    {routeItemKeyList.map((key: string): Node => redderEmptyRoute(routeItemMap[key]))}
                    {redderRoute(routeItemPage404)}
                </Switch>,
            ])}
        </InitialDataProvider>
    );
}
