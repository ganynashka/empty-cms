// @flow

/* global fetch */

import type {MainServerApiResponseType} from '../../../../../type/response';

import {documentApiRouteMap} from '../../../../../../../server/src/api/api-route-map';
import {typeConverter} from '../../../../../lib/type';

import type {JsonToMongoDocumentType} from './input-upload-json-as-document-type';

export async function uploadJsonAsDocument(
    documentAsJson: JsonToMongoDocumentType
): Promise<Error | MainServerApiResponseType> {
    const response = await fetch(documentApiRouteMap.uploadDocumentAsJson, {
        method: 'POST',
        headers: {
            // eslint-disable-next-line sonarjs/no-duplicate-string
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentAsJson),
    });

    const responseJson = await response.json();

    return typeConverter<Error | MainServerApiResponseType>(responseJson);
}
