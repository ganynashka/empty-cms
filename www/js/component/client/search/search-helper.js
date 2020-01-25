// @flow

import type {MongoDocumentType} from '../../../../../server/src/database/database-type';
import {rootDocumentSlug} from '../../../../../server/src/api/part/document-api-const';
import {footerLinkMap} from '../footer/footer-const';

const excludeSLugList = [
    rootDocumentSlug,
    footerLinkMap.holders.slug,
    footerLinkMap.contacts.slug,
    footerLinkMap.policy.slug,
];

export function filterResultCallBack(mongoDocument: MongoDocumentType): boolean {
    return !excludeSLugList.includes(mongoDocument.slug);
}

export function sortSearchResultList(
    documentList: Array<MongoDocumentType>,
    searchText: string
): Array<MongoDocumentType> {
    return documentList.sort((documentA: MongoDocumentType, documentB: MongoDocumentType): number => {
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
