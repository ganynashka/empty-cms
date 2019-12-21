// @flow

import React, {Component, type Node} from 'react';
import classNames from 'classnames';
import codeMirror from 'codemirror';
import style from 'codemirror/lib/codemirror.css';
import codeMirrorMode from 'codemirror/mode/htmlmixed/htmlmixed';

import type {InputComponentPropsType} from '../../form-generator-type';
import inputTextAreaStyle from '../input-text-area/input-text-area.scss';
import fieldStyle from '../field.scss';
import {isString} from '../../../../../lib/is';

import inputCodeStyle from './input-code.scss';

type PropsType = InputComponentPropsType;
type StateType = {|
    // +textContent: string,
    +textAreaRef: {current: HTMLTextAreaElement | null},
|};

export class InputCode extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            // textContent: String(props.defaultValue),
            textAreaRef: React.createRef<HTMLTextAreaElement>(),
        };
    }

    componentDidMount() {
        const {props, state} = this;
        const {textAreaRef} = state;
        const {onBlur, onChange} = props;
        const textAreaNode = textAreaRef.current;

        if (!textAreaNode) {
            console.error('textAreaNode is not define');
            return;
        }

        const editor = codeMirror.fromTextArea(textAreaNode, {
            lineNumbers: true,
            mode: 'htmlmixed',
            // value: state.textContent,
        });

        editor.on('change', () => {
            const textContent = editor.getValue().trim();

            onChange(textContent);
            // this.setState({textContent});
        });

        editor.on('blur', () => {
            const textContent = editor.getValue().trim();

            onBlur(textContent);
            // this.setState({textContent});
        });
    }

    render(): Node {
        const {props, state} = this;
        const {name, errorList, defaultValue, placeholder, labelText} = props;

        if (!isString(defaultValue)) {
            console.error('InputCode: Support String Only.');
            return null;
        }

        return (
            <div className={inputTextAreaStyle.text_area__label_wrapper}>
                <span className={fieldStyle.form__label_description}>{labelText}</span>
                <div
                    className={classNames(inputCodeStyle.input_code__wrapper, {
                        [fieldStyle.form__input__invalid]: errorList.length > 0,
                    })}
                >
                    <textarea
                        className={classNames(
                            inputCodeStyle.input_code__text_area,
                            inputTextAreaStyle.text_area__input
                        )}
                        defaultValue={defaultValue}
                        name={name}
                        // onBlur={this.handleTextAreaOnBlur}
                        // onChange={this.handleTextAreaOnChange}
                        placeholder={placeholder}
                        ref={state.textAreaRef}
                    />
                </div>
            </div>
        );
    }
}
