// @flow

import {type $Application} from 'express';
import cors from 'cors';
import compression from 'compression';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import session from 'express-session';
import expressDevice from 'express-device';
import connectMongo from 'connect-mongo';

import {passwordKey, sessionKey} from '../../key';
import {dataBaseConst} from '../database/database-const';

import {addUserApi} from './part/user-api';
import {addDocumentApi} from './part/document-api';
import {addDefendApi} from './part/defend-api';
import {addFileApi} from './part/file-api';
import {addStaticApi} from './part/static-api';
import {initialDataApi} from './part/initial-data-api';

const MongoStore = connectMongo(session);

export function addApiIntoApplication(app: $Application) {
    app.use(cors());
    app.use(compression());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(fileUpload({createParentPath: true}));
    app.use(expressDevice.capture());
    app.disable('x-powered-by');

    // WARNING: I don't know why needed 'app.set('trust proxy', 1)', just copy-paste from https://www.npmjs.com/package/express-session
    app.set('trust proxy', 1); // trust first proxy

    app.use(
        session({
            name: 'session-id',
            secret: sessionKey,
            resave: false,
            saveUninitialized: true,
            store: new MongoStore({
                url: dataBaseConst.url,
                secret: passwordKey,
            }),
        })
    );

    addStaticApi(app);
    addDefendApi(app);
    initialDataApi(app);
    addUserApi(app);
    addDocumentApi(app);
    addFileApi(app);
}
