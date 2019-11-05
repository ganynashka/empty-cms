// @flow

/* global alert */

import React, {Component, type Node} from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography/Typography';
import {Paper} from '@material-ui/core';

import {FormGenerator} from '../../component/layout/form-generator/form-generator';
import {ButtonListWrapper} from '../../component/layout/button-list-wrapper/c-button-list-wrapper';
import {FormButton} from '../../component/layout/form-button/c-form-button';
import type {MongoDocumentType, MongoDocumentTypeType} from '../../../../server/src/db/type';
import mainWrapperStyle from '../../component/main-wrapper/main-wrapper.style.scss';
import {isError} from '../../lib/is';
import type {FormGeneratorConfigType} from '../../component/layout/form-generator/type';

import {createDocument} from './document-api';
import {formDataToMongoDocument, getDocumentFormConfig} from './helper';

type PropsType = {};
type StateType = null;

const formConfig: FormGeneratorConfigType = getDocumentFormConfig();

export class DocumentCreate extends Component<PropsType, StateType> {
    handleFormSubmit = async (formData: {}) => {
        const endDocumentData: MongoDocumentType = formDataToMongoDocument(formData);

        const createDocumentResult = await createDocument(endDocumentData);

        if (isError(createDocumentResult)) {
            alert(createDocumentResult.message);
            return;
        }

        if (createDocumentResult.isSuccessful !== true) {
            alert(createDocumentResult.errorList.join(','));
            return;
        }

        alert('Document created!');
    };

    renderFormFooter(): Node {
        return (
            <ButtonListWrapper direction="right">
                <FormButton type="submit">Create</FormButton>
            </ButtonListWrapper>
        );
    }

    handleFormError = (errorList: Array<Error>) => {
        console.log('handleFormError', errorList);
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
