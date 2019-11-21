// @flow

import React, {Component, type Node} from 'react';

import {isString} from '../../../lib/is';

import buttonStyle from './button.scss';

export type ButtonType = 'button' | 'submit' | 'reset';

type StateType = {};
type PassedPropsType = {|
    +children: Node,
    +className?: string,
    +accessKey?: string,
    +onClick?: (evt: SyntheticEvent<HTMLButtonElement>) => mixed,
    +autoFocus?: boolean,
    +type?: ButtonType,
    +isWide?: boolean,
    +ariaLabel?: Node,
|};

export class Button extends Component<PassedPropsType, StateType> {
    constructor(props: PassedPropsType) {
        super(props);

        this.state = {};
    }

    getClassName(): string {
        const {props} = this;
        const {className, isWide} = props;
        const classNameList = [buttonStyle.button];

        if (isWide === true) {
            classNameList.push(buttonStyle.button__wide);
        }

        if (isString(className)) {
            classNameList.push(className);
        }

        return classNameList.join(' ');
    }

    getButtonType(): ButtonType {
        const {props} = this;
        const {type} = props;

        if (isString(type)) {
            return type;
        }

        return 'button';
    }

    render(): Node {
        const {props} = this;
        const {accessKey, onClick, autoFocus, children, ariaLabel} = props;

        return (
            // eslint-disable-next-line react/button-has-type
            <button
                accessKey={accessKey || null}
                aria-label={ariaLabel}
                autoFocus={autoFocus}
                className={this.getClassName()}
                onClick={onClick}
                type={this.getButtonType()}
            >
                {children}
            </button>
        );
    }
}
