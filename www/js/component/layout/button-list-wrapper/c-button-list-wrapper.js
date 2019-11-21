// @flow

import React, {Component, type Node} from 'react';

import {isString} from '../../../lib/is';

import buttonListWrapperStyle from './button-list-wrapper.scss';
import type {ButtonListDirectionType} from './button-list-wrapper-type';
import {buttonWrapperDirectionClassNameMap} from './button-list-wrapper-const';

type PropsType = {|
    +direction: ButtonListDirectionType,
    +children: Node,
    +className?: string,
|};

type StateType = null;

export class ButtonListWrapper extends Component<PropsType, StateType> {
    getClassName(): string {
        const {props} = this;
        const {direction, className} = props;

        const defaultClassName = buttonListWrapperStyle.button_list_wrapper;
        const directionClass = ' ' + buttonWrapperDirectionClassNameMap[direction];
        const additionalClassName = isString(className) ? ' ' + className : '';

        return defaultClassName + directionClass + additionalClassName;
    }

    render(): Node {
        const {props} = this;
        const {children} = props;

        return <div className={this.getClassName()}>{children}</div>;
    }
}
