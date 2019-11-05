// @flow

import React, {Component, type Node} from 'react';

import type {MongoDocumentType} from '../../../../server/src/db/type';
import {EnhancedTable} from '../../component/layout/table/enhanced-table/c-enhanced-table';
import {timeToHumanString} from '../../../../server/src/util/time';
import type {SortDirectionType} from '../../component/layout/table/enhanced-table/helper';
import type {
    EnhancedTableGetDataResultType,
    EnhancedTableBodyCellType,
} from '../../component/layout/table/enhanced-table/type';

import {getDocumentList, getDocumentListSize} from './document-list-api';

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

    return {
        list: list.map((documentData: MongoDocumentType): EnhancedTableBodyCellType => {
            const {slug, createdDate} = documentData;

            return {
                slug,
                createdDate: timeToHumanString(createdDate),
            };
        }),
        allElementsNumber: fullListSize,
    };
}

const enhancedTableHeader = {
    header: 'Document list',
    rowList: [
        {id: 'slug', align: 'left', label: 'Id', hasSort: true},
        {id: 'createdDate', align: 'left', label: 'Rating', hasSort: true},
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
