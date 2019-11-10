// @flow

import React, {Component, type Node} from 'react';
import classNames from 'classnames';

import type {InputComponentPropsType} from '../../type';
import {Markdown} from '../../../markdown/c-markdown';
import inputTextAreaStyle from '../input-text-area/input-text-area.style.scss';
import fieldStyle from '../field.style.scss';

import inputMarkdownStyle from './input-markdown.style.scss';

type PropsType = InputComponentPropsType;
type StateType = {|
    +textContent: string,
|};

export class InputMarkdown extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            textContent: String(props.defaultValue),
        };
    }

    getTextAreaValue(evt: SyntheticEvent<HTMLInputElement>): string {
        const {currentTarget} = evt;
        const {value} = currentTarget;

        return value.trim();
    }

    handleTextAreaOnChange = (evt: SyntheticEvent<HTMLInputElement>) => {
        const {props, state} = this;
        const {onChange} = props;
        const value = this.getTextAreaValue(evt);

        onChange(value);

        // eslint-disable-next-line react/no-set-state
        this.setState({textContent: String(value)});
    };

    handleTextAreaOnBlur = (evt: SyntheticEvent<HTMLInputElement>) => {
        const {props, state} = this;
        const {onBlur} = props;
        const value = this.getTextAreaValue(evt);

        onBlur(value);

        // eslint-disable-next-line react/no-set-state
        this.setState({textContent: String(value)});
    };

    render(): Node {
        const {props, state} = this;
        const {name, errorList, defaultValue, placeholder, labelText} = props;

        return (
            <label className={inputTextAreaStyle.text_area__label_wrapper}>
                <span className={fieldStyle.form__label_description}>{labelText}</span>
                <div className={inputMarkdownStyle.input_markdown__wrapper}>
                    <textarea
                        className={classNames(
                            inputMarkdownStyle.input_markdown__half,
                            inputTextAreaStyle.text_area__input,
                            {
                                [fieldStyle.form__input__invalid]: errorList.length > 0,
                            }
                        )}
                        defaultValue={defaultValue}
                        name={name}
                        onBlur={this.handleTextAreaOnBlur}
                        onChange={this.handleTextAreaOnChange}
                        placeholder={placeholder}
                    />
                    <Markdown
                        additionalClassName={inputMarkdownStyle.input_markdown__half}
                        key="markdown-result"
                        text={state.textContent}
                    />
                </div>
            </label>
        );
    }
}
