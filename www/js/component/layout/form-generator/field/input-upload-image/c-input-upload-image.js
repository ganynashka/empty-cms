// @flow

/* global URL */

import React, {Component, type Node} from 'react';
import classNames from 'classnames';

import type {InputComponentPropsType, InputValueType} from '../../type';
import fieldStyle from '../field.style.scss';

import inputUploadImageStyle from './input-upload-image.style.scss';

type PropsType = InputComponentPropsType;

type StateType = {
    fileList: Array<File>,
    defaultValue: InputValueType,
};

export class InputUploadImage extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            fileList: [],
            defaultValue: props.defaultValue,
        };
    }

    getValue(evt: SyntheticEvent<HTMLInputElement>): Array<File> {
        const {currentTarget} = evt;
        const {files} = currentTarget;

        return [...files];
    }

    handleOnChange = (evt: SyntheticEvent<HTMLInputElement>) => {
        const {props} = this;
        const {onChange} = props;
        const fileList = this.getValue(evt);

        onChange(fileList);

        // eslint-disable-next-line react/no-set-state
        this.setState({fileList});
    };

    handleRemoveImage = () => {
        const {props} = this;
        const {onChange} = props;
        const fileList = [];

        onChange(fileList);

        // eslint-disable-next-line react/no-set-state
        this.setState({
            fileList,
            defaultValue: '',
        });
    };

    renderImageInput(): Node {
        const {props} = this;
        const {accept} = props;

        return (
            <>
                <div className={inputUploadImageStyle.input_upload_image__placeholder}/>
                <input
                    accept={accept}
                    className={inputUploadImageStyle.input_upload_image__input_image}
                    onChange={this.handleOnChange}
                    type="file"
                />
            </>
        );
    }

    renderUploadedImage(): Node {
        const {state} = this;
        const {fileList} = state;
        const [file] = fileList;

        return (
            <>
                <button
                    className={inputUploadImageStyle.input_upload_image__remove_file}
                    onClick={this.handleRemoveImage}
                    type="button"
                >
                    &#10005;
                </button>
                <img
                    alt=""
                    className={inputUploadImageStyle.input_upload_image__uploaded_file}
                    src={URL.createObjectURL(file)}
                />
            </>
        );
    }

    renderDefaultImage(): Node {
        const {state, props} = this;
        const {defaultValue} = state;

        const src = String(props.imagePathPrefix || '') + '/' + String(defaultValue);

        return (
            <>
                <button
                    className={inputUploadImageStyle.input_upload_image__remove_file}
                    onClick={this.handleRemoveImage}
                    type="button"
                >
                    &#10005;
                </button>
                <img alt="" className={inputUploadImageStyle.input_upload_image__uploaded_file} src={src}/>
            </>
        );
    }

    renderContent(): Node {
        const {state} = this;
        const {fileList, defaultValue} = state;
        const hasFile = fileList.length > 0;
        const hasDefaultValue = Boolean(defaultValue);

        if (hasFile) {
            return this.renderUploadedImage();
        }

        if (hasDefaultValue) {
            return this.renderDefaultImage();
        }

        return this.renderImageInput();
    }

    render(): Node {
        const {state, props} = this;
        const {fileList, defaultValue} = state;
        const {labelText, errorList} = props;
        const hasFile = fileList.length > 0;
        const hasDefaultValue = Boolean(defaultValue);

        return (
            <div className={fieldStyle.form__label_wrapper}>
                <span className={fieldStyle.form__label_description}>{labelText}</span>
                <div
                    className={classNames(inputUploadImageStyle.input_upload_image__wrapper, {
                        [inputUploadImageStyle.input_upload_image__wrapper__with_image]: hasFile || hasDefaultValue,
                        [fieldStyle.form__input__invalid]: errorList.length > 0,
                    })}
                >
                    {this.renderContent()}
                </div>
            </div>
        );
    }
}
