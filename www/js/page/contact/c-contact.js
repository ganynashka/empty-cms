// @flow

import type {Node} from 'react';
import React, {Component} from 'react';

type PropsType = {};
type StateType = null;

// eslint-disable-next-line react/prefer-stateless-function
export class Contact extends Component<PropsType, StateType> {
    render(): Node {
        return <h1>Contact: get in touch!</h1>;
    }
}
