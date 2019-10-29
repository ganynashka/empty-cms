// @flow

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';

import {isString} from '../../../lib/is';

import buttonListWrapperStyle from './button-list-wrapper.style.scss';

type DirectionType = 'center' | 'column' | 'left' | 'right';

const directionClassNameMap: {+[key: DirectionType]: string} = {
    center: buttonListWrapperStyle.button_list_wrapper__center,
    column: buttonListWrapperStyle.button_list_wrapper__column,
    left: buttonListWrapperStyle.button_list_wrapper__left,
    right: buttonListWrapperStyle.button_list_wrapper__right,
};

type PassedPropsType = {|
    +direction: DirectionType,
    +children: Node,
    +className?: string,
|};

type StateType = null;

export class ButtonListWrapper extends Component<PassedPropsType, StateType> {
    constructor(props: PassedPropsType) {
        super(props);

        const view = this;

        view.state = null;
    }

    getClassName(): string {
        const view = this;
        const {props} = view;
        const {direction, className} = props;

        const defaultClassName = buttonListWrapperStyle.button_list_wrapper;
        const directionClass = ' ' + directionClassNameMap[direction];
        const additionalClassName = isString(className) ? ' ' + className : '';

        return defaultClassName + directionClass + additionalClassName;
    }

    render(): Node {
        const view = this;
        const {props} = view;
        const {children} = props;

        return <div className={view.getClassName()}>{children}</div>;
    }
}
