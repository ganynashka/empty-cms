// @flow

/* global process */

/* eslint no-process-env: 0, id-match: 0, optimize-regex/optimize-regex: 0, react/no-danger: 0 */

// import type {IncomingMessage, ServerResponse} from 'http';
import https from 'https';
import http, {type IncomingMessage, type ServerResponse} from 'http';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {StaticRouter} from 'react-router-dom';
import express, {type $Application, type $Request, type $Response} from 'express';

import {ClientApp} from '../../www/js/component/app/c-client-app';
import {ssrServerPort, ssrHttpServerPortProduction, ssrHttpsServerPortProduction} from '../../webpack/config';
import {getInitialData, getOpenGraphMetaString} from '../../www/js/provider/intial-data/intial-data-helper';
import type {RouterStaticContextType} from '../../www/js/provider/intial-data/intial-data-type';
import {caChain, sslCert, sslKey} from '../key/key';

import {getIndexHtmlTemplate} from './static-files';
import {
    hostingDomainName,
    hostingIpAddress,
    initialScriptClassName,
    stringForReplaceContent,
    stringForReplaceMeta,
    stringForReplaceOpenGraphMeta,
    stringForReplaceSeoMeta,
    stringForReplaceTitle,
} from './config';
import {addApiIntoApplication} from './api/api';
import {handleDataBaseChange} from './util/data-base';
import {getSeoMetaString} from './util/seo';

const app: $Application = express();

if (process.env.NODE_ENV === 'production') {
    https
        .createServer(
            {
                host: hostingIpAddress,
                hostname: hostingDomainName,
                key: sslKey,
                cert: sslCert,
                // eslint-disable-next-line id-length
                ca: caChain,
                // requestCert: true,
                // rejectUnauthorized: false,
                // passphrase: passwordKey + sessionKey,
            },
            // $FlowFixMe
            app
        )
        .listen(ssrHttpsServerPortProduction, () => {
            console.info(`Server listening on port ${ssrHttpsServerPortProduction} - production`);
        });

    http.createServer((request: IncomingMessage, response: ServerResponse) => {
        response.writeHead(301, {Location: 'https://' + hostingDomainName + request.url});

        response.end();
    }).listen(ssrHttpServerPortProduction, () => {
        console.info(`Server (redirect) listening on port ${ssrHttpServerPortProduction} - production`);
    });
} else {
    app.listen(ssrServerPort, () => {
        console.info(`Server listening on port ${ssrServerPort} - ${String(process.env.NODE_ENV || 'development')}`);
    });
}

// api
addApiIntoApplication(app);

// *.html
app.get('*', async (request: $Request, response: $Response) => {
    const htmlTemplate = getIndexHtmlTemplate();
    const initialData = await getInitialData(request, response);
    // staticContext.is404 will rewrite by page404
    const staticContext: RouterStaticContextType = {is404: false};
    const {openGraphData} = initialData;
    const openGraphMetaString = openGraphData ? getOpenGraphMetaString(openGraphData) : '';
    const {url} = request;
    const seoMetaString = getSeoMetaString(url);

    const reactResult = ReactDOMServer.renderToString(
        <StaticRouter context={staticContext} location={url}>
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
            <StaticRouter context={staticContext} location={url}>
                <ClientApp initialData={initialData404}/>
                <script
                    className={initialScriptClassName}
                    dangerouslySetInnerHTML={{__html: `window.initialData = ${JSON.stringify(initialData404)}`}}
                />
            </StaticRouter>
        );

        const htmlResult404 = htmlTemplate
            .replace(stringForReplaceSeoMeta, seoMetaString)
            .replace(stringForReplaceTitle, initialData.title)
            .replace(stringForReplaceMeta, initialData.meta)
            .replace(stringForReplaceOpenGraphMeta, openGraphMetaString)
            .replace(stringForReplaceContent, reactResult404);

        response.send(htmlResult404);
        return;
    }

    if (initialData.is404) {
        response.status(404);
    }

    const htmlResult = htmlTemplate
        .replace(stringForReplaceSeoMeta, seoMetaString)
        .replace(stringForReplaceTitle, initialData.title)
        .replace(stringForReplaceMeta, initialData.meta)
        .replace(stringForReplaceOpenGraphMeta, openGraphMetaString)
        .replace(stringForReplaceContent, reactResult);

    response.send(htmlResult);
});

handleDataBaseChange()
    .then((): mixed => console.log('---> handleDataBaseChange: done!'))
    .catch((error: Error) => {
        console.log('---> handleDataBaseChange: error while execution!');
        console.log(error.message);
    });
