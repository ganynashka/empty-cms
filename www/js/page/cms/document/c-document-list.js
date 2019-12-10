// @flow

import React, {Component, type Node} from 'react';
import {Link} from 'react-router-dom';

import type {MongoDocumentType} from '../../../../../server/src/database/database-type';
import {EnhancedTable} from '../../../component/layout/table/enhanced-table/c-enhanced-table';
import {timeToHumanString} from '../../../../../server/src/util/time';
import {routePathMap} from '../../../component/app/routes-path-map';
import type {
    EnhancedTableBodyCellType,
    EnhancedTableGetDataResultType,
    SortDirectionType,
} from '../../../component/layout/table/enhanced-table/enhanced-table-type';
import type {UserContextConsumerType} from '../../../provider/user/user-context-type';

import {isError} from '../../../lib/is';

import {getDocumentList, getDocumentListSize} from './document-api';

type PropsType = {
    +userContextData: UserContextConsumerType,
};
type StateType = {};

async function enhancedTableGetDocumentList(
    pageIndex: number,
    rowsPerPage: number,
    orderBy: string,
    order: SortDirectionType
): Promise<EnhancedTableGetDataResultType> {
    const list = await getDocumentList(pageIndex, rowsPerPage, orderBy, order);
    const fullListSize = await getDocumentListSize();
    const staticPartPath = String(routePathMap.documentEdit.staticPartPath);

    if (isError(list) || isError(fullListSize)) {
        console.error('list or fullListSize is error');
        return {
            list: [],
            allElementsNumber: 0,
        };
    }

    return {
        list: list.map((documentData: MongoDocumentType): EnhancedTableBodyCellType => {
            const {slug, type, title, isActive, updatedDate, createdDate, rating} = documentData;

            return {
                slug: <Link to={staticPartPath + '/' + slug}>{slug}</Link>,
                type,
                title,
                rating,
                isActive,
                createdDate: timeToHumanString(createdDate),
                updatedDate: timeToHumanString(updatedDate),
            };
        }),
        allElementsNumber: fullListSize,
    };
}

const enhancedTableHeader = {
    header: 'Document list',
    rowList: [
        {id: 'title', align: 'left', label: 'Title', hasSort: true},
        {id: 'slug', align: 'left', label: 'Slug', hasSort: true},
        {id: 'type', align: 'left', label: 'Type', hasSort: true},
        {id: 'rating', align: 'left', label: 'Rating', hasSort: true},
        {id: 'isActive', align: 'left', label: 'Is active', hasSort: true},
        {id: 'createdDate', align: 'left', label: 'Created Date (UTC 0)', hasSort: true},
        {id: 'updatedDate', align: 'left', label: 'Updated Date (UTC 0)', hasSort: true},
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
