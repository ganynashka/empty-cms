// @flow

import React, {Component, type Node} from 'react';

import type {MongoUserType} from '../../../../server/src/db/type';

import {EnhancedTable} from '../../component/layout/table/enhanced-table/c-enhanced-table';
import type {SortDirectionType} from '../../component/layout/table/enhanced-table/helper';
import type {EnhancedTableGetDataResultType} from '../../component/layout/table/enhanced-table/type';

import {getUserList} from './user-list-api';

type StateType = {
    // +list: Array<MongoUserType>,
};
type PropsType = {};

export class UserList extends Component<PropsType, StateType> {
    // constructor(props: PropsType) {
    //     super(props);

    // this.state = {
    //     list: [],
    // };
    // }

    // async componentDidMount() {
    //     await this.fetchAllUsers();
    // }

    // async fetchAllUsers() {
    //
    //     this.setState({list});
    // }

    render(): Node {
        // const {state, props} = this;

        return (
            <div>
                <EnhancedTable
                    getData={async (
                        pageIndex: number,
                        rowsPerPage: number,
                        orderBy: string,
                        order: SortDirectionType
                    ): Promise<EnhancedTableGetDataResultType> => {
                        const rawList = await getUserList();
                        const list = await rawList;

                        console.log(pageIndex, rowsPerPage, orderBy, order);

                        return {
                            list,
                            allElementsNumber: 10,
                        };
                    }}
                    header={{
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
                    }}
                    order="asc"
                    orderBy="login"
                    pageIndex={0}
                    rowsPerPage={3}
                />
            </div>
        );
    }
}
