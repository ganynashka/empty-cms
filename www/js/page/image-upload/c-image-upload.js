// @flow

import React, {Component, type Node} from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography/Typography';
import Paper from '@material-ui/core/Paper';

import mainWrapperStyle from '../../component/main-wrapper/main-wrapper.style.scss';
import {fileApiConst} from '../../../../server/src/api/file-const';
import {FormGenerator} from '../../component/layout/form-generator/form-generator';
import type {FormGeneratorConfigType, FormGeneratorFormDataType} from '../../component/layout/form-generator/type';
import {getIsRequired} from '../../component/layout/form-generator/validate/validate';
import {FieldSet} from '../../component/layout/form-generator/field/field-set/field-set';
import {InputFileList} from '../../component/layout/form-generator/field/input-file-list/c-input-file-list';
import {ButtonListWrapper} from '../../component/layout/button-list-wrapper/c-button-list-wrapper';
import {FormButton} from '../../component/layout/form-button/c-form-button';
import {isError} from '../../lib/is';
import type {SnackbarPortalContextType} from '../../component/layout/snackbar/snackbar-portal/c-snackbar-portal';

import {uploadImageList} from './image-api';

type PropsType = {
    +snackbarPortalContext: SnackbarPortalContextType,
};

type StateType = {
    formGeneratorKey: number,
};

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
                    content: null,
                    isHidden: false,
                    isMultiple: true,
                    accept: 'image/*',
                },
            ],
            fieldSetWrapper: {
                component: FieldSet,
                legend: null,
            },
        },
    ],
};

export class ImageUpload extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            formGeneratorKey: 1,
        };
    }

    handleFormSubmit = async (formData: FormGeneratorFormDataType) => {
        const {props, state} = this;
        const {formGeneratorKey} = state;
        const {snackbarPortalContext} = props;
        const snackBarId = 'file-list-snack-bar-id-' + String(Date.now());
        const {showSnackbar} = snackbarPortalContext;

        const mayBeFileList = formData[fileApiConst.fileListFormPropertyName];

        const fileList: Array<File> = Array.isArray(mayBeFileList) ? mayBeFileList : [];

        const uploadImageResult = await uploadImageList(fileList);

        if (isError(uploadImageResult)) {
            await showSnackbar({children: uploadImageResult.message, variant: 'error'}, snackBarId);
            return;
        }

        if (uploadImageResult.isSuccessful !== true) {
            await showSnackbar({children: uploadImageResult.errorList.join(','), variant: 'error'}, snackBarId);
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

    handleFormError = async (errorList: Array<Error>) => {
        const {props} = this;
        const {snackbarPortalContext} = props;
        const snackBarId = 'document-create-snack-bar-id-' + String(Date.now());
        const {showSnackbar} = snackbarPortalContext;

        console.log('handleFormError', errorList);
        await showSnackbar({children: 'Fill all required fields properly!', variant: 'error'}, snackBarId);
    };

    render(): Node {
        const {state} = this;

        return (
            <Paper className={mainWrapperStyle.paper_wrapper}>
                <Toolbar>
                    <Typography variant="h5">Upload image list</Typography>
                </Toolbar>
                <FormGenerator
                    config={formConfig}
                    footer={this.renderFormFooter()}
                    key={state.formGeneratorKey}
                    onError={this.handleFormError}
                    onSubmit={this.handleFormSubmit}
                />
            </Paper>
        );

        /*
                return (
                    <Paper className={mainWrapperStyle.paper_wrapper}>
                        <Toolbar>
                            <Typography variant="h5">Upload image</Typography>
                        </Toolbar>
                        <form action={fileApiRouteMap.uploadImageList} encType="multipart/form-data" method="post">
                            <input multiple name={fileApiConst.fileListFormPropertyName} type="file"/>
                            <input type="submit"/>
                        </form>
                    </Paper>
                );
        */
    }
}
