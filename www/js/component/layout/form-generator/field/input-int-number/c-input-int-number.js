// @flow

import React, {type Node} from 'react';
import classNames from 'classnames';

import type {InputComponentPropsType} from '../../form-generator-type';
import fieldStyle from '../field.scss';
import {isNull, isNumber} from '../../../../../lib/is';

import {stringToIntNumber} from './input-int-number-helper';

type PropsType = InputComponentPropsType;

export function InputIntNumber(props: PropsType): Node {
    const {name, onChange, onBlur, errorList, defaultValue, placeholder, labelText} = props;

    if (!isNumber(defaultValue) && !isNull(defaultValue)) {
        console.error('InputIntNumber: Number or Null Support Only.');
        return null;
    }

    function handleOnChange(evt: SyntheticEvent<HTMLInputElement>) {
        const {currentTarget} = evt;
        const {value} = currentTarget;

        const clearNumber = stringToIntNumber(value);

        if (clearNumber === null) {
            currentTarget.value = '';
            onChange(null);
            return;
        }

        // current value is normal number
        if (value === String(clearNumber)) {
            onChange(clearNumber);
            return;
        }

        currentTarget.value = String(clearNumber);
        onChange(clearNumber);
    }

    function handleOnBlur(evt: SyntheticEvent<HTMLInputElement>) {
        // all changes should done into handleOnChange
        const {currentTarget} = evt;
        const {value} = currentTarget;
        const clearNumber = stringToIntNumber(value);

        onBlur(clearNumber);
    }

    return (
        <label className={fieldStyle.form__label_wrapper}>
            <span className={fieldStyle.form__label_description}>{labelText}</span>
            <input
                className={classNames(fieldStyle.form__input, {
                    [fieldStyle.form__input__invalid]: errorList.length > 0,
                })}
                defaultValue={defaultValue === null ? '' : defaultValue}
                name={name}
                onBlur={handleOnBlur}
                onChange={handleOnChange}
                placeholder={placeholder}
                type="text"
            />
            {/* <code>errorList: {errorList.map((error: Error): string => error.message)}</code>*/}
        </label>
    );
}
