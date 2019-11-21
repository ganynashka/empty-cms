// @flow

import React, {type Node} from 'react';
import {Route, Switch} from 'react-router-dom';

import {PageNotFound} from '../../page/page-not-found/c-page-not-found';
import {LocaleProvider} from '../../provider/locale/c-locale-context';
import {ScreenProvider} from '../../provider/screen/c-screen-context';
import {UserProvider} from '../../provider/user/c-user-context';
import {PopupPortalProvider} from '../layout/popup/popup-portal/c-popup-portal';
import {SnackbarPortalProvider} from '../layout/snackbar/snackbar-portal/c-snackbar-portal';
import {MainWrapper} from '../main-wrapper/c-main-wrapper';
import type {InitialDataType} from '../../../../server/src/c-initial-data-context';
import {InitialDataProvider} from '../../../../server/src/c-initial-data-context';
import {HeaderWrapper} from '../header/c-header-wrapper';

import {routeItemMap} from './routes';
import {redderEmptyRoute, redderRoute} from './render-route-helper';
import {renderWrapperList} from './wrapper-list';

const wrapperList = [
    LocaleProvider,
    ScreenProvider,
    UserProvider,
    PopupPortalProvider,
    SnackbarPortalProvider,
    MainWrapper,
];

const routeItemKeyList = Object.keys(routeItemMap);

export function InnerApp(props: {|+initialData: InitialDataType|}): Node {
    const {initialData} = props;

    return (
        <InitialDataProvider value={initialData}>
            {renderWrapperList(wrapperList, [
                <Route component={HeaderWrapper} key="header"/>,
                routeItemKeyList.map((key: string): Node => redderRoute(routeItemMap[key])),
                <Switch key="switch">
                    {routeItemKeyList.map((key: string): Node => redderEmptyRoute(routeItemMap[key]))}
                    <Route component={PageNotFound}/>
                </Switch>,
            ])}
        </InitialDataProvider>
    );
}
