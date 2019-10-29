// @flow

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';

import {isString} from '../../../lib/is';

import buttonStyle from './button.style.scss';

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

        const view = this;

        view.state = {};
    }

    getClassName(): string {
        const view = this;
        const {props} = view;
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
        const view = this;
        const {props} = view;
        const {type} = props;

        if (isString(type)) {
            return type;
        }

        return 'button';
    }

    render(): Node {
        const view = this;
        const {props} = view;
        const {accessKey, onClick, autoFocus, children, ariaLabel} = props;

        return (
            // eslint-disable-next-line react/button-has-type
            <button
                accessKey={accessKey || null}
                aria-label={ariaLabel}
                autoFocus={autoFocus}
                className={view.getClassName()}
                onClick={onClick}
                type={view.getButtonType()}
            >
                {children}
            </button>
        );
    }
}
