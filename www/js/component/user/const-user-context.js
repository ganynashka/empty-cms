// @flow

import type {MongoUserFrontType} from '../../../../server/src/db/type';
import {mongoUserRoleMap} from '../../../../server/src/db/type';

export const defaultUserFrontState: MongoUserFrontType = {
    role: mongoUserRoleMap.user,
    login: '',
    registerDate: 0,
    rating: 0,
};
