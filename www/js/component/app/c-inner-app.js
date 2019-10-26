// @flow

import React, {type Node} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import {PageNotFound} from '../../page/page-not-found/c-page-not-found';
import {LocaleProvider} from '../locale/c-locale-context';
import {ScreenProvider} from '../screen/c-screen-context';
import {MainWrapper} from '../main-wrapper/c-main-wrapper';
import type {InitialDataType} from '../../../../server/src/c-initial-data-context';
import {defaultInitialData, InitialDataProvider} from '../../../../server/src/c-initial-data-context';

import {routeItemMap} from './routes';
import {redderEmptyRoute, redderLink, redderRoute} from './render-route-helper';
import {renderWrapperList} from './wrapper-list';

const wrapperList = [LocaleProvider, ScreenProvider, MainWrapper];

export function InnerApp(props: {|+initialData: InitialDataType|}): Node {
    const {initialData} = props;

    return (
        <InitialDataProvider value={initialData}>
            {renderWrapperList(wrapperList, [
                Object.keys(routeItemMap).map((key: string): Node => redderRoute(routeItemMap[key])),
                <Switch key="switch">
                    {Object.keys(routeItemMap).map((key: string): Node => redderEmptyRoute(routeItemMap[key]))}
                    <Route component={PageNotFound}/>
                </Switch>,
            ])}
        </InitialDataProvider>
    );
}
