// @flow

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';

import {isString} from '../../../lib/is';
import type {ButtonType} from '../button/c-button';
import {Button} from '../button/c-button';

import formButtonStyle from './form-button.style.scss';

type StateType = {};

type PassedPropsType = {|
    // copied buttons props type
    +children: Node,
    +className?: string,
    +accessKey?: string,
    +onClick?: (evt: SyntheticEvent<HTMLButtonElement>) => mixed,
    +autoFocus?: boolean,
    +type?: ButtonType,
    +isWide?: boolean,
    +ariaLabel?: Node,

    +isDefault?: boolean,
|};

export class FormButton extends Component<PassedPropsType, StateType> {
    constructor(props: PassedPropsType) {
        super(props);

        const view = this;

        view.state = {};
    }

    getClassName(): string {
        const view = this;
        const {props} = view;
        const {className, isDefault} = props;
        const defaultClassName = isDefault ? formButtonStyle.form_button__default : formButtonStyle.form_button;

        if (isString(className)) {
            return defaultClassName + ' ' + className;
        }

        return defaultClassName;
    }

    render(): Node {
        const view = this;
        const {props} = view;
        const {children, accessKey, onClick, autoFocus, type, isWide, ariaLabel} = props;

        return (
            <Button
                accessKey={accessKey}
                ariaLabel={ariaLabel}
                autoFocus={autoFocus}
                className={view.getClassName()}
                isWide={isWide}
                onClick={onClick}
                type={type}
            >
                {children}
            </Button>
        );
    }
}
