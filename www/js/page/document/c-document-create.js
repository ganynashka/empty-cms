// @flow

/* global window */

import React, {Component, type Node} from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography/Typography';
import Paper from '@material-ui/core/Paper';

import {FormGenerator} from '../../component/layout/form-generator/form-generator';
import {ButtonListWrapper} from '../../component/layout/button-list-wrapper/c-button-list-wrapper';
import {FormButton} from '../../component/layout/form-button/c-form-button';
import type {MongoDocumentType} from '../../../../server/src/db/type';
import mainWrapperStyle from '../../component/main-wrapper/main-wrapper.scss';
import {isError} from '../../lib/is';
import type {FormGeneratorConfigType, FormGeneratorFormDataType} from '../../component/layout/form-generator/type';
import type {SnackbarContextType} from '../../provider/snackbar/snackbar-context-type';
import {routePathMap} from '../../component/app/routes-path-map';

import {createDocument} from './document-api';
import {formDataToMongoDocument, getDocumentFormConfig} from './document-helper';

type PropsType = {
    +snackbarPortalContext: SnackbarContextType,
};
type StateType = null;

const formConfig: FormGeneratorConfigType = getDocumentFormConfig();

export class DocumentCreate extends Component<PropsType, StateType> {
    handleFormSubmit = async (formData: FormGeneratorFormDataType) => {
        const {props} = this;
        const {snackbarPortalContext} = props;
        const snackBarId = 'document-create-snack-bar-id-' + String(Date.now());
        const {showSnackbar} = snackbarPortalContext;

        const endDocumentData: MongoDocumentType | Error = await formDataToMongoDocument(formData);

        if (isError(endDocumentData)) {
            console.error(endDocumentData);
            return;
        }

        const createDocumentResult = await createDocument(endDocumentData);

        if (isError(createDocumentResult)) {
            await showSnackbar({children: createDocumentResult.message, variant: 'error'}, snackBarId);
            return;
        }

        if (createDocumentResult.isSuccessful !== true) {
            await showSnackbar({children: createDocumentResult.errorList.join(', '), variant: 'error'}, snackBarId);
            return;
        }

        window.setTimeout(() => {
            window.location.href = routePathMap.documentEdit.staticPartPath + '/' + endDocumentData.slug;
        }, 3e3);

        await showSnackbar({children: 'Document has been created!', variant: 'success'}, snackBarId);
    };

    renderFormFooter(): Node {
        return (
            <ButtonListWrapper direction="right">
                <FormButton type="submit">Create</FormButton>
            </ButtonListWrapper>
        );
    }

    handleFormError = async (errorList: Array<Error>, formData: FormGeneratorFormDataType) => {
        const {props} = this;
        const {snackbarPortalContext} = props;
        const snackBarId = 'document-create-snack-bar-id-' + String(Date.now());
        const {showSnackbar} = snackbarPortalContext;

        console.log(formData);

        console.log('handleFormError', errorList);
        await showSnackbar({children: 'Fill all required fields properly!', variant: 'error'}, snackBarId);
    };

    render(): Node {
        return (
            <Paper className={mainWrapperStyle.paper_wrapper}>
                <Toolbar>
                    <Typography variant="h5">Create a Document</Typography>
                </Toolbar>
                <FormGenerator
                    config={formConfig}
                    footer={this.renderFormFooter()}
                    onError={this.handleFormError}
                    onSubmit={this.handleFormSubmit}
                />
            </Paper>
        );
    }
}
