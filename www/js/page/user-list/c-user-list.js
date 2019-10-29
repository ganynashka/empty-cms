// @flow

import React, {Component, type Node} from 'react';

import type {MongoUserType} from '../../../../server/src/db/type';

import {getUserList} from './user-list-api';

type StateType = {
    +list: Array<MongoUserType>,
};
type PropsType = {};

export class UserList extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            list: [],
        };
    }

    async componentDidMount() {
        await this.fetchAllUsers();
    }

    async fetchAllUsers() {
        const list = await getUserList();

        this.setState({list});
    }

    render(): Node {
        const {state, props} = this;

        return <div>{JSON.stringify(state.list)}</div>;
    }
}
