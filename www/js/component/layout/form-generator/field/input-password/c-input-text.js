// @flow

import React, {type Node} from 'react';
import classNames from 'classnames';

import type {InputComponentPropsType} from '../../type';
import fieldStyle from '../field.style.scss';
import {isString} from '../../../../../lib/is';

type PropsType = InputComponentPropsType;

export function InputPassword(props: PropsType): Node {
    const {name, onChange, onBlur, errorList, defaultValue, placeholder, labelText} = props;

    function handleOnChange(evt: SyntheticEvent<HTMLInputElement>) {
        const {currentTarget} = evt;
        const {value} = currentTarget;

        onChange(value);
    }

    function handleOnBlur(evt: SyntheticEvent<HTMLInputElement>) {
        const {currentTarget} = evt;
        const {value} = currentTarget;

        onBlur(value);
    }

    if (!isString(defaultValue)) {
        console.error('InputPassword: Support String Only.');
        return null;
    }

    return (
        <label className={fieldStyle.form__label_wrapper}>
            <span className={fieldStyle.form__label_description}>{labelText}</span>
            <input
                className={classNames(fieldStyle.form__input, {
                    [fieldStyle.form__input__invalid]: errorList.length > 0,
                })}
                defaultValue={defaultValue}
                name={name}
                onBlur={handleOnBlur}
                onChange={handleOnChange}
                placeholder={placeholder}
                type="password"
            />
            {/* <code>errorList: {errorList.map((error: Error): string => error.message)}</code>*/}
        </label>
    );
}
