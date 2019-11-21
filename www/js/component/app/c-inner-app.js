// @flow

import React, {type Node} from 'react';
import {Route, Switch} from 'react-router-dom';

import {PageNotFound} from '../../page/page-not-found/c-page-not-found';
import {LocaleProvider} from '../../provider/locale/c-locale-context';
import {ScreenProvider} from '../../provider/screen/c-screen-context';
import {UserProvider} from '../../provider/user/c-user-context';
import {PopupProvider} from '../../provider/popup/c-popup-context';
import {SnackbarProvider} from '../../provider/snackbar/c-snackbar-context';
import {MainWrapper} from '../main-wrapper/c-main-wrapper';
import type {InitialDataType} from '../../../../server/src/c-initial-data-context';
import {InitialDataProvider} from '../../../../server/src/c-initial-data-context';
import {HeaderWrapper} from '../header/c-header-wrapper';

import {routeItemMap} from './routes';
import {redderEmptyRoute} from './render-route/render-route-helper';
import {redderRoute} from './render-route/render-route';
import {renderWrapperList} from './wrapper-list';

const wrapperList = [LocaleProvider, ScreenProvider, UserProvider, PopupProvider, SnackbarProvider, MainWrapper];

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
