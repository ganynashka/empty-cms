// @flow

/* global fetch */

import type {MongoDocumentShortDataType, MongoDocumentType} from '../../../../../server/src/database/database-type';
import {documentApiRouteMap} from '../../../../../server/src/api/api-route-map';
import type {SortDirectionType} from '../../../component/layout/table/enhanced-table/enhanced-table-type';
import {getLisParametersToUrl, getSearchExactParametersToUrl} from '../../../lib/url';
import type {MainServerApiResponseType} from '../../../type/response';
import {typeConverter} from '../../../lib/type';
import {promiseCatch} from '../../../lib/promise';
import {fetchNumber} from '../../../lib/fetch-x';
import type {FieldAutocompleteDataType} from '../../../component/layout/form-generator/form-generator-type';

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

export function createDocument(data: MongoDocumentType): Promise<MainServerApiResponseType | Error> {
    return fetch(documentApiRouteMap.createDocument, {
        method: 'POST',
        headers: {
            // eslint-disable-next-line sonarjs/no-duplicate-string
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((response: Response): Promise<MainServerApiResponseType | Error> => response.json())
        .catch(promiseCatch);
}

export function updateDocument(data: MongoDocumentType): Promise<MainServerApiResponseType | Error> {
    return fetch(documentApiRouteMap.updateDocument, {
        method: 'POST',
        headers: {
            // eslint-disable-next-line sonarjs/no-duplicate-string
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((response: Response): Promise<MainServerApiResponseType | Error> => response.json())
        .catch(promiseCatch);
}

type DocumentSearchExactResultType = MainServerApiResponseType | MongoDocumentType | Error;

export function documentSearchExact(key: string, value: string): Promise<DocumentSearchExactResultType> {
    const url = getSearchExactParametersToUrl(documentApiRouteMap.documentSearchExact, key, value);

    return fetch(url)
        .then((response: Response): Promise<DocumentSearchExactResultType> => response.json())
        .catch(promiseCatch);
}

export function getDocumentParentList(id: string): Promise<Array<MongoDocumentType> | Error> {
    const url = `${documentApiRouteMap.getParentList}?id=${id}`;

    return fetch(url)
        .then((response: Response): Promise<Array<MongoDocumentType> | Error> => response.json())
        .catch(promiseCatch);
}

export function getDocumentOrphanList(): Promise<Array<MongoDocumentType> | Error> {
    return fetch(documentApiRouteMap.getOrphanList)
        .then((response: Response): Promise<Array<MongoDocumentType> | Error> => response.json())
        .catch(promiseCatch);
}

export function removeDocumentById(id: string): Promise<MainServerApiResponseType | Error> {
    return fetch(documentApiRouteMap.removeDocumentById, {
        method: 'DELETE',
        headers: {
            // eslint-disable-next-line sonarjs/no-duplicate-string
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({id}),
    })
        .then((response: Response): Promise<MainServerApiResponseType | Error> => response.json())
        .catch(promiseCatch);
}

export function getDocumentShortDataList(): Promise<Array<MongoDocumentShortDataType> | Error> {
    return fetch(documentApiRouteMap.getDocumentShortDataList)
        .then((response: Response): Promise<Array<MongoDocumentShortDataType> | Error> => response.json())
        .catch(promiseCatch);
}

export function getDocumentAutocompleteDataList(): Promise<Array<FieldAutocompleteDataType> | Error> {
    return getDocumentShortDataList()
        .then((documentShortDataList: Array<MongoDocumentShortDataType> | Error): | Array<FieldAutocompleteDataType>
            | Error => {
            if (!Array.isArray(documentShortDataList)) {
                return new Error('can not get autocomplete list data');
            }

            return documentShortDataList.map(
                (documentShortDataInList: MongoDocumentShortDataType): FieldAutocompleteDataType => {
                    return {
                        header: documentShortDataInList.header,
                        value: documentShortDataInList.id,
                    };
                }
            );
        })
        .catch(promiseCatch);
}
