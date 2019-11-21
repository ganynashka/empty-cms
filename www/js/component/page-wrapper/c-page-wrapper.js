// @flow

import type {Node} from 'react';
import React, {Component} from 'react';

import pageWrapperStyle from './page-wrapper.style.scss';

type PropsType = {
    +children: Node,
};

type StateType = null;

// eslint-disable-next-line react/prefer-stateless-function
export class PageWrapper extends Component<PropsType, StateType> {
    render(): Node {
        const {props} = this;

        return <main className={pageWrapperStyle.page_wrapper}>{props.children}</main>;
    }
}
