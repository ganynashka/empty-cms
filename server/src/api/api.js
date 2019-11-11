// @flow

import {type $Application} from 'express';

import {addUserApi} from './user-api';
import {addDocumentApi} from './document-api';
import {addDefendApi} from './defend-api';
import {addImageApi} from './image-api';

export function addApiIntoApplication(app: $Application) {
    addDefendApi(app);
    addUserApi(app);
    addDocumentApi(app);
    addImageApi(app);
}
