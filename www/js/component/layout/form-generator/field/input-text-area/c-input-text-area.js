// @flow

import React, {type Node} from 'react';
import classNames from 'classnames';

import type {InputComponentPropsType} from '../../form-generator-type';
import fieldStyle from '../field.scss';
import {isString} from '../../../../../lib/is';

import inputTextAreaStyle from './input-text-area.scss';

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

    if (!isString(defaultValue)) {
        console.error('InputTextArea: Support String Only.');
        return null;
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
