// @flow

/* global window */

import React, {Component, type Node} from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography/Typography';
import Paper from '@material-ui/core/Paper';

import {FormGenerator} from '../../../component/layout/form-generator/form-generator';
import {ButtonListWrapper} from '../../../component/layout/button-list-wrapper/c-button-list-wrapper';
import {FormButton} from '../../../component/layout/form-button/c-form-button';
import type {MongoDocumentType} from '../../../../../server/src/database/database-type';
import mainWrapperStyle from '../../../component/main-wrapper/main-wrapper.scss';
import {isError} from '../../../lib/is';
import type {
    FormGeneratorConfigType,
    FormGeneratorFormDataType,
} from '../../../component/layout/form-generator/form-generator-type';
import type {SnackbarContextType} from '../../../provider/snackbar/snackbar-context-type';
import {routePathMap} from '../../../component/app/routes-path-map';
import type {RouterHistoryType} from '../../../type/react-router-dom-v5-type-extract';
import type {UserContextConsumerType} from '../../../provider/user/user-context-type';

import {createDocument} from './document-api';
import {formDataToMongoDocument, getDocumentFormConfig} from './document-helper';

type PropsType = {
    +history: RouterHistoryType,
    +snackbarContext: SnackbarContextType,
    +userContextData: UserContextConsumerType,
};
type StateType = null;

const formConfig: FormGeneratorConfigType = getDocumentFormConfig();

export class DocumentCreate extends Component<PropsType, StateType> {
    handleFormSubmit = async (formData: FormGeneratorFormDataType) => {
        const {props} = this;
        const {snackbarContext, history} = props;
        const snackBarId = 'document-create-snack-bar-id-' + String(Date.now());
        const {showSnackbar} = snackbarContext;

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

        history.push(routePathMap.documentEdit.staticPartPath + '/' + endDocumentData.slug);

        await showSnackbar({children: 'Document has been created!', variant: 'success'}, snackBarId);
    };

    renderFormFooter(): Node {
        return (
            <ButtonListWrapper direction="right">
                <FormButton accessKey="s" type="submit">
                    Create [S]
                </FormButton>
            </ButtonListWrapper>
        );
    }

    handleFormError = async (errorList: Array<Error>, formData: FormGeneratorFormDataType) => {
        const {props} = this;
        const {snackbarContext} = props;
        const snackBarId = 'document-create-snack-bar-id-' + String(Date.now());
        const {showSnackbar} = snackbarContext;

        console.log(formData);

        console.log('handleFormError', errorList);
        await showSnackbar({children: 'Fill all required fields properly!', variant: 'error'}, snackBarId);
    };

    render(): Node {
        const {props} = this;
        const {userContextData} = props;

        /*
        if (!isAdmin(userContextData)) {
            return null;
        }
*/

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
