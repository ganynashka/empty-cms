// @flow

/* global alert */

import React, {Component, type Node} from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography/Typography';
import {Paper} from '@material-ui/core';

import {FormGenerator} from '../../component/layout/form-generator/form-generator';
import type {FormGeneratorConfigType} from '../../component/layout/form-generator/type';
import {FieldSet} from '../../component/layout/form-generator/field/field-set/field-set';
import {InputText} from '../../component/layout/form-generator/field/input-text/c-input-text';
import {InputIntNumber} from '../../component/layout/form-generator/field/input-int-number/c-input-int-number';
import {getIsRequired, noValidate} from '../../component/layout/form-generator/validate/validate';
import {ButtonListWrapper} from '../../component/layout/button-list-wrapper/c-button-list-wrapper';
import {FormButton} from '../../component/layout/form-button/c-form-button';
import type {MongoDocumentType, MongoDocumentTypeType} from '../../../../server/src/db/type';
import {getSlug, stringToArray} from '../../component/layout/form-generator/field/input-text/input-text-helper';
import {typeConverter} from '../../lib/type';
import {InputSelect} from '../../component/layout/form-generator/field/input-select/c-input-select';
import {InputTextArea} from '../../component/layout/form-generator/field/input-text-area/c-input-text-area';
import mainWrapperStyle from '../../component/main-wrapper/main-wrapper.style.scss';
import {isError} from '../../lib/is';

import {createDocument} from './document-list-api';

type PropsType = {};
type StateType = null;

export type FormDataMongoDocumentType = {
    +slug: string,
    +type: MongoDocumentTypeType,
    +title: string,
    +content: string,
    // +createdDate: number,
    // +updatedDate: number,
    +subDocumentList: string, // list of slug
    +tagList: string,
    // +rating: number,
};

const formConfig: FormGeneratorConfigType = {
    fieldSetList: [
        {
            name: 'document create/edit',
            fieldList: [
                {
                    name: 'slug',
                    fieldComponent: InputText,
                    validate: getIsRequired,
                    defaultValue: '',
                    placeholder: 'the-slug-or-id-of-document',
                    labelText: 'Slug',
                    content: null,
                },
                {
                    name: 'type',
                    fieldComponent: InputSelect,
                    validate: getIsRequired,
                    defaultValue: 'article',
                    placeholder: 'Type: article or container',
                    labelText: 'Type',
                    content: [
                        <option key="article" value="article">
                            article
                        </option>,
                        <option key="container" value="container">
                            container
                        </option>,
                    ],
                },
                {
                    name: 'title',
                    fieldComponent: InputText,
                    validate: getIsRequired,
                    defaultValue: '',
                    placeholder: 'Title',
                    labelText: 'Title',
                    content: null,
                },
                {
                    name: 'content',
                    fieldComponent: InputTextArea,
                    validate: getIsRequired,
                    defaultValue: '',
                    placeholder: 'Content',
                    labelText: 'Content',
                    content: null,
                },
                {
                    name: 'createdDate',
                    fieldComponent: InputIntNumber,
                    validate: noValidate,
                    defaultValue: 0,
                    placeholder: 'createdDate',
                    labelText: 'createdDate',
                    content: null,
                },
                {
                    name: 'updatedDate',
                    fieldComponent: InputIntNumber,
                    validate: noValidate,
                    defaultValue: 0,
                    placeholder: 'updatedDate',
                    labelText: 'updatedDate',
                    content: null,
                },
                {
                    name: 'tagList',
                    fieldComponent: InputText,
                    validate: noValidate,
                    defaultValue: '',
                    placeholder: 'tagList',
                    labelText: 'tagList',
                    content: null,
                },
                {
                    name: 'rating',
                    fieldComponent: InputIntNumber,
                    validate: noValidate,
                    defaultValue: 0,
                    placeholder: 'rating',
                    labelText: 'rating',
                    content: null,
                },
                {
                    name: 'subDocumentList',
                    fieldComponent: InputText,
                    validate: noValidate,
                    defaultValue: '',
                    placeholder: 'Sub document list',
                    labelText: 'Sub document list',
                    content: null,
                },
            ],
            fieldSetWrapper: {
                component: FieldSet,
                legend: null,
            },
        },
    ],
};

export class DocumentCreate extends Component<PropsType, StateType> {
    handleFormSubmit = async (formData: {}) => {
        const documentData: FormDataMongoDocumentType = typeConverter<FormDataMongoDocumentType>(formData);

        const endDocumentData: MongoDocumentType = {
            slug: getSlug(documentData.slug),
            type: documentData.type,
            title: documentData.title,
            content: documentData.content,
            createdDate: 0,
            updatedDate: 0,
            rating: 0,
            tagList: stringToArray(documentData.tagList, ','),
            subDocumentList: stringToArray(documentData.subDocumentList, ','),
        };

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
