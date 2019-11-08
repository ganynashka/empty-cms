// @flow

import React, {type Node} from 'react';
import classNames from 'classnames';

import type {InputComponentPropsType} from '../../type';
import fieldStyle from '../field.style.scss';

import inputCheckboxStyle from './input-checkbox.style.scss';

type PropsType = InputComponentPropsType;

export function InputCheckbox(props: PropsType): Node {
    const {name, onChange, onBlur, errorList, defaultValue, placeholder, labelText} = props;

    /*
    function handleOnChange(evt: SyntheticEvent<HTMLInputElement>) {
        const {currentTarget} = evt;
        const value = Boolean(currentTarget.checked);

        onChange(value);
    }
*/

    function handleOnBlur(evt: SyntheticEvent<HTMLInputElement>) {
        const {currentTarget} = evt;
        const value = Boolean(currentTarget.checked);

        onBlur(value);
    }

    const isInvalid = errorList.length > 0;

    return (
        <label className={fieldStyle.form__label_wrapper}>
            <input
                className={inputCheckboxStyle.input_checkbox__input}
                defaultChecked={defaultValue === true}
                name={name}
                onBlur={handleOnBlur}
                onChange={handleOnBlur}
                type="checkbox"
            />
            <span
                className={classNames(inputCheckboxStyle.input_checkbox__input_state, {
                    [inputCheckboxStyle.input_checkbox__input_state__invalid]: isInvalid,
                })}
            />
            <span
                className={classNames(
                    fieldStyle.form__label_description,
                    inputCheckboxStyle.input_checkbox__label_description,
                    {
                        [fieldStyle.form__label_description__invalid]: isInvalid,
                    }
                )}
            >
                {labelText}
            </span>
            {/* <code>errorList: {errorList.map((error: Error): string => error.message)}</code>*/}
        </label>
    );
}
