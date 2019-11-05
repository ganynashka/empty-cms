// @flow

import React, {Component, type Node} from 'react';
import {Link} from 'react-router-dom';

import type {MongoDocumentType} from '../../../../server/src/db/type';
import {EnhancedTable} from '../../component/layout/table/enhanced-table/c-enhanced-table';
import {timeToHumanString} from '../../../../server/src/util/time';
import {routeItemMap} from '../../component/app/routes';
import type {
    EnhancedTableBodyCellType,
    EnhancedTableGetDataResultType,
    SortDirectionType,
} from '../../component/layout/table/enhanced-table/type';

import {getDocumentList, getDocumentListSize} from './document-api';

type PropsType = {};
type StateType = {};

async function enhancedTableGetDocumentList(
    pageIndex: number,
    rowsPerPage: number,
    orderBy: string,
    order: SortDirectionType
): Promise<EnhancedTableGetDataResultType> {
    const list = await getDocumentList(pageIndex, rowsPerPage, orderBy, order);
    const fullListSize = await getDocumentListSize();
    const staticPartPath = String(routeItemMap.documentEdit.staticPartPath);

    return {
        list: list.map((documentData: MongoDocumentType): EnhancedTableBodyCellType => {
            const {slug, type, title, updatedDate, createdDate, rating} = documentData;

            return {
                slug: <Link to={staticPartPath + '/' + slug}>{slug}</Link>,
                type,
                title,
                rating,
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
        {id: 'slug', align: 'left', label: 'Slug', hasSort: true},
        {id: 'type', align: 'left', label: 'Type', hasSort: true},
        {id: 'title', align: 'left', label: 'Title', hasSort: true},
        {id: 'rating', align: 'left', label: 'Rating', hasSort: true},
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
        return <EnhancedTable getData={enhancedTableGetDocumentList} header={enhancedTableHeader}/>;
    }
}
