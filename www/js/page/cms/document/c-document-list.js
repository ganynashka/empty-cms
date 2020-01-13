// @flow

import React, {Component, type Node} from 'react';
import {Link} from 'react-router-dom';

import type {MongoDocumentType} from '../../../../../server/src/database/database-type';
import {EnhancedTable} from '../../../component/layout/table/enhanced-table/c-enhanced-table';
import {timeToHumanString} from '../../../../../server/src/util/time';
import type {
    EnhancedTableBodyCellType,
    EnhancedTableGetDataResultType,
    SortDirectionType,
} from '../../../component/layout/table/enhanced-table/enhanced-table-type';
import type {UserContextConsumerType} from '../../../provider/user/user-context-type';
import {isError} from '../../../lib/is';
import {getLinkToEditArticle} from '../../../lib/string';

import {getDocumentList, getDocumentListSize} from './document-api';
import {RemoveDocument} from './c-document-remove-button';

type PropsType = {
    +userContextData: UserContextConsumerType,
};
type StateType = {};

async function enhancedTableGetDocumentList(
    pageIndex: number,
    rowsPerPage: number,
    orderBy: string,
    order: SortDirectionType,
    refreshTable: () => Promise<mixed>
): Promise<EnhancedTableGetDataResultType> {
    const list = await getDocumentList(pageIndex, rowsPerPage, orderBy, order);
    const fullListSize = await getDocumentListSize();

    if (isError(list) || isError(fullListSize)) {
        console.error('list or fullListSize is error');
        return {
            list: [],
            allElementsNumber: 0,
        };
    }

    return {
        list: list.map((documentData: MongoDocumentType): EnhancedTableBodyCellType => {
            const {slug, type, header, isActive, updatedDate, createdDate, rating} = documentData;

            return {
                slug: <Link to={getLinkToEditArticle(slug)}>{slug}</Link>,
                type,
                header,
                rating,
                isActive,
                createdDate: timeToHumanString(createdDate),
                updatedDate: timeToHumanString(updatedDate),
                remove: <RemoveDocument onSuccess={refreshTable} slug={slug}/>,
            };
        }),
        allElementsNumber: fullListSize,
    };
}

const enhancedTableHeader = {
    header: 'Document list',
    rowList: [
        {id: 'header', align: 'left', label: 'Header', hasSort: true},
        {id: 'slug', align: 'left', label: 'Slug', hasSort: true},
        {id: 'type', align: 'left', label: 'Type', hasSort: true},
        {id: 'rating', align: 'left', label: 'Rating', hasSort: true},
        {id: 'isActive', align: 'left', label: 'Is active', hasSort: true},
        {id: 'createdDate', align: 'left', label: 'Created Date (UTC 0)', hasSort: true},
        {id: 'updatedDate', align: 'left', label: 'Updated Date (UTC 0)', hasSort: true},
        {id: 'remove', align: 'right', label: 'Remove', hasSort: false},
    ],
};

export class DocumentList extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);
        this.state = {};
    }

    render(): Node {
        const {props} = this;
        const {userContextData} = props;

        /*
        if (!isAdmin(userContextData)) {
            return null;
        }
*/

        return <EnhancedTable getData={enhancedTableGetDocumentList} header={enhancedTableHeader}/>;
    }
}
