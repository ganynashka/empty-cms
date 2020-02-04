// @flow

/* global process */

import path from 'path';

const CWD = process.cwd();

const pathToData = path.join(CWD, 'dev/backstop-js/data');

export const emptyConfig = {
    id: 'me-best-test',
    viewports: [
        {
            name: 'phone',
            width: 320,
            height: 800,
        },
        {
            name: 'tablet',
            width: 740,
            height: 800,
        },
        {
            name: 'desktop',
            width: 1250,
            height: 800,
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
