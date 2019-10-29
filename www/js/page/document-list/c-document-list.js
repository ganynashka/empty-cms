// @flow

import React, {Component, type Node} from 'react';

import type {MongoDocumentType} from '../../../../server/src/db/type';

import {getDocumentList} from './document-list-api';

type StateType = {
    +list: Array<MongoDocumentType>,
};
type PropsType = {};

export class DocumentList extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            list: [],
        };
    }

    componentDidMount() {
        (async () => {
            await this.fetchAllDocuments();
        })();
    }

    async fetchAllDocuments() {
        const list = await getDocumentList();

        this.setState({list});
    }

    render(): Node {
        const {state, props} = this;

        return <div>{JSON.stringify(state.list)}</div>;
    }
}
