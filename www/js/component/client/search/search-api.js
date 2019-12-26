// @flow

import type {MongoDocumentType} from '../../../../../server/src/database/database-type';
import {fetchX} from '../../../lib/fetch-x';
import {documentApiRouteMap} from '../../../../../server/src/api/api-route-map';
import {isString} from '../../../lib/is';

import type {SearchParametersType} from './search-type';

export function searchDocument(searchParameters: SearchParametersType): Promise<Array<MongoDocumentType> | Error> {
    const parametersList: Array<string> = [];
    const {title, content} = searchParameters;

    if (isString(title) && title.trim()) {
        parametersList.push('title=' + encodeURIComponent(title.trim()));
    }

    if (isString(content) && content.trim()) {
        parametersList.push('content=' + encodeURIComponent(content.trim()));
    }

    const url = documentApiRouteMap.documentSearch + '?' + parametersList.join('&');

    return fetchX<Array<MongoDocumentType> | Error>(url);
}
