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
import {typeConverter} from '../../lib/type';
import type {MatchType} from '../../type/react-router-dom-v5-type-extract';

import {createDocument, documentSearchExact} from './document-api';
import {formDataToMongoDocument, getDocumentFormConfig} from './helper';

type PropsType = {
    +match: MatchType | null,
};

type StateType = {|
    +mongoDocument: MongoDocumentType | null,
|};

export class DocumentEdit extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            mongoDocument: null,
        };
    }

    async componentDidMount() {
        this.fetchDocument();
    }

    async fetchDocument() {
        const {props} = this;
        const {match} = props;

        if (match === null) {
            console.error('DocumentEdit props.match is not defined!');
            return;
        }

        const {slug} = match.params;

        const {data, errorList} = await documentSearchExact('slug', String(slug));

        if (errorList.length > 0) {
            alert(errorList.join(','));
            return;
        }

        const mongoDocument: MongoDocumentType = typeConverter<MongoDocumentType>(data);

        this.setState({mongoDocument});
    }

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

    getFormConfig(): FormGeneratorConfigType {
        const {state} = this;
        const rawFormConfig: FormGeneratorConfigType = getDocumentFormConfig();
        const {mongoDocument} = state;

        if (mongoDocument === null) {
            return rawFormConfig;
        }

        return {
            ...rawFormConfig,
            fieldSetList: [
                {
                    ...rawFormConfig.fieldSetList[0],
                    fieldList: extendFieldList(rawFormConfig.fieldSetList[0].fieldList, {
                        slug: {defaultValue: mongoDocument.slug},
                        type: {defaultValue: mongoDocument.type},
                        title: {defaultValue: mongoDocument.title},
                        content: {defaultValue: mongoDocument.content},
                        subDocumentList: {defaultValue: mongoDocument.subDocumentList.join(', ')},
                        tagList: {defaultValue: mongoDocument.tagList.join(', ')},
                        rating: {defaultValue: mongoDocument.rating, isHidden: false},
                    }),
                },
            ],
        };
    }

    render(): Node {
        const {state} = this;
        const {mongoDocument} = state;

        if (mongoDocument === null) {
            return (
                <Paper className={mainWrapperStyle.paper_wrapper}>
                    <Toolbar>
                        <Typography variant="h5">Document loading...</Typography>
                    </Toolbar>
                </Paper>
            );
        }

        return (
            <Paper className={mainWrapperStyle.paper_wrapper}>
                <Toolbar>
                    <Typography variant="h5">Edit a Document</Typography>
                </Toolbar>
                <FormGenerator
                    config={this.getFormConfig()}
                    footer={this.renderFormFooter()}
                    onError={this.handleFormError}
                    onSubmit={this.handleFormSubmit}
                />
            </Paper>
        );
    }
}
