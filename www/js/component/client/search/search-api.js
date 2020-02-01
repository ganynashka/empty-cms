// @flow

import type {MongoDocumentShortDataType, MongoDocumentType} from '../../../../../server/src/database/database-type';
import {fetchX} from '../../../lib/fetch-x';
import {documentApiRouteMap} from '../../../../../server/src/api/api-route-map';
import {isString} from '../../../lib/is';

import {waitForTime} from '../../../../../server/src/util/time';

import type {SearchParametersType} from './search-type';

// eslint-disable-next-line complexity
function getUrlSearchParameters(searchParameters: SearchParametersType): string {
    const parametersList: Array<string> = [];
    const {header, content, tagList} = searchParameters;

    if (isString(header) && header.trim()) {
        parametersList.push('header=' + encodeURIComponent(header.trim()));
    }

    if (isString(content) && content.trim()) {
        parametersList.push('content=' + encodeURIComponent(content.trim()));
    }

    if (isString(tagList) && tagList.trim()) {
        parametersList.push('tag-list=' + encodeURIComponent(tagList.trim()));
    }

    return parametersList.join('&');
}

export function searchDocument(searchParameters: SearchParametersType): Promise<Array<MongoDocumentType> | Error> {
    const url = documentApiRouteMap.documentSearch + '?' + getUrlSearchParameters(searchParameters); // parametersList.join('&');

    return fetchX<Array<MongoDocumentType> | Error>(url);
}

export async function searchDocumentShortData(
    searchParameters: SearchParametersType
): Promise<Array<MongoDocumentShortDataType> | Error> {
    // await waitForTime(3e3);

    const url = documentApiRouteMap.documentShortDataSearch + '?' + getUrlSearchParameters(searchParameters);

    return fetchX<Array<MongoDocumentShortDataType> | Error>(url);
}
