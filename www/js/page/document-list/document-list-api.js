// @flow

/* global fetch */

import type {MongoDocumentType} from '../../../../server/src/db/type';

export async function getDocumentList(): Promise<Array<MongoDocumentType>> {
    const rawList: string = await (await fetch('/api/get-document-list')).text();

    return JSON.parse('[' + rawList.replace(/,$/, '') + ']');
}
