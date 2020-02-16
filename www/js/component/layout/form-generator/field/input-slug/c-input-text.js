// @flow

import React, {Component, type Node} from 'react';
import classNames from 'classnames';

import type {InputComponentPropsType} from '../../form-generator-type';
import fieldStyle from '../field.scss';
import {isString} from '../../../../../lib/is';
import {cleanText, getSlug} from '../../../../../lib/string';
import {FormButton} from '../../../form-button/c-form-button';

type PropsType = InputComponentPropsType;
type StateType = {|
    +ref: {|
        +input: {current: HTMLInputElement | null},
    |},
|};

export class InputSlug extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            ref: {
                input: React.createRef<HTMLInputElement>(),
            },
        };
    }

    getInputNode(): HTMLInputElement | null {
        const {state} = this;

        return state.ref.input.current;
    }

    getInputText(): string | null {
        const inputNode = this.getInputNode();

        return inputNode ? inputNode.value : null;
    }

    handleOnChange = () => {
        const {props} = this;
        const {onChange} = props;

        const trimmedValue = cleanText(this.getInputText() || '');

        onChange(trimmedValue);
    };

    handleOnBlur = () => {
        const {props} = this;
        const {onBlur} = props;
        const inputNode = this.getInputNode();

        if (!inputNode) {
            return;
        }

        const {value} = inputNode;
        const trimmedValue = cleanText(this.getInputText() || '');

        if (trimmedValue !== value) {
            inputNode.value = trimmedValue;
        }

        onBlur(trimmedValue);
    };

    handleGenerateSlug = () => {
        const inputNode = this.getInputNode();
        const trimmedValue = cleanText(this.getInputText() || '');

        if (!inputNode) {
            return;
        }

        inputNode.value = getSlug(trimmedValue);
        this.handleOnBlur();
    };

    render(): Node {
        const {props, state} = this;
        const {name, errorList, defaultValue, placeholder, labelText} = props;

        if (!isString(defaultValue)) {
            console.error('InputText: Support String Only.');
            return null;
        }

        return (
            <label className={fieldStyle.form__label_wrapper}>
                <span className={fieldStyle.form__label_description}>{labelText}</span>
                <div className={fieldStyle.form__input_list_wrapper}>
                    <input
                        className={classNames(fieldStyle.form__input, fieldStyle.form__input__with_button, {
                            [fieldStyle.form__input__invalid]: errorList.length > 0,
                        })}
                        defaultValue={defaultValue}
                        name={name}
                        onBlur={this.handleOnBlur}
                        onChange={this.handleOnChange}
                        placeholder={placeholder}
                        ref={state.ref.input}
                        type="text"
                    />
                    <FormButton onClick={this.handleGenerateSlug}>Generate&nbsp;slug</FormButton>
                </div>
                {/* <code>errorList: {errorList.map((error: Error): string => error.message)}</code>*/}
            </label>
        );
    }
}
