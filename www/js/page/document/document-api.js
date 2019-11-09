// @flow

/* global fetch */

import type {MongoDocumentType} from '../../../../server/src/db/type';
import {documentApiRouteMap} from '../../../../server/src/api/route-map';
import type {SortDirectionType} from '../../component/layout/table/enhanced-table/type';
import {getLisParametersToUrl, getSearchExactParametersToUrl} from '../../lib/url';
import type {MainServerApiResponseType} from '../../type/response';
import {typeConverter} from '../../lib/type';

export async function getDocumentList(
    pageIndex: number,
    rowsPerPage: number,
    orderBy: string,
    order: SortDirectionType
): Promise<Array<MongoDocumentType>> {
    const url = getLisParametersToUrl(documentApiRouteMap.getDocumentList, pageIndex, rowsPerPage, orderBy, order);
    const rawFetchedData = await fetch(url);
    const rawList: string = await rawFetchedData.text();

    return JSON.parse('[' + rawList.replace(/,$/, '') + ']');
}

export async function getDocumentListSize(): Promise<number> {
    const rawFetchedData = await fetch(documentApiRouteMap.getDocumentListSize);
    const rawSize: string = await rawFetchedData.text();

    return parseInt(rawSize, 10);
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

export async function documentSearchExact(key: string, value: string): Promise<MainServerApiResponseType> {
    const url = getSearchExactParametersToUrl(documentApiRouteMap.documentSearchExact, key, value);
    const rawFetchedData = await fetch(url);

    return rawFetchedData.json();
}

export async function getDocumentParentList(slug: string): Promise<Array<MongoDocumentType>> {
    const url = `${documentApiRouteMap.getParentList}?slug=${slug}`;
    const rawFetchedData = await fetch(url);

    const rawList: string = await rawFetchedData.text();

    return JSON.parse('[' + rawList.replace(/,$/, '') + ']');
}

export async function getDocumentOrphanList(): Promise<mixed> {
    const url = documentApiRouteMap.getOrphanList;
    const rawFetchedData = await fetch(url);

    const rawList: string = await rawFetchedData.text();

    return '[' + rawList.replace(/,$/, '') + ']';
    // return JSON.parse('[' + rawList.replace(/,$/, '') + ']');
}
