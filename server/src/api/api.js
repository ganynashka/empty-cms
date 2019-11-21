// @flow

import {type $Application} from 'express';

import {addUserApi} from './part/user-api';
import {addDocumentApi} from './part/document-api';
import {addDefendApi} from './part/defend-api';
import {addFileApi} from './part/file-api';

export function addApiIntoApplication(app: $Application) {
    addDefendApi(app);
    addUserApi(app);
    addDocumentApi(app);
    addFileApi(app);
}
