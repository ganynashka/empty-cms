// @flow

import React, {Component, type Node} from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography/Typography';
import Paper from '@material-ui/core/Paper';

// eslint-disable-next-line max-len
import {InputUploadJsonAsDocument} from '../../../component/layout/form-generator/field/input-upload-json-as-document/c-input-upload-json-as-document';
import mainWrapperStyle from '../../../component/main-wrapper/main-wrapper.scss';
import {fileApiConst} from '../../../../../server/src/api/part/file-api-const';
import {FormGenerator} from '../../../component/layout/form-generator/form-generator';
import type {
    FormGeneratorConfigType,
    FormGeneratorFormDataType,
    FromGeneratorInputValueType,
} from '../../../component/layout/form-generator/form-generator-type';
import {getIsRequired, noValidate} from '../../../component/layout/form-generator/validate/validate';
import {FieldSet} from '../../../component/layout/form-generator/field/field-set/field-set';
import {InputFileList} from '../../../component/layout/form-generator/field/input-file-list/c-input-file-list';
import {ButtonListWrapper} from '../../../component/layout/button-list-wrapper/c-button-list-wrapper';
import {FormButton} from '../../../component/layout/form-button/c-form-button';
import {isError, isFile} from '../../../lib/is';
import type {SnackbarContextType} from '../../../provider/snackbar/snackbar-context-type';
import type {UserContextType} from '../../../provider/user/user-context-type';

import {uploadFileList} from './file-api';

type PropsType = {
    +snackbarContext: SnackbarContextType,
    +userContextData: UserContextType,
};

type StateType = {|
    +formGeneratorKey: number,
|};

const formConfig: FormGeneratorConfigType = {
    fieldSetList: [
        {
            name: 'upload file list',
            fieldList: [
                {
                    name: fileApiConst.fileListFormPropertyName,
                    fieldComponent: InputFileList,
                    validate: getIsRequired,
                    defaultValue: null,
                    placeholder: 'File list',
                    labelText: 'File list',
                    isHidden: false,
                    isMultiple: true,
                    accept: '*',
                },
            ],
            fieldSetWrapper: {
                component: FieldSet,
                legend: null,
            },
        },
    ],
};

const formUploadJsonConfig: FormGeneratorConfigType = {
    fieldSetList: [
        {
            name: 'upload file list',
            fieldList: [
                {
                    name: 'json-to-document',
                    fieldComponent: InputUploadJsonAsDocument,
                    validate: noValidate,
                    defaultValue: null,
                    placeholder: 'JSON to Document',
                    labelText: 'JSON to Document',
                    isHidden: false,
                    isMultiple: true,
                    accept: '*',
                },
            ],
            fieldSetWrapper: {
                component: FieldSet,
                legend: null,
            },
        },
    ],
};

export class FileUpload extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            formGeneratorKey: 1,
        };
    }

    handleFormSubmit = async (formData: FormGeneratorFormDataType) => {
        const {props, state} = this;
        const {formGeneratorKey} = state;
        const {snackbarContext} = props;
        const snackBarId = 'file-list-snack-bar-id-' + String(Date.now());
        const {showSnackbar} = snackbarContext;

        const formFileList = formData[fileApiConst.fileListFormPropertyName];

        if (!Array.isArray(formFileList)) {
            console.error('Must be list of files');
            return;
        }

        const fileList: Array<File> = [];

        // $FlowFixMe
        formFileList.forEach((value: FromGeneratorInputValueType) => {
            if (isFile(value)) {
                fileList.push(value);
            }
        });

        const uploadFileResult = await uploadFileList(fileList);

        if (isError(uploadFileResult)) {
            await showSnackbar({children: uploadFileResult.message, variant: 'error'}, snackBarId);
            return;
        }

        this.setState({formGeneratorKey: formGeneratorKey + 1});

        await showSnackbar({children: 'File upload successfully!', variant: 'success'}, snackBarId);
    };

    renderFormFooter(): Node {
        return (
            <ButtonListWrapper direction="right">
                <FormButton type="submit">Upload file list</FormButton>
            </ButtonListWrapper>
        );
    }

    renderFormFooterJSON(): Node {
        return null;
    }

    handleFormError = async (errorList: Array<Error>, formData: FormGeneratorFormDataType) => {
        const {props} = this;
        const {snackbarContext} = props;
        const snackBarId = 'document-create-snack-bar-id-' + String(Date.now());
        const {showSnackbar} = snackbarContext;

        console.log('handleFormError', errorList);
        await showSnackbar({children: 'Fill all required fields properly!', variant: 'error'}, snackBarId);
    };

    render(): Node {
        const {state, props} = this;
        const {userContextData} = props;

        /*
        if (!getIsAdmin(userContextData)) {
            return null;
        }
*/

        return (
            <Paper className={mainWrapperStyle.paper_wrapper}>
                <Toolbar>
                    <Typography variant="h5">Upload file</Typography>
                </Toolbar>
                <FormGenerator
                    config={formConfig}
                    footer={this.renderFormFooter()}
                    key={state.formGeneratorKey}
                    onError={this.handleFormError}
                    onSubmit={this.handleFormSubmit}
                />
                <FormGenerator
                    config={formUploadJsonConfig}
                    footer={this.renderFormFooterJSON()}
                    key={-state.formGeneratorKey}
                    onError={this.handleFormError}
                    onSubmit={this.handleFormSubmit}
                />
            </Paper>
        );
    }
}
