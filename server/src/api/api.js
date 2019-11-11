// @flow

import {type $Application} from 'express';

import {addUserApi} from './user-api';
import {addDocumentApi} from './document-api';
import {addDefendApi} from './defend-api';
import {addFileApi} from './file-api';

export function addApiIntoApplication(app: $Application) {
    addDefendApi(app);
    addUserApi(app);
    addDocumentApi(app);
    addFileApi(app);
}
