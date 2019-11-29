// @flow

/* global process */

/* eslint no-process-env: 0, id-match: 0, optimize-regex/optimize-regex: 0, react/no-danger: 0 */

// import type {IncomingMessage, ServerResponse} from 'http';
// import https from 'https';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {StaticRouter} from 'react-router-dom';
import express, {type $Application, type $Request, type $Response} from 'express';

import {ClientApp} from '../../www/js/component/app/c-client-app';
import {ssrServerPort} from '../../webpack/config';

import {getIndexHtmlTemplate} from './static-files';
// import type {RouterStaticContextType} from './c-initial-data-context';
import {getInitialData} from './c-initial-data-context';
import {stringForReplaceContent, stringForReplaceTitle, stringForReplaceDescription} from './config';
import {addApiIntoApplication} from './api/api';

const PORT: number = ssrServerPort;
const app: $Application = express();

// const app = express.createServer(sslCredentials);

// api
addApiIntoApplication(app);

// *.html
app.get('*', async (request: $Request, response: $Response) => {
    const htmlTemplate = getIndexHtmlTemplate();
    // const staticContext: RouterStaticContextType = {is404: false};
    const initialData = await getInitialData(request, response);

    const reactResult = ReactDOMServer.renderToString(
        <StaticRouter context={{}} location={request.url}>
            <ClientApp initialData={initialData}/>
            <script dangerouslySetInnerHTML={{__html: `window.initialData = ${JSON.stringify(initialData)}`}}/>
        </StaticRouter>
    );

    const html404Result = htmlTemplate
        .replace(stringForReplaceTitle, initialData.title)
        .replace(stringForReplaceDescription, initialData.description)
        .replace(stringForReplaceContent, reactResult);

    response.send(html404Result);
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
