// @flow

import React, {Component, type Node} from 'react';

import type {MongoUserType} from '../../../../../server/src/database/database-type';
import {EnhancedTable} from '../../../component/layout/table/enhanced-table/c-enhanced-table';
import {timeToHumanString} from '../../../../../server/src/util/time';
import type {
    EnhancedTableBodyCellType,
    EnhancedTableGetDataResultType,
    SortDirectionType,
} from '../../../component/layout/table/enhanced-table/enhanced-table-type';
import {isError} from '../../../lib/is';
import type {UserContextType} from '../../../provider/user/user-context-type';

import {getUserList, getUserListSize} from './user-list-api';
// import {getIsAdmin} from '../../../provider/user/user-context-helper';

type PropsType = {
    +userContextData: UserContextType,
};

type StateType = {};

async function enhancedTableGetUserList(
    pageIndex: number,
    rowsPerPage: number,
    orderBy: string,
    order: SortDirectionType,
    refreshTable: () => Promise<mixed>
): Promise<EnhancedTableGetDataResultType> {
    const list = await getUserList(pageIndex, rowsPerPage, orderBy, order);
    const fullListSize = await getUserListSize();

    if (isError(list) || isError(fullListSize)) {
        console.error('list or fullListSize is error');
        return {
            list: [],
            allElementsNumber: 0,
        };
    }

    return {
        list: list.map((userData: MongoUserType): EnhancedTableBodyCellType => {
            const {id, role, login, registerDate, rating} = userData;

            return {
                id,
                role,
                login,
                rating,
                registerDate: timeToHumanString(registerDate),
            };
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
        {id: 'registerDate', align: 'left', label: 'Register Date (UTC 0)', hasSort: true},
        {id: 'rating', align: 'left', label: 'Rating', hasSort: true},
    ],
};

export class UserList extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);
        this.state = {};
    }

    render(): Node {
        // const {props} = this;
        // const {userContextData} = props;

        /*
        if (!getIsAdmin(userContextData)) {
            return null;
        }
*/

        return <EnhancedTable getData={enhancedTableGetUserList} header={enhancedTableHeader}/>;
    }
}
