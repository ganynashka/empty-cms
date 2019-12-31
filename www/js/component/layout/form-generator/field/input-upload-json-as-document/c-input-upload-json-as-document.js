// @flow

/* global URL, navigator, FileReader */

import React, {Component, type Node} from 'react';
import classNames from 'classnames';

import type {InputComponentPropsType, FromGeneratorInputValueType} from '../../form-generator-type';
import fieldStyle from '../field.scss';
import {isError, isNull, isString} from '../../../../../lib/is';
import type {MainServerApiResponseType} from '../../../../../type/response';

import {typeConverter} from '../../../../../lib/type';

import spinnerImage from './image/spinner.gif';
import inputUploadFileStyle from './input-upload-file.scss';
import {uploadJsonAsDocument} from './input-upload-json-as-document-api';
import type {JsonToMongoDocumentType} from './input-upload-json-as-document-type';

type PropsType = InputComponentPropsType;

type StateType = {
    file: File | null,
    isUploadInProgress: boolean,
    defaultValue: FromGeneratorInputValueType,
    refreshKey: number,
};

export class InputUploadJsonAsDocument extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            file: null,
            isUploadInProgress: false,
            defaultValue: props.defaultValue,
            refreshKey: 1,
        };
    }

    getDefaultState(): StateType {
        const {state} = this;

        return {
            file: null,
            isUploadInProgress: false,
            defaultValue: '',
            refreshKey: state.refreshKey + 1,
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

        if (isNull(fileOrNull)) {
            onChange(null);
            this.setState(this.getDefaultState());
            return;
        }

        const reader = new FileReader();

        reader.addEventListener('load', () => {
            const readerResult: JsonToMongoDocumentType = typeConverter<JsonToMongoDocumentType>(
                // $FlowFixMe
                JSON.parse(reader.result)
            );

            uploadJsonAsDocument(readerResult)
                .then(async (result: Error | MainServerApiResponseType): Promise<boolean> => {
                    if (isError(result)) {
                        this.setState(this.getDefaultState());
                        console.error(result.message);
                        return false;
                    }

                    if (result.isSuccessful !== true) {
                        this.setState(this.getDefaultState());
                        console.error(result.errorList.join('\n'));
                        return false;
                    }

                    console.log('---> success');
                    this.setState(this.getDefaultState());

                    await showSnackbar({children: 'Success!', variant: 'success'}, 'upload-file-success');

                    return true;
                })
                .catch(async (error: Error) => {
                    this.setState(this.getDefaultState());

                    await showSnackbar({children: 'Error while upload file!', variant: 'error'}, 'can-not-upload-file');

                    console.error(error.message);
                });
        });

        reader.readAsText(fileOrNull);
    };

    handleRemoveImage = () => {
        const {props} = this;
        const {onChange} = props;

        onChange(null);
        this.setState(this.getDefaultState());
    };

    renderFileInput(): Node {
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

    renderUploadedFile(): Node {
        const {state} = this;
        const {file} = state;

        if (!file) {
            console.error('There is should be a file!');
            return null;
        }

        return (
            <span className={inputUploadFileStyle.input_upload_file__spinner__wrapper}>
                <img alt="" className={inputUploadFileStyle.input_upload_file__spinner} src={spinnerImage}/>
            </span>
        );
    }

    renderDefaultFile(): Node {
        const {state} = this;
        const {defaultValue} = state;

        if (!isString(defaultValue)) {
            console.error('defaultValue should be a string!');
            return null;
        }

        return (
            <button
                className={inputUploadFileStyle.input_upload_file__remove_file}
                onClick={this.handleRemoveImage}
                type="button"
            >
                &#10005;
            </button>
        );
    }

    renderContent(): Node {
        if (this.hasFile()) {
            return this.renderUploadedFile();
        }

        if (this.hasDefaultValue()) {
            return this.renderDefaultFile();
        }

        return this.renderFileInput();
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
        const {props, state} = this;
        const {refreshKey} = state;
        const {labelText, defaultValue} = props;

        if (!isString(defaultValue) && !isNull(defaultValue)) {
            console.error('InputUploadFile: String or Null Support Only');
            return null;
        }

        return (
            <div className={inputUploadFileStyle.input_upload_file__label_wrapper} key={refreshKey}>
                <span className={fieldStyle.form__label_description}>{labelText}</span>
                <div className={this.getWrapperClassName()}>{this.renderContent()}</div>
            </div>
        );
    }
}
