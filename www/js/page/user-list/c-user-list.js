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

    async fetchAllUsers() {
        const userList = await getUserList();

        this.setState({userList});
    }

    componentDidMount() {
        (async () => {
            await this.fetchAllUsers();
        })();
    }

    render(): Node {
        const {state, props} = this;

        return <div>{JSON.stringify(state)}</div>;
    }
}
