// @flow

import React, {Component, type Node} from 'react';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import type {FieldAutocompleteDataType, InputComponentPropsType} from '../../form-generator-type';
import {isError, isFunction, isString} from '../../../../../lib/is';
import fieldStyle from '../field.scss';

type PropsType = InputComponentPropsType;
type StateType = {|
    +dataList: Array<FieldAutocompleteDataType> | null,
|};

export class InputTextAutocomplete extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            dataList: null,
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    async fetchData() {
        const {props} = this;
        const {getAutocompleteListData} = props;

        if (!isFunction(getAutocompleteListData)) {
            console.error('getAutocompleteListData should be a function');
            return;
        }

        const dataList = await getAutocompleteListData();

        if (isError(dataList)) {
            return;
        }

        this.setState({dataList});
    }

    getDefaultValue(): Array<FieldAutocompleteDataType> {
        const {props, state} = this;
        const {defaultValue} = props;
        const {dataList} = state;

        if (dataList === null) {
            return [];
        }

        const defaultValueList = [...Array.isArray(defaultValue) ? defaultValue : []];

        return defaultValueList.map((value: mixed): FieldAutocompleteDataType => {
            if (!isString(value)) {
                return {
                    value: 'value - ' + String(Math.random()),
                    header: 'Error!!!',
                };
            }

            const data = dataList.find((autocompleteDataType: FieldAutocompleteDataType): boolean => {
                return autocompleteDataType.value === value;
            });

            if (data) {
                return data;
            }

            // console.log(dataList);
            console.error(value, 'has no header');

            return {
                value,
                header: 'Error: ' + value,
            };
        });
    }

    renderInput = (parameters: {}): Node => {
        const {props, state} = this;

        // eslint-disable-next-line react/jsx-props-no-spreading
        return <TextField {...parameters} fullWidth label={props.placeholder} variant="outlined"/>;
    };

    getOptionLabel = (option: FieldAutocompleteDataType): string => {
        return option.header;
    };

    handleChange = (event: mixed, dataList: Array<FieldAutocompleteDataType>) => {
        const {props} = this;
        const {onChange} = props;

        const resultList: Array<string> = dataList.map((dataInList: FieldAutocompleteDataType): string => {
            return dataInList.value;
        });

        onChange(resultList);
    };

    renderTagList = (value: Array<FieldAutocompleteDataType>, getTagProps: (data: {}) => {}): Array<Node> => {
        return value.map((option: FieldAutocompleteDataType, index: number): Node => {
            // eslint-disable-next-line react/jsx-props-no-spreading
            return <Chip {...getTagProps({index})} key={option.value} label={option.header}/>;
        });
    };

    render(): Node {
        const {props, state} = this;
        const {dataList} = state;
        const {labelText} = props;

        return (
            <div className={fieldStyle.form__label_wrapper}>
                <span className={fieldStyle.form__label_description}>{labelText}</span>
                <Autocomplete
                    defaultValue={this.getDefaultValue()}
                    getOptionLabel={this.getOptionLabel}
                    key={dataList ? 'ready' : 'pending'}
                    multiple
                    onChange={this.handleChange}
                    options={dataList}
                    renderInput={this.renderInput}
                    renderTags={this.renderTagList}
                />
            </div>
        );
    }
}
