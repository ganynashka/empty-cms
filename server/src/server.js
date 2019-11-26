// @flow

/* global process */

/* eslint no-process-env: 0, id-match: 0, optimize-regex/optimize-regex: 0, react/no-danger: 0 */

// import type {IncomingMessage, ServerResponse} from 'http';
// import https from 'https';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {StaticRouter} from 'react-router-dom';
import express, {type $Application, type $Request, type $Response} from 'express';

import {InnerApp} from '../../www/js/component/app/c-inner-app';
import {ssrServerPort} from '../../webpack/config';

import {getIndexHtmlTemplate} from './static-files';
import type {RouterStaticContextType} from './c-initial-data-context';
import {defaultInitialData, type InitialDataType} from './c-initial-data-context';
import {stringForReplace} from './config';
import {addApiIntoApplication} from './api/api';
const PORT: number = ssrServerPort;
const app: $Application = express();

// const app = express.createServer(sslCredentials);

// api
addApiIntoApplication(app);

// *.html
app.get('*', async (request: $Request, response: $Response) => {
    const initialData: InitialDataType = {...defaultInitialData, apiData: null};
    const staticContext: RouterStaticContextType = {is404: false};
    const result = ReactDOMServer.renderToString(
        <StaticRouter context={staticContext} location={request.url}>
            <InnerApp initialData={initialData}/>
            <script dangerouslySetInnerHTML={{__html: `window.initialData = ${JSON.stringify(initialData)}`}}/>
        </StaticRouter>
    );

    if (staticContext.is404 === true) {
        response.status(404);
    }

    const htmlTemplate = getIndexHtmlTemplate();

    response.send(htmlTemplate.replace(stringForReplace, result));
});

/*
if (process.env.NODE_ENV === 'production') {
    // $FlowFixMe
    https.createServer(sslCredentials, app).listen(PORT, () => {
        console.info(`Server listening on port ${PORT} - production`);
    });
} else {
*/
app.listen(PORT, () => {
    console.info(`Server listening on port ${PORT} - ${String(process.env.NODE_ENV || 'development')}`);
});
// }
