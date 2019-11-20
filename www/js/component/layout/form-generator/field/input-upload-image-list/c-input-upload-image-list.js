// @flow

import React, {Component, type Node} from 'react';
import classNames from 'classnames';

import type {InputComponentPropsType, InputValueType} from '../../type';

type PropsType = InputComponentPropsType;

type StateType = {
    // fileList: Array<File>,
    // defaultValueList: Array<InputValueType>,
};

export class InputUploadImageList extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            // fileList: [],
            // defaultValueList: [],
        };
    }

    render(): Node {
        const {props, state} = this;

        if (!Array.isArray(props.defaultValue)) {
            console.error('InputUploadImageList: Array support only');
            return null;
        }

        return 'InputUploadImageList';
    }
}
