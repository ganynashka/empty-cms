// @flow

/* global fetch */

import type {MongoDocumentType} from '../../../../server/src/db/type';
import {promiseCatch} from '../../lib/promise';

export async function getDocumentList(): Promise<Array<MongoDocumentType>> {
    const rawList: string = await (await fetch('/api/get-document-list')).text();

    return JSON.parse('[' + rawList.replace(/,$/, '') + ']');
}

export function createDocument(data: MongoDocumentType): Promise<null | Error> {
    return fetch('/api/create-document', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((): null => null)
        .catch(promiseCatch);
}
