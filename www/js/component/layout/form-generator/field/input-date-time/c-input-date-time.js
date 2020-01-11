// @flow

import React, {Component, type Node} from 'react';
import classNames from 'classnames';

import type {InputComponentPropsType} from '../../form-generator-type';
import fieldStyle from '../field.scss';
import {isNumber} from '../../../../../lib/is';

import dateTimeStyle from './input-date-time.scss';

type PropsType = InputComponentPropsType;
type StateType = {
    date: string,
    time: string,
};

export class InputDateTime extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = this.getDefaultState();
    }

    getDefaultState(): StateType {
        const {props} = this;
        const {defaultValue} = props;

        if (!defaultValue || !isNumber(defaultValue)) {
            return {
                date: '',
                time: '',
            };
        }

        const [date, time] = new Date(defaultValue).toISOString().split('T');

        return {
            date,
            time: time.slice(0, 5),
        };
    }

    handleOnChange(rawDate: string, rawTime: string) {
        const {props} = this;
        const {onChange} = props;

        this.setState({date: rawDate, time: rawTime});

        const date = rawDate.length === 0 ? '1970-01-01' : rawDate;

        const time = rawTime.length === 0 ? '00:00' : rawTime;

        onChange(new Date(`${date}T${time}Z`).getTime());
    }

    handleOnChangeDate = (evt: SyntheticEvent<HTMLInputElement>) => {
        const {state} = this;
        const {time} = state;
        const {currentTarget} = evt;
        const {value} = currentTarget;

        this.handleOnChange(value, time);
    };

    handleOnChangeTime = (evt: SyntheticEvent<HTMLInputElement>) => {
        const {state} = this;
        const {date} = state;
        const {currentTarget} = evt;
        const {value} = currentTarget;

        this.handleOnChange(date, value);
    };

    render(): Node {
        const {props, state} = this;
        const {name, errorList, labelText} = props;

        return (
            <label className={fieldStyle.form__label_wrapper}>
                <span className={fieldStyle.form__label_description}>{labelText}</span>
                <div
                    className={classNames(fieldStyle.form__input, {
                        [fieldStyle.form__input__invalid]: errorList.length > 0,
                    })}
                >
                    <div className={dateTimeStyle.date_time__wrapper}>
                        <input
                            className={dateTimeStyle.date_time__input}
                            defaultValue={state.date || null}
                            name={name + '-date'}
                            onBlur={this.handleOnChangeDate}
                            onChange={this.handleOnChangeDate}
                            type="date"
                        />
                        <input
                            className={dateTimeStyle.date_time__input}
                            defaultValue={state.time || null}
                            name={name + '-time'}
                            onBlur={this.handleOnChangeTime}
                            onChange={this.handleOnChangeTime}
                            type="time"
                        />
                    </div>
                </div>
                {/* <code>errorList: {errorList.map((error: Error): string => error.message)}</code>*/}
            </label>
        );
    }
}
