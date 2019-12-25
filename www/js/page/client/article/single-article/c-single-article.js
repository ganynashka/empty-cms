// @flow

import React, {Component, type Node} from 'react';

import {Markdown} from '../../../../component/layout/markdown/c-markdown';
import type {InitialDataType} from '../../../../provider/intial-data/intial-data-type';

type PropsType = {|
    +initialContextData: InitialDataType,
|};

type StateType = {};

export class SingleArticle extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {};
    }

    render(): Node {
        return <h1>SingleArticle</h1>;
    }
}
