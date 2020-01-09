// @flow

/* global process */

import fileSystem from 'fs';
import path from 'path';

import {type $Application, type $Request, type $Response} from 'express';
import morgan from 'morgan';

const CWD = process.cwd();

export function addLoggingApi(app: $Application) {
    app.use(
        morgan('combined', {
            stream: fileSystem.createWriteStream(path.join(CWD, 'access.log'), {flags: 'a'}),
        })
    );
}
