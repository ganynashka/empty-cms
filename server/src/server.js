// @flow

/* global process */

/* eslint no-process-env: 0, id-match: 0, optimize-regex/optimize-regex: 0, react/no-danger: 0 */

// import type {IncomingMessage, ServerResponse} from 'http';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {StaticRouter} from 'react-router-dom';
import express, {type $Application, type $Request, type $Response} from 'express';

import {ClientApp} from '../../www/js/component/app/c-client-app';
import {ssrServerPort, ssrHttpServerPortProduction} from '../../webpack/config';
import {getInitialData} from '../../www/js/provider/intial-data/intial-data-helper';
import type {RouterStaticContextType} from '../../www/js/provider/intial-data/intial-data-type';
import {sessionKey, passwordKey} from '../key';

import {getIndexHtmlTemplate} from './static-files';
import {initialScriptClassName, stringForReplaceContent, stringForReplaceMeta, stringForReplaceTitle} from './config';
import {addApiIntoApplication} from './api/api';
import {handleDataBaseChange} from './util/data-base';

const PORT: number = 443; //ssrServerPort;
const app: $Application = express();

/*
const sslCredentials = {
    key: fs.readFileSync(__dirname + '/../../ssl/selfsigned.key'),
    cert: fs.readFileSync(__dirname + '/../../ssl/selfsigned.crt'),
};
*/

// const app = express.createServer(sslCredentials);

// api
addApiIntoApplication(app);

// *.html
app.get('*', async (request: $Request, response: $Response) => {
    const htmlTemplate = getIndexHtmlTemplate();
    const initialData = await getInitialData(request, response);
    // staticContext.is404 will rewrite by page404
    const staticContext: RouterStaticContextType = {is404: false};

    const reactResult = ReactDOMServer.renderToString(
        <StaticRouter context={staticContext} location={request.url}>
            <ClientApp initialData={initialData}/>
            <script
                className={initialScriptClassName}
                dangerouslySetInnerHTML={{__html: `window.initialData = ${JSON.stringify(initialData)}`}}
            />
        </StaticRouter>
    );

    if (staticContext.is404 && !initialData.is404) {
        response.status(404);
        const initialData404 = {...initialData, is404: true};
        const reactResult404 = ReactDOMServer.renderToString(
            <StaticRouter context={staticContext} location={request.url}>
                <ClientApp initialData={initialData404}/>
                <script
                    className={initialScriptClassName}
                    dangerouslySetInnerHTML={{__html: `window.initialData = ${JSON.stringify(initialData404)}`}}
                />
            </StaticRouter>
        );

        const htmlResult404 = htmlTemplate
            .replace(stringForReplaceTitle, initialData.title)
            .replace(stringForReplaceMeta, initialData.meta)
            .replace(stringForReplaceContent, reactResult404);

        response.send(htmlResult404);
        return;
    }

    if (initialData.is404) {
        response.status(404);
    }

    const htmlResult = htmlTemplate
        .replace(stringForReplaceTitle, initialData.title)
        .replace(stringForReplaceMeta, initialData.meta)
        .replace(stringForReplaceContent, reactResult);

    response.send(htmlResult);
});

if (process.env.NODE_ENV === 'production') {
    // $FlowFixMe
    /*
        https
            .createServer(sslCredentials, app)
            .listen(PORT, () => {
                console.info(`Server listening on port ${PORT} - production`);
            })
    */
    app.listen(ssrHttpServerPortProduction, () => {
        console.info(
            `Server listening on port ${ssrHttpServerPortProduction} - ${String(
                process.env.NODE_ENV || 'development'
            )}`
        );
    });
} else {
    app.listen(PORT, () => {
        console.info(`Server listening on port ${PORT} - ${String(process.env.NODE_ENV || 'development')}`);
    });
}

handleDataBaseChange()
    .then((): mixed => console.log('---> handleDataBaseChange: done!'))
    .catch((error: Error) => {
        console.log('---> handleDataBaseChange: error while execution!');
        console.log(error.message);
    });
