// @flow

import React, {Component, type Node} from 'react';

import type {MongoUserType} from '../../../../server/src/db/type';
import {EnhancedTable} from '../../component/layout/table/enhanced-table/c-enhanced-table';
import type {SortDirectionType} from '../../component/layout/table/enhanced-table/helper';
import type {
    EnhancedTableGetDataResultType,
    EnhancedTableBodyCellType,
} from '../../component/layout/table/enhanced-table/type';

import {getUserList, getUserListSize} from './user-list-api';

type PropsType = {};
type StateType = {};

async function enhancedTableGetUserList(
    pageIndex: number,
    rowsPerPage: number,
    orderBy: string,
    order: SortDirectionType
): Promise<EnhancedTableGetDataResultType> {
    const list = await getUserList(pageIndex, rowsPerPage, orderBy, order);
    const fullListSize = await getUserListSize();

    return {
        list: list.map((userData: MongoUserType): EnhancedTableBodyCellType => {
            const {id, role, login, password, rating} = userData;

            return {id, role, login, password, rating, edit: 1, remove: 1};
        }),
        allElementsNumber: fullListSize,
    };
}

const enhancedTableHeader = {
    header: 'User list',
    rowList: [
        {id: 'id', align: 'left', label: 'Id', hasSort: true},
        {id: 'role', align: 'left', label: 'Role', hasSort: true},
        {id: 'login', align: 'left', label: 'Login', hasSort: true},
        {id: 'password', align: 'left', label: 'Password', hasSort: false},
        {id: 'rating', align: 'left', label: 'Rating', hasSort: true},

        {id: 'edit', align: 'left', label: 'Edit', hasSort: false},
        {id: 'remove', align: 'right', label: 'Remove', hasSort: false},
    ],
};

export class UserList extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);
        this.state = {};
    }

    render(): Node {
        return <EnhancedTable getData={enhancedTableGetUserList} header={enhancedTableHeader}/>;
    }
}
