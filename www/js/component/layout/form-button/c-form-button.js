// @flow

import React, {Component, type Node} from 'react';

import {isString} from '../../../lib/is';
import type {ButtonType} from '../button/button-type';
import {Button} from '../button/c-button';

import formButtonStyle from './form-button.scss';

type StateType = null;

type PropsType = {|
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

export class FormButton extends Component<PropsType, StateType> {
    getClassName(): string {
        const {props} = this;
        const {className, isDefault} = props;
        const defaultClassName = isDefault ? formButtonStyle.form_button__default : formButtonStyle.form_button;

        if (isString(className)) {
            return defaultClassName + ' ' + className;
        }

        return defaultClassName;
    }

    render(): Node {
        const {props} = this;
        const {children, accessKey, onClick, autoFocus, type, isWide, ariaLabel} = props;

        return (
            <Button
                accessKey={accessKey}
                ariaLabel={ariaLabel}
                autoFocus={autoFocus}
                className={this.getClassName()}
                isWide={isWide}
                onClick={onClick}
                type={type}
            >
                {children}
            </Button>
        );
    }
}
