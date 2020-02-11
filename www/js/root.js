// @flow

/* global document */

import React from 'react';
import {render} from 'react-dom';

import {App} from './component/app/c-app';
import {selector} from './const';
import {registerServiceWorker} from './lib/service-worker';

const nodeWrapper = document.querySelector(selector.appWrapper);

if (nodeWrapper !== null) {
    render(<App/>, nodeWrapper);
} else {
    console.error('Can not find nodeWrapper');
}

// registerServiceWorker();
