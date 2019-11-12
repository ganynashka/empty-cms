// @flow

/* global process */

/* eslint no-process-env: 0, id-match: 0, optimize-regex/optimize-regex: 0, react/no-danger: 0 */

// import type {IncomingMessage, ServerResponse} from 'http';
// import https from 'https';
import path from 'path';

import React from 'react';
import compression from 'compression';
import cors from 'cors';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import ReactDOMServer from 'react-dom/server';
import {StaticRouter} from 'react-router-dom';
import express, {type $Application, type $Request, type $Response} from 'express';
import session from 'express-session';

import {InnerApp} from '../../www/js/component/app/c-inner-app';
import {pathToDist, pathToStaticFileFolder, ssrServerPort} from '../../webpack/config';
import {sessionKey} from '../key';

import {getIndexHtmlTemplate} from './static-files';
import type {RouterStaticContextType} from './c-initial-data-context';
import {defaultInitialData, type InitialDataType} from './c-initial-data-context';
import {staticFilesList, stringForReplace} from './config';
import {addApiIntoApplication} from './api/api';
import {fileApiConst} from './api/file-const';

const {pathToUploadFiles} = fileApiConst;
const PORT: number = ssrServerPort;
const CWD = process.cwd();

const app: $Application = express();

// const app = express.createServer(sslCredentials);

app.use(cors());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(fileUpload({createParentPath: true}));
app.disable('x-powered-by');

// WARNING: I don't know why needed 'app.set('trust proxy', 1)', just copy-paste from https://www.npmjs.com/package/express-session
app.set('trust proxy', 1); // trust first proxy

app.use(
    session({
        name: 'session-id',
        secret: sessionKey,
        resave: false,
        saveUninitialized: true,
    })
);

// root's static files
staticFilesList.forEach((pathToFile: string) => {
    app.get(pathToFile, (request: $Request, response: $Response) => {
        response.sendFile(path.join(CWD, pathToDist + pathToFile));
    });
});

// usual static files
app.get(pathToStaticFileFolder + '/*', (request: $Request, response: $Response) => {
    console.log(pathToStaticFileFolder + '/*');
    console.log(request.url);
    response.sendFile(path.join(CWD, pathToDist, request.params['0']));
});

// upload files
app.get(pathToUploadFiles + '/*', (request: $Request, response: $Response) => {
    console.log(pathToUploadFiles + '/*');
    console.log(request.url);
    response.sendFile(path.join(CWD, pathToUploadFiles, request.params['0']));
});

// service worker
app.get('/sw.js', (request: $Request, response: $Response) => {
    console.log(pathToStaticFileFolder + '/*');
    console.log(request.url);
    response.sendFile(path.join(CWD, pathToDist, 'asset/sw.js'));
});

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
