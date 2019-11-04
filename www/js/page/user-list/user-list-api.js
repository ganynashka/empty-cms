// @flow

/* global fetch */

import type {MongoUserType} from '../../../../server/src/db/type';

export async function getUserList(): Promise<Array<MongoUserType>> {
    const rawFetchedData = await fetch('/api/get-user-list');
    const rawList: string = await rawFetchedData.text();

    return JSON.parse('[' + rawList.replace(/,$/, '') + ']');
}
