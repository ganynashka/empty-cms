// @flow

import {mongoUserRoleMap} from '../../../../server/src/database/database-const';

import type {UserContextConsumerType} from './user-context-type';

export function isAdmin(userContextData: UserContextConsumerType): boolean {
    return userContextData.user.role === mongoUserRoleMap.admin;
}
