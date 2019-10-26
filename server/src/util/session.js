// @flow

import {type $Request} from 'express';

export type SessionType = {
    login?: string,
    views?: {
        [key: string]: number,
    },
};

export function getSession(request: $Request): SessionType {
    // $FlowFixMe
    return request.session;
}
