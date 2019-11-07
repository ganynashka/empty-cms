// @flow

import {type $Request} from 'express';

import type {MongoUserRoleType} from '../db/type';

export type SessionType = {
    +login?: string,
    +role?: MongoUserRoleType,
};

export function getSession(request: $Request): SessionType {
    // $FlowFixMe
    return request.session;
}
