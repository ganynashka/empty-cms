// @flow

import React, {Component, type Node} from 'react';

import type {MongoUserType} from '../../../../server/src/db/type';

import {getUserList} from './user-list-api';

type StateType = {
    +userList: Array<MongoUserType>,
};
type PropsType = {};

export class UserList extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            userList: [],
        };
    }

    componentDidMount() {
        (async () => {
            await this.fetchAllUsers();
        })();
    }

    async fetchAllUsers() {
        const userList = await getUserList();

        this.setState({userList});
    }

    render(): Node {
        const {state, props} = this;

        return <div>{JSON.stringify(state.userList)}</div>;
    }
}
