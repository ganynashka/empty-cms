// @flow

import type {MongoDocumentType} from '../../../../../server/src/database/database-type';
import {fetchX} from '../../../lib/fetch-x';
import {documentApiRouteMap} from '../../../../../server/src/api/api-route-map';
import {isString} from '../../../lib/is';

import type {SearchParametersType} from './search-type';

// eslint-disable-next-line complexity
export function searchDocument(searchParameters: SearchParametersType): Promise<Array<MongoDocumentType> | Error> {
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

    const url = documentApiRouteMap.documentSearch + '?' + parametersList.join('&');

    return fetchX<Array<MongoDocumentType> | Error>(url);
}
