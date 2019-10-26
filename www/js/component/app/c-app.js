// @flow

/* global window */

import React, {type Node} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import {defaultInitialData, InitialDataProvider} from '../../../../server/src/c-initial-data-context';

import {InnerApp} from './c-inner-app';

export function App(): Node {
    return (
        <BrowserRouter>
            <InnerApp initialData={window.initialData || defaultInitialData}/>
        </BrowserRouter>
    );
}
