// @flow

/* global fetch */

import type {MongoUserType} from '../../../../server/src/db/type';

export async function getUserList(): Promise<Array<MongoUserType>> {
    const rawUserList: string = await (await fetch('/api/get-user-list')).text();

    return JSON.parse('[' + rawUserList.replace(/,$/, '') + ']');
}
