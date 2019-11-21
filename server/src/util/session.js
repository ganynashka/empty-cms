// @flow

import {type $Request} from 'express';

import type {MongoUserRoleType} from '../database/database-type';
import {mongoUserRoleMap} from '../database/database-const';

export type SessionType = {
    +login?: string,
    +role?: MongoUserRoleType,
    +destroy: (callBack?: mixed) => mixed,
};

export function getSession(request: $Request): SessionType {
    // $FlowFixMe
    const {session} = request;

    return session || {};
}

export function isAdmin(request: $Request): boolean {
    return getSession(request).role === mongoUserRoleMap.admin;
}
