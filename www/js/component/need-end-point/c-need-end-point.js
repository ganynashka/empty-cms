// @flow

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';

import {fetchX} from '../../lib/fetch-x';
import {isError} from '../../lib/is';

export type ApiDataType = {|
    +status: string,
|};

type PassedPropsType = {|
    +apiData: null | ApiDataType,
|};

type PropsType = {
    ...PassedPropsType,
    // ...$Exact<ContextRouterType>
    // +children: Node
};

type StateType = {|
    +state: number,
    +apiData: null | ApiDataType,
|};

export class NeedEndPoint extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        const view = this;

        view.state = {
            state: 0,
            apiData: props.apiData,
        };
    }

    async componentDidMount() {
        const view = this;

        if (view.state.apiData) {
            return;
        }

        const apiData = await fetchX<ApiDataType>('/api/some-api-url');

        if (isError(apiData)) {
            return;
        }

        view.setState({apiData});
    }

    render(): Node {
        const view = this;
        const {state} = view;

        if (state.apiData === null) {
            return <h1>No apiData!</h1>;
        }

        return (
            <div>
                <h1>Need End Point Component</h1>
                <pre>{JSON.stringify(state.apiData || {}, null, 4)}</pre>
            </div>
        );
    }
}
