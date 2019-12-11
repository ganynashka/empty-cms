// @flow

/* global URL, navigator */

import React, {Component, type Node} from 'react';
import classNames from 'classnames';

import type {InputComponentPropsType, FromGeneratorInputValueType} from '../../form-generator-type';
import fieldStyle from '../field.scss';
import {getMarkdownResizedImage} from '../../../../../page/cms/file/file-api';
import {promiseCatch} from '../../../../../lib/promise';
import {isError, isFunction, isNull, isString} from '../../../../../lib/is';

import inputUploadFileStyle from './input-upload-file.scss';

type PropsType = InputComponentPropsType;

type StateType = {
    file: File | null,
    isUploadInProgress: boolean,
    defaultValue: FromGeneratorInputValueType,
};

export class InputUploadFile extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            file: null,
            isUploadInProgress: false,
            defaultValue: props.defaultValue,
        };
    }

    getDefaultState(): StateType {
        return {
            file: null,
            isUploadInProgress: false,
            defaultValue: '',
        };
    }

    getValue(evt: SyntheticEvent<HTMLInputElement>): File | null {
        const {currentTarget} = evt;
        const {files} = currentTarget;

        const fileList = [...files];

        if (fileList.length > 0) {
            return fileList[0];
        }

        return null;
    }

    handleOnChange = (evt: SyntheticEvent<HTMLInputElement>) => {
        const {props} = this;
        const {onChange, uploadFile, snackbarContext} = props;
        const {showSnackbar} = snackbarContext;
        const fileOrNull = this.getValue(evt);

        if (!isFunction(uploadFile)) {
            console.error('InputUploadFile: uploadFile should be a function');
            return;
        }

        if (isNull(fileOrNull)) {
            onChange(null);
            this.setState(this.getDefaultState());
            return;
        }

        onChange(fileOrNull);
        this.setState({file: fileOrNull, isUploadInProgress: true});

        uploadFile(fileOrNull)
            .then(async (uploadResult: Error | string): Promise<Error | string> => {
                if (isError(uploadResult)) {
                    console.error('Can not upload file');
                    console.error(uploadResult);

                    onChange(null);
                    this.setState(this.getDefaultState());

                    await showSnackbar({children: 'Error while upload file!', variant: 'error'}, 'can-not-upload-file');

                    return uploadResult;
                }

                this.setState({file: null, isUploadInProgress: false, defaultValue: uploadResult}, () => {
                    onChange(uploadResult);
                });

                return uploadResult;
            })
            .catch(async (error: Error): Promise<Error> => {
                onChange(null);
                this.setState(this.getDefaultState());

                await showSnackbar({children: 'Error while upload file!', variant: 'error'}, 'can-not-upload-file');

                console.error('Can not upload file');
                console.error(error);
                return error;
            });
    };

    handleRemoveImage = () => {
        const {props} = this;
        const {onChange} = props;

        onChange(null);
        this.setState(this.getDefaultState());
    };

    renderImageInput(): Node {
        const {props} = this;
        const {accept} = props;

        return (
            <>
                <div className={inputUploadFileStyle.input_upload_file__placeholder}/>
                <input
                    accept={accept}
                    className={inputUploadFileStyle.input_upload_file__input_file}
                    onChange={this.handleOnChange}
                    type="file"
                />
            </>
        );
    }

    renderUploadedImage(): Node {
        const {state} = this;
        const {file} = state;

        if (!file) {
            console.error('There is should be a file!');
            return null;
        }

        return (
            <div className={inputUploadFileStyle.input_upload_file__full_wrapper}>
                <img
                    alt=""
                    className={inputUploadFileStyle.input_upload_file__uploaded_file}
                    src={URL.createObjectURL(file)}
                />
            </div>
        );
    }

    handleCopyImageSrc = async () => {
        const {state, props} = this;
        const {snackbarContext} = props;
        const {defaultValue} = state;
        const snackBarId = 'copy-image-markdown-snack-bar-id-' + String(Date.now());
        const {showSnackbar} = snackbarContext;

        if (!navigator.clipboard) {
            await showSnackbar(
                {children: 'Your browser DO NOT support \'navigator.clipboard\'!', variant: 'error'},
                snackBarId
            );
            return;
        }

        const imageMarkdown = getMarkdownResizedImage(String(defaultValue));

        const copyResult = await navigator.clipboard.writeText(imageMarkdown).catch(promiseCatch);

        if (isError(copyResult)) {
            await showSnackbar({children: 'can not copy image markdown!', variant: 'error'}, snackBarId);
            return;
        }

        await showSnackbar({children: 'Copy as markdown!', variant: 'success'}, snackBarId);
    };

    renderDefaultImage(): Node {
        const {state, props} = this;
        const {defaultValue} = state;
        const src = String(props.filePathPrefix || '') + '/' + String(defaultValue);

        return (
            <>
                <button
                    className={inputUploadFileStyle.input_upload_file__remove_file}
                    onClick={this.handleRemoveImage}
                    type="button"
                >
                    &#10005;
                </button>
                <button
                    className={inputUploadFileStyle.input_upload_file__full_button}
                    onClick={this.handleCopyImageSrc}
                    type="button"
                >
                    <img alt="" className={inputUploadFileStyle.input_upload_file__uploaded_file} src={src}/>
                </button>
            </>
        );
    }

    renderContent(): Node {
        if (this.hasFile()) {
            return this.renderUploadedImage();
        }

        if (this.hasDefaultValue()) {
            return this.renderDefaultImage();
        }

        return this.renderImageInput();
    }

    hasFile(): boolean {
        const {state} = this;
        const {file} = state;

        return Boolean(file);
    }

    hasDefaultValue(): boolean {
        const {state} = this;
        const {defaultValue} = state;

        return Boolean(defaultValue);
    }

    getWrapperClassName(): string {
        const {props, state} = this;
        const {isUploadInProgress} = state;
        const {errorList} = props;

        return classNames(inputUploadFileStyle.input_upload_file__wrapper, {
            [inputUploadFileStyle.input_upload_file__wrapper__with_file]: this.hasFile() || this.hasDefaultValue(),
            [fieldStyle.form__input__invalid]: errorList.length > 0,
            [inputUploadFileStyle.input_upload_file__wrapper__upload_in_progress]: isUploadInProgress,
        });
    }

    render(): Node {
        const {props} = this;
        const {labelText, defaultValue, uploadFile} = props;

        if (!isString(defaultValue) && !isNull(defaultValue)) {
            console.error('InputUploadFile: String or Null Support Only');
            return null;
        }

        if (!isFunction(uploadFile)) {
            console.error('InputUploadFile: uploadFile should be a function');
            return null;
        }

        return (
            <div className={inputUploadFileStyle.input_upload_file__label_wrapper}>
                {labelText ? <span className={fieldStyle.form__label_description}>{labelText}</span> : null}
                <div className={this.getWrapperClassName()}>{this.renderContent()}</div>
            </div>
        );
    }
}
