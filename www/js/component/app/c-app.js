// @flow

/* global window */

import React, {type Node} from 'react';
import {BrowserRouter} from 'react-router-dom';

import {defaultInitialData} from '../../../../server/src/c-initial-data-context';

import {ClientApp} from './c-client-app.js';

export function App(): Node {
    return (
        <BrowserRouter>
            <ClientApp initialData={window.initialData || defaultInitialData}/>
        </BrowserRouter>
    );
}
