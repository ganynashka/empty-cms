// @flow

/* global fetch */

import type {MongoDocumentType} from '../../../../server/src/db/type';
import type {SortDirectionType} from '../../component/layout/table/enhanced-table/helper';
import {promiseCatch} from '../../lib/promise';
import {getLisParametersToUrl} from '../../lib/url';

export async function getDocumentList(
    pageIndex: number,
    rowsPerPage: number,
    orderBy: string,
    order: SortDirectionType
): Promise<Array<MongoDocumentType>> {
    const url = getLisParametersToUrl('/api/get-document-list', pageIndex, rowsPerPage, orderBy, order);
    const rawFetchedData = await fetch(url);
    const rawList: string = await rawFetchedData.text();

    return JSON.parse('[' + rawList.replace(/,$/, '') + ']');
}

export async function getDocumentListSize(): Promise<number> {
    const rawFetchedData = await fetch('/api/get-document-list-size');
    const rawSize: string = await rawFetchedData.text();

    return parseInt(rawSize, 10);
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
