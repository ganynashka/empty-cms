// @flow

import {type $Application} from 'express';

import {addUserApi} from './user-api';
import {addDocumentApi} from './document-api';

export function addApiIntoApplication(app: $Application) {
    addUserApi(app);
    addDocumentApi(app);
}
