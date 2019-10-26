// @flow

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';

type PassedPropsType = {|
    +load: () => Promise<Node | Array<Node>>,
|};

type PropsType = PassedPropsType;

type StateType = {|
    +component: Node | Array<Node>,
|};

export class LoadComponent extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        const view = this;

        view.state = {
            component: null,
        };
    }

    async componentDidMount() {
        const view = this;

        await view.load();
    }

    async load() {
        const view = this;
        const {props} = view;

        const loadComponentResult = await props.load();

        if (loadComponentResult instanceof Error) {
            console.error('can not load component');
            view.setState({component: <span>Error to load component</span>});
            return;
        }

        view.setState({component: loadComponentResult});
    }

    render(): Node | Array<Node> {
        const view = this;
        const {state} = view;

        return state.component;
    }
}
