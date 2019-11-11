// @flow

import {type $Request} from 'express';

import type {MongoUserRoleType} from '../db/type';
import {mongoUserRoleMap} from '../db/type';

export type SessionType = {
    +login?: string,
    +role?: MongoUserRoleType,
};

export function getSession(request: {...$Request, session?: SessionType}): SessionType {
    const {session} = request;

    return session || {};
}

export function isAdmin(request: $Request): boolean {
    return getSession(request).role === mongoUserRoleMap.admin;
}
