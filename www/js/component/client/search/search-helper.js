// @flow

import type {MongoDocumentShortDataType} from '../../../../../server/src/database/database-type';
import {rootDocumentSlug} from '../../../../../server/src/api/part/document-api-const';
import {footerLinkMap} from '../footer/footer-const';

const excludeSLugList = [
    rootDocumentSlug,
    footerLinkMap.holders.slug,
    footerLinkMap.contacts.slug,
    footerLinkMap.policy.slug,
];

export function filterResultCallBack(mongoDocument: MongoDocumentShortDataType): boolean {
    return !excludeSLugList.includes(mongoDocument.slug);
}

export function sortSearchResultList(
    documentList: Array<MongoDocumentShortDataType>,
    searchText: string
): Array<MongoDocumentShortDataType> {
    // eslint-disable-next-line complexity
    return documentList.sort((documentA: MongoDocumentShortDataType, documentB: MongoDocumentShortDataType): number => {
        const headerA = documentA.header.toLocaleLowerCase();
        const headerB = documentB.header.toLocaleLowerCase();
        const indexOfA = headerA.indexOf(searchText);
        const indexOfB = headerB.indexOf(searchText);
        const defaultIndexOf = 1000;

        if (indexOfA === indexOfB) {
            return headerA.localeCompare(headerB);
        }

        if (indexOfA >= 0 && indexOfB >= 0) {
            return indexOfA - indexOfB;
        }

        if (indexOfA >= 0) {
            return indexOfA - defaultIndexOf;
        }

        if (indexOfB >= 0) {
            return defaultIndexOf - indexOfB;
        }

        return 0;
    });
}
