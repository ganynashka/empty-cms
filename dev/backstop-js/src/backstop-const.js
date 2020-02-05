// @flow

/* global process */

import path from 'path';

import {type BackstopConfigType} from 'backstopjs';

const CWD = process.cwd();

const pathToData = path.join(CWD, 'dev/backstop-js/data');

export const baseUrl = 'http://localhost:9091';

export const emptyConfig: BackstopConfigType = {
    id: 'me-best-test',
    viewports: [
        {
            name: 'phone',
            width: 320,
            height: 1200,
        },
        {
            name: 'tablet',
            width: 740,
            height: 1200,
        },
        {
            name: 'desktop',
            width: 1250,
            height: 1200,
        },
    ],
    scenarios: [],
    engine: 'puppeteer',
    paths: {
        /* eslint-disable camelcase, id-match */
        bitmaps_reference: path.join(pathToData, 'bitmaps/reference'),
        bitmaps_test: path.join(pathToData, 'bitmaps/test'),
        html_report: path.join(pathToData, 'report/html'),
        ci_report: path.join(pathToData, 'report/ci'),
        /* eslint-enable camelcase, id-match */
    },
    report: ['browser'],
    resembleOutputOptions: {
        ignoreAntialiasing: true,
    },
    debug: false,
};
