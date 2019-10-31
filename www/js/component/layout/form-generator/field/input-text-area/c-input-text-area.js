// @flow

import type {Node} from 'react';
import React from 'react';
import classNames from 'classnames';

import type {InputComponentPropsType} from '../../type';
import fieldStyle from '../field.style.scss';

import inputTextAreaStyle from './input-text-area.style.scss';

type PropsType = InputComponentPropsType;

export function InputTextArea(props: PropsType): Node {
    const {name, onChange, onBlur, errorList, defaultValue, placeholder, labelText} = props;

    function handleOnChange(evt: SyntheticEvent<HTMLInputElement>) {
        const {currentTarget} = evt;
        const {value} = currentTarget;

        const trimmedValue = value.trim();

        onChange(trimmedValue);
    }

    function handleOnBlur(evt: SyntheticEvent<HTMLInputElement>) {
        const {currentTarget} = evt;
        const {value} = currentTarget;
        const trimmedValue = value.trim();

        if (trimmedValue !== value) {
            currentTarget.value = trimmedValue;
        }

        onBlur(trimmedValue);
    }

    return (
        <label className={inputTextAreaStyle.text_area__label_wrapper}>
            <span className={fieldStyle.form__label_description}>{labelText}</span>
            <textarea
                className={classNames(inputTextAreaStyle.text_area__input, {
                    [fieldStyle.form__input__invalid]: errorList.length > 0,
                })}
                defaultValue={defaultValue}
                name={name}
                onBlur={handleOnBlur}
                onChange={handleOnChange}
                placeholder={placeholder}
            />
        </label>
    );
}
