// @flow

import React, {Component, type Node} from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography/Typography';
import Paper from '@material-ui/core/Paper';

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
import {Spinner} from '../../component/layout/spinner/c-spinner';
import type {SnackbarPortalContextType} from '../../component/layout/snackbar/snackbar-portal/c-snackbar-portal';

import {documentSearchExact, updateDocument} from './document-api';
import {formDataToMongoDocument, getDocumentFormConfig} from './helper';

type PropsType = {
    +match: MatchType | null,
    +snackbarPortalContext: SnackbarPortalContextType,
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
        const {match, snackbarPortalContext} = props;
        const {showSnackbar} = snackbarPortalContext;

        if (match === null) {
            console.error('DocumentEdit props.match is not defined!');
            return;
        }

        const {slug} = match.params;

        const {data, errorList} = await documentSearchExact('slug', String(slug));

        if (errorList.length > 0) {
            await showSnackbar({children: errorList.join(','), variant: 'error'}, errorList.join(','));
            return;
        }

        const mongoDocument: MongoDocumentType = typeConverter<MongoDocumentType>(data);

        this.setState({mongoDocument});
    }

    handleFormSubmit = async (formData: {}) => {
        const {props} = this;
        const {snackbarPortalContext} = props;
        const {showSnackbar} = snackbarPortalContext;
        const snackBarId = 'document-saved-snack-bar-id-' + String(Date.now());
        const endDocumentData: MongoDocumentType = formDataToMongoDocument(formData);
        const updateDocumentResult = await updateDocument(endDocumentData);

        if (isError(updateDocumentResult)) {
            await showSnackbar({children: updateDocumentResult.message, variant: 'error'}, snackBarId);
            return;
        }

        if (updateDocumentResult.isSuccessful !== true) {
            await showSnackbar({children: updateDocumentResult.errorList.join(','), variant: 'error'}, snackBarId);
            return;
        }

        await showSnackbar({children: 'Document has been updated!', variant: 'success'}, snackBarId);
    };

    renderFormFooter(): Node {
        return (
            <ButtonListWrapper direction="right">
                <FormButton type="submit">Save</FormButton>
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
                    <Spinner/>
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
