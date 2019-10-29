// @flow

import type {Node} from 'react';
import React from 'react';
import classNames from 'classnames';

import type {InputComponentPropsType} from '../../type';
import fieldStyle from '../field.style.scss';

import inputSelectStyle from './input-select.style.scss';

type PropsType = InputComponentPropsType;

export function InputSelect(props: PropsType): Node {
    const {name, onChange, onBlur, errorList, defaultValue, placeholder, labelText, content: optionList} = props;

    function handleOnChange(evt: SyntheticEvent<HTMLSelectElement>) {
        const {currentTarget} = evt;
        const {value} = currentTarget;

        onChange(value);
    }

    function handleOnBlur(evt: SyntheticEvent<HTMLSelectElement>) {
        const {currentTarget} = evt;
        const {value} = currentTarget;

        onBlur(value);
    }

    return (
        <label className={inputSelectStyle.form__label_wrapper__select}>
            <span className={fieldStyle.form__label_description}>{labelText}</span>
            <select
                className={classNames(inputSelectStyle.form__input__select, {
                    [fieldStyle.form__input__invalid]: errorList.length > 0,
                })}
                defaultValue={defaultValue}
                name={name}
                onBlur={handleOnBlur}
                onChange={handleOnChange}
            >
                {optionList}
            </select>
            {/* <code>errorList: {errorList.map((error: Error): string => error.message)}</code>*/}
        </label>
    );
}
