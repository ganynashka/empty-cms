// @flow

import React, {Component, type Node} from 'react';

import type {InputComponentPropsType, InputValueType} from '../../type';
import {InputTextArea} from '../input-text-area/c-input-text-area';

import {Markdown} from './c-markdown';

type PropsType = InputComponentPropsType;
type StateType = {|
    textContent: string,
|};

export class InputMarkdown extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            textContent: String(props.defaultValue),
        };
    }

    handleTextAreaOnChange = (value: InputValueType) => {
        const {props, state} = this;
        const {onChange} = props;

        onChange(value);

        // eslint-disable-next-line react/no-set-state
        this.setState({textContent: String(value)});
    };

    handleTextAreaOnBlur = (value: InputValueType) => {
        const {props, state} = this;
        const {onBlur} = props;

        onBlur(value);

        // eslint-disable-next-line react/no-set-state
        this.setState({textContent: String(value)});
    };

    render(): Node {
        const {props, state} = this;
        const {name, errorList, defaultValue, placeholder, labelText, content} = props;

        return [
            <InputTextArea
                content={content}
                defaultValue={defaultValue}
                errorList={errorList}
                key="input-text-area"
                labelText={labelText}
                name={name}
                onBlur={this.handleTextAreaOnBlur}
                onChange={this.handleTextAreaOnChange}
                placeholder={placeholder}
            />,
            <Markdown key="markdown-result" text={state.textContent}/>,
        ];
    }
}
