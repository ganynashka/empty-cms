// @flow

/* global URL, navigator */

import React, {Component, type Node} from 'react';
import classNames from 'classnames';

import type {InputComponentPropsType, InputValueType} from '../../type';
import fieldStyle from '../field.style.scss';

import {getMarkdownResizedImage} from '../../../../../page/image/image-api';
import {promiseCatch} from '../../../../../lib/promise';
import {isError, isFunction, isNull, isString} from '../../../../../lib/is';
import {PopupHeader} from '../../../popup/popup-header/c-popup-header';
import {PopupContent} from '../../../popup/popup-content/c-popup-content';

import inputUploadImageStyle from './input-upload-image.style.scss';

type PropsType = InputComponentPropsType;

type StateType = {
    file: File | null,
    defaultValue: InputValueType,
};

export class InputUploadImage extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            file: null,
            defaultValue: props.defaultValue,
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
        const {onChange, uploadFile} = props;
        const fileOrNull = this.getValue(evt);

        if (!isFunction(uploadFile)) {
            console.error('InputUploadImage: uploadFile should be a function');
            return;
        }

        if (isNull(fileOrNull)) {
            onChange(fileOrNull);
            // eslint-disable-next-line react/no-set-state
            this.setState({file: fileOrNull});
            return;
        }

        uploadFile(fileOrNull)
            .then((uploadResult: Error | string): Error | string => {
                if (isError(uploadResult)) {
                    console.error('Can not upload image');
                    console.error(uploadResult);
                    return uploadResult;
                }

                onChange(fileOrNull);
                // eslint-disable-next-line react/no-set-state
                this.setState({defaultValue: uploadResult});

                return uploadResult;
            })
            .catch((error: Error): Error => {
                console.error('Can not upload image');
                console.error(error);
                return error;
            });
    };

    handleRemoveImage = () => {
        const {props} = this;
        const {onChange} = props;
        const nullFile = null;

        onChange(nullFile);

        // eslint-disable-next-line react/no-set-state
        this.setState({file: nullFile, defaultValue: ''});
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
        const {file} = state;

        if (!file) {
            console.error('There is should be a file!');
            return null;
        }

        return (
            <>
                <button
                    className={inputUploadImageStyle.input_upload_image__remove_file}
                    onClick={this.handleRemoveImage}
                    type="button"
                >
                    &#10005;
                </button>
                <button
                    className={inputUploadImageStyle.input_upload_image__full_button}
                    onClick={this.handleShowHowToUse}
                    type="button"
                >
                    <img
                        alt=""
                        className={inputUploadImageStyle.input_upload_image__uploaded_file}
                        src={URL.createObjectURL(file)}
                    />
                </button>
            </>
        );
    }

    renderHowToUseContent(): Node {
        const {props} = this;
        const {popupPortalContext} = props;
        const {hidePopupById} = popupPortalContext;
        const howToUsePopupId = 'how-to-use-popup-id';

        return [
            <PopupHeader closeButton={{onClick: (): mixed => hidePopupById(howToUsePopupId, null)}} key="header">
                How to use
            </PopupHeader>,
            <PopupContent key="content">
                <p>You can not add to document not upload image!</p>
                <br/>
                <p>Instruction:</p>
                <br/>
                <p>1 - Save document, all not uploaded images will upload</p>
                <p>2 - Refresh page</p>
                <p>3 - Click to needed image to get markdown code</p>
            </PopupContent>,
        ];
    }

    handleShowHowToUse = async () => {
        const {props} = this;
        const {popupPortalContext} = props;
        const {showPopup} = popupPortalContext;
        const howToUsePopupId = 'how-to-use-popup-id';

        await showPopup({children: this.renderHowToUseContent()}, howToUsePopupId);
    };

    handleCopyImageSrc = async () => {
        const {state, props} = this;
        const {snackbarPortalContext} = props;
        const {defaultValue} = state;
        const snackBarId = 'copy-image-markdown-snack-bar-id-' + String(Date.now());
        const {showSnackbar} = snackbarPortalContext;

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
                <button
                    className={inputUploadImageStyle.input_upload_image__full_button}
                    onClick={this.handleCopyImageSrc}
                    type="button"
                >
                    <img alt="" className={inputUploadImageStyle.input_upload_image__uploaded_file} src={src}/>
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

    render(): Node {
        const {props} = this;
        const {labelText, errorList, defaultValue, uploadFile} = props;

        if (!isString(defaultValue) && !isNull(defaultValue)) {
            console.error('InputUploadImage: String or Null Support Only');
            return null;
        }

        if (!isFunction(uploadFile)) {
            console.error('InputUploadImage: uploadFile should be a function');
            return null;
        }

        return (
            <div className={fieldStyle.form__label_wrapper}>
                <span className={fieldStyle.form__label_description}>{labelText}</span>
                <div
                    className={classNames(inputUploadImageStyle.input_upload_image__wrapper, {
                        [inputUploadImageStyle.input_upload_image__wrapper__with_image]:
                            this.hasFile() || this.hasDefaultValue(),
                        [fieldStyle.form__input__invalid]: errorList.length > 0,
                    })}
                >
                    {this.renderContent()}
                </div>
            </div>
        );
    }
}
