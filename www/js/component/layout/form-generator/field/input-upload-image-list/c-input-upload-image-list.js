// @flow

import React, {Component, type Node} from 'react';

import type {
    InputComponentOnChangeType,
    InputComponentPropsType,
    InputValueType,
    PrimitiveInputValueType,
} from '../../type';
import {InputUploadImage} from '../input-upload-image/c-input-upload-image';
import {isFile, isNull, isNumber, isString} from '../../../../../lib/is';
import fieldStyle from '../field.style.scss';
import {extractUniqueArrayString} from '../../../../../page/document/helper';

type PropsType = InputComponentPropsType;

type StateType = {|
    +valueList: Array<string>,
    +addItemIndex: number,
|};

export class InputUploadImageList extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        const {defaultValue} = props;

        const valueList = extractUniqueArrayString(defaultValue);

        this.state = {
            valueList,
            addItemIndex: -valueList.length,
        };
    }


    // TODO: REMOVE ALL ITEMS BY VALUE, NO INDEX
    createOnChangeFieldHandler(index: number): InputComponentOnChangeType {
        const {props} = this;
        const {onChange} = props;

        return (value: InputValueType) => {
            const {state} = this;
            const {valueList, addItemIndex} = state;

            if (Array.isArray(value)) {
                console.error('here should be PrimitiveInputValueType');
                return;
            }

            if (isString(value) && value.length > 0) {
                const increasedValueList = extractUniqueArrayString([...valueList, value].filter(Boolean));

                onChange(increasedValueList);
                // eslint-disable-next-line react/no-set-state
                this.setState({valueList: increasedValueList, addItemIndex: addItemIndex - 1});
                return;
            }

            if (isFile(value)) {
                // do not pass file to InputUploadImage, it support string or null only
                return;
            }

            valueList[index] = '';

            const decreasedValueList = extractUniqueArrayString(valueList.filter(Boolean));

            onChange(decreasedValueList);
            // eslint-disable-next-line react/no-set-state
            this.setState({valueList: decreasedValueList});

            onChange(decreasedValueList);
        };
    }

    createOnBlurFieldHandler(index: number): InputComponentOnChangeType {
        return this.createOnChangeFieldHandler(index);
    }

    renderValueItem = (inputValue: string, index: number): Node => {
        const {props} = this;
        const {
            name,
            placeholder,
            content,
            accept,
            imagePathPrefix,
            uploadFile,
            snackbarPortalContext,
            popupPortalContext,
        } = props;

        const onChangeFieldHandler = this.createOnChangeFieldHandler(index);
        const onBlurFieldHandler = this.createOnBlurFieldHandler(index);

        return (
            <InputUploadImage
                accept={accept}
                content={content}
                defaultValue={inputValue}
                errorList={[]}
                imagePathPrefix={imagePathPrefix}
                isMultiple={false}
                key={inputValue}
                labelText=""
                name={name + '[' + index + ']'}
                onBlur={onBlurFieldHandler}
                onChange={onChangeFieldHandler}
                placeholder={placeholder}
                popupPortalContext={popupPortalContext}
                snackbarPortalContext={snackbarPortalContext}
                uploadFile={uploadFile}
            />
        );
    };

    renderAdditionalItem() {}

    render(): Node {
        const {props, state} = this;
        const {valueList, addItemIndex} = state;
        const {labelText} = props;

        if (!Array.isArray(props.defaultValue)) {
            console.error('InputUploadImageList: Array support only');
            return null;
        }

        return (
            <div className={fieldStyle.form__label_wrapper}>
                <span className={fieldStyle.form__label_description}>{labelText}</span>
                <div key="list">{valueList.map(this.renderValueItem)}</div>
                {/* <div key="add-new-item">{this.renderValueItem(null, addItemIndex)}</div>*/}
            </div>
        );
    }
}
