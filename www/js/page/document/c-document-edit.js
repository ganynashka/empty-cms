// @flow

/* global alert */

import React, {Component, type Node} from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography/Typography';
import {Paper} from '@material-ui/core';

import {FormGenerator} from '../../component/layout/form-generator/form-generator';
import type {FormGeneratorConfigType} from '../../component/layout/form-generator/type';
import {ButtonListWrapper} from '../../component/layout/button-list-wrapper/c-button-list-wrapper';
import {FormButton} from '../../component/layout/form-button/c-form-button';
import type {MongoDocumentType} from '../../../../server/src/db/type';
import {isError} from '../../lib/is';
import mainWrapperStyle from '../../component/main-wrapper/main-wrapper.style.scss';
import {extendFieldList} from '../../component/layout/form-generator/form-generator-util';

import {createDocument} from './document-api';
import {formDataToMongoDocument, getDocumentFormConfig} from './helper';

type PropsType = {};
type StateType = null;

const rawFormConfig: FormGeneratorConfigType = getDocumentFormConfig();

const formConfig: FormGeneratorConfigType = {
    ...rawFormConfig,
    fieldSetList: [
        {
            ...rawFormConfig.fieldSetList[0],
            fieldList: extendFieldList(rawFormConfig.fieldSetList[0].fieldList, {
                slug: {
                    defaultValue: 1,
                },
            }),
        },
    ],
};

export class DocumentEdit extends Component<PropsType, StateType> {
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

        alert('Document saved!');
    };

    renderFormFooter(): Node {
        return (
            <ButtonListWrapper direction="right">
                <FormButton type="submit">Save</FormButton>
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
                    <Typography variant="h5">Edit a Document</Typography>
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
