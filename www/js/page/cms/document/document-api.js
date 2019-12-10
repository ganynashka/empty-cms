// @flow

/* global fetch */

import type {MongoDocumentType} from '../../../../../server/src/database/database-type';
import {documentApiRouteMap} from '../../../../../server/src/api/api-route-map';
import type {SortDirectionType} from '../../../component/layout/table/enhanced-table/enhanced-table-type';
import {getLisParametersToUrl, getSearchExactParametersToUrl} from '../../../lib/url';
import type {MainServerApiResponseType} from '../../../type/response';
import {typeConverter} from '../../../lib/type';
import {promiseCatch} from '../../../lib/promise';
import {fetchNumber} from '../../../lib/fetch-x';

export function getDocumentList(
    pageIndex: number,
    rowsPerPage: number,
    orderBy: string,
    order: SortDirectionType
): Promise<Array<MongoDocumentType> | Error> {
    const url = getLisParametersToUrl(documentApiRouteMap.getDocumentList, pageIndex, rowsPerPage, orderBy, order);

    return fetch(url)
        .then((response: Response): Promise<Array<MongoDocumentType> | Error> => response.json())
        .catch(promiseCatch);
}

export function getDocumentListSize(): Promise<number | Error> {
    return fetchNumber(documentApiRouteMap.getDocumentListSize);
}

export async function createDocument(data: MongoDocumentType): Promise<MainServerApiResponseType> {
    const response = await fetch(documentApiRouteMap.createDocument, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const responseJson = await response.json();

    return typeConverter<MainServerApiResponseType>(responseJson);
}

export async function updateDocument(data: MongoDocumentType): Promise<MainServerApiResponseType> {
    const response = await fetch(documentApiRouteMap.updateDocument, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const responseJson = await response.json();

    return typeConverter<MainServerApiResponseType>(responseJson);
}

type DocumentSearchExactResultType = MainServerApiResponseType | MongoDocumentType | Error;

export function documentSearchExact(key: string, value: string): Promise<DocumentSearchExactResultType> {
    const url = getSearchExactParametersToUrl(documentApiRouteMap.documentSearchExact, key, value);

    return fetch(url)
        .then((response: Response): Promise<DocumentSearchExactResultType> => response.json())
        .catch(promiseCatch);
}

export function getDocumentParentList(slug: string): Promise<Array<MongoDocumentType> | Error> {
    const url = `${documentApiRouteMap.getParentList}?slug=${slug}`;

    return fetch(url)
        .then((response: Response): Promise<Array<MongoDocumentType> | Error> => response.json())
        .catch(promiseCatch);
}

export async function getDocumentOrphanList(): Promise<Array<MongoDocumentType>> {
    const url = documentApiRouteMap.getOrphanList;
    const rawFetchedData = await fetch(url);

    return rawFetchedData.json();
}
