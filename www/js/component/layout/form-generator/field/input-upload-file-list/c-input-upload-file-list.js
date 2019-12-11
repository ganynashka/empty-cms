// @flow

import React, {Component, type Node} from 'react';

import type {
    InputComponentOnChangeType,
    InputComponentPropsType,
    FromGeneratorInputValueType,
} from '../../form-generator-type';
import {InputUploadFile} from '../input-upload-file/c-input-upload-file';
import {isFile, isString} from '../../../../../lib/is';
import fieldStyle from '../field.scss';
import {extractUniqueArrayString} from '../../../../../lib/string';

import inputUploadImageListStyle from './input-upload-file-list.scss';

type PropsType = InputComponentPropsType;

type StateType = {|
    +valueList: Array<string>,
    +addItemIndex: number,
|};

export class InputUploadFileList extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            valueList: extractUniqueArrayString(props.defaultValue),
            addItemIndex: 0,
        };
    }

    createOnChangeFieldHandler(index: number): InputComponentOnChangeType {
        const {props} = this;
        const {onChange} = props;

        return (value: FromGeneratorInputValueType) => {
            const {state} = this;
            const {addItemIndex} = state;
            const valueList = [...state.valueList];

            if (!value) {
                valueList.splice(index, 1);

                const decreasedValueList = extractUniqueArrayString(valueList);

                this.setState({valueList: decreasedValueList}, () => {
                    onChange(decreasedValueList);
                });

                return;
            }

            if (isString(value) && value.length > 0) {
                valueList.push(value);
                const increasedValueList = extractUniqueArrayString(valueList);

                this.setState({valueList: increasedValueList, addItemIndex: addItemIndex + 1}, () => {
                    onChange(increasedValueList);
                });
                return;
            }

            if (isFile(value)) {
                console.log('Not need action for file');
                return;
            }

            console.error('This value is not support', value);
        };
    }

    renderValueItem = (inputValue: string, index: number): Node => {
        const {props} = this;
        const {name, placeholder, content, accept, filePathPrefix, uploadFile, snackbarContext, popupContext} = props;

        const onChangeFieldHandler = this.createOnChangeFieldHandler(index);

        return (
            <InputUploadFile
                accept={accept}
                content={content}
                defaultValue={inputValue}
                errorList={[]}
                filePathPrefix={filePathPrefix}
                isMultiple={false}
                key={inputValue}
                labelText=""
                name={name + '[' + index + ']'}
                onBlur={onChangeFieldHandler}
                onChange={onChangeFieldHandler}
                placeholder={placeholder}
                popupContext={popupContext}
                snackbarContext={snackbarContext}
                uploadFile={uploadFile}
            />
        );
    };

    renderAdditionalItem(): Node {
        const {props, state} = this;
        const {placeholder, content, accept, filePathPrefix, uploadFile, snackbarContext, popupContext} = props;

        const onChangeFieldHandler = this.createOnChangeFieldHandler(state.addItemIndex);

        return (
            <InputUploadFile
                accept={accept}
                content={content}
                defaultValue={null}
                errorList={[]}
                filePathPrefix={filePathPrefix}
                isMultiple={false}
                key={state.addItemIndex}
                labelText=""
                name="add-item"
                onBlur={onChangeFieldHandler}
                onChange={onChangeFieldHandler}
                placeholder={placeholder}
                popupContext={popupContext}
                snackbarContext={snackbarContext}
                uploadFile={uploadFile}
            />
        );
    }

    render(): Node {
        const {props, state} = this;
        const {valueList} = state;
        const {labelText} = props;

        if (!Array.isArray(props.defaultValue)) {
            console.error('InputUploadFileList: Array support only');
            return null;
        }

        return (
            <div className={fieldStyle.form__label_wrapper}>
                <span className={fieldStyle.form__label_description}>{labelText}</span>
                <div className={inputUploadImageListStyle.input_upload_image_list__list_wrapper}>
                    {valueList.map(this.renderValueItem)}
                    {this.renderAdditionalItem()}
                </div>
            </div>
        );
    }
}
