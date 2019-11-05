// @flow

import {type $Application} from 'express';

import {addUserApi} from './user';
import {addDocumentApi} from './document';

export function addApiIntoApplication(app: $Application) {
    addUserApi(app);
    addDocumentApi(app);
}
