// @flow

import React, {Component, Fragment, type Node} from 'react';
import {Link} from 'react-router-dom';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography/Typography';
import Paper from '@material-ui/core/Paper';

import {FormGenerator} from '../../../component/layout/form-generator/form-generator';
import type {
    FormGeneratorConfigType,
    FormGeneratorFormDataType,
} from '../../../component/layout/form-generator/form-generator-type';
import {ButtonListWrapper} from '../../../component/layout/button-list-wrapper/c-button-list-wrapper';
import {FormButton} from '../../../component/layout/form-button/c-form-button';
import type {MongoDocumentType} from '../../../../../server/src/database/database-type';
import {isError} from '../../../lib/is';
import mainWrapperStyle from '../../../component/main-wrapper/main-wrapper.scss';
import {extendFieldList} from '../../../component/layout/form-generator/form-generator-helper';
import {typeConverter} from '../../../lib/type';
import type {MatchType} from '../../../type/react-router-dom-v5-type-extract';
import {Spinner} from '../../../component/layout/spinner/c-spinner';
import type {SnackbarContextType} from '../../../provider/snackbar/snackbar-context-type';
import {extractUniqueArrayString, getLinkToEditArticle, getLinkToReadArticle} from '../../../lib/string';
import type {UserContextType} from '../../../provider/user/user-context-type';
import {rootDocumentSlug} from '../../../../../server/src/api/part/document-api-const';

import {documentSearchExact, getDocumentParentList, updateDocument} from './document-api';
import {formDataToMongoDocument, getDocumentFormConfig} from './document-helper';

type PropsType = {
    +match: MatchType | null,
    +snackbarContext: SnackbarContextType,
    +userContextData: UserContextType,
};

type StateType = {|
    +mongoDocument: MongoDocumentType | null,
    +parentList: Array<MongoDocumentType>,
|};

export class DocumentEdit extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            mongoDocument: null,
            parentList: [],
        };
    }

    async componentDidMount() {
        this.fetchDocument();
    }

    // eslint-disable-next-line complexity, max-statements
    async fetchDocument() {
        const {props} = this;
        const {match, snackbarContext} = props;
        const {showSnackbar} = snackbarContext;

        if (match === null) {
            console.error('DocumentEdit props.match is not defined!');
            return;
        }

        const id = String(match.params.id);
        const mayBeDocumentPromise = await documentSearchExact('id', id);
        const mayBeDocument = await mayBeDocumentPromise;
        const mayBeParentList = await getDocumentParentList(id);

        if (isError(mayBeParentList)) {
            await showSnackbar({children: mayBeParentList.message, variant: 'error'}, mayBeParentList.message);
            return;
        }

        if (isError(mayBeDocument)) {
            await showSnackbar({children: mayBeDocument.message, variant: 'error'}, mayBeDocument.message);
            return;
        }

        const {errorList} = mayBeDocument;

        if (Array.isArray(errorList) && errorList.length > 0) {
            await showSnackbar({children: errorList.join(','), variant: 'error'}, errorList.join(','));
            return;
        }

        const mongoDocument: MongoDocumentType = typeConverter<MongoDocumentType>(mayBeDocument);

        this.setState({mongoDocument, parentList: mayBeParentList});
    }

    handleFormSubmit = async (formData: FormGeneratorFormDataType) => {
        const {props} = this;
        const {snackbarContext, match} = props;

        if (match === null) {
            console.error('DocumentEdit props.match is not defined!');
            return;
        }

        const {showSnackbar} = snackbarContext;
        const snackBarId = 'document-saved-snack-bar-id-' + String(Date.now());
        const endDocumentData: MongoDocumentType | Error = formDataToMongoDocument(formData);

        if (isError(endDocumentData)) {
            console.error(endDocumentData);
            return;
        }

        const updateDocumentResult = await updateDocument(endDocumentData);

        if (isError(updateDocumentResult)) {
            await showSnackbar({children: updateDocumentResult.message, variant: 'error'}, snackBarId);
            return;
        }

        if (updateDocumentResult.isSuccessful !== true) {
            await showSnackbar({children: updateDocumentResult.errorList.join(','), variant: 'error'}, snackBarId);
            return;
        }

        await this.fetchDocument();

        await showSnackbar({children: 'Document has been updated!', variant: 'success'}, snackBarId);
    };

    renderFormFooter(): Node {
        return (
            <ButtonListWrapper direction="right">
                <FormButton accessKey="s" type="submit">
                    Save [S]
                </FormButton>
            </ButtonListWrapper>
        );
    }

    handleFormError = async (errorList: Array<Error>, formData: FormGeneratorFormDataType) => {
        const {props} = this;
        const {snackbarContext} = props;
        const snackBarId = 'document-create-snack-bar-id-' + String(Date.now());
        const {showSnackbar} = snackbarContext;

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
                        id: {defaultValue: mongoDocument.id},
                        slug: {defaultValue: mongoDocument.slug, isHidden: mongoDocument.slug === rootDocumentSlug},
                        titleImage: {defaultValue: mongoDocument.titleImage},
                        type: {defaultValue: mongoDocument.type},
                        subDocumentListViewType: {defaultValue: mongoDocument.subDocumentListViewType},
                        title: {defaultValue: mongoDocument.title},
                        header: {defaultValue: mongoDocument.header},
                        author: {defaultValue: mongoDocument.author},
                        illustrator: {defaultValue: mongoDocument.illustrator},
                        artist: {defaultValue: mongoDocument.artist},
                        publicationDate: {defaultValue: mongoDocument.publicationDate},
                        meta: {defaultValue: mongoDocument.meta},
                        // description: {defaultValue: mongoDocument.description},
                        shortDescription: {defaultValue: mongoDocument.shortDescription},
                        content: {defaultValue: mongoDocument.content},
                        // subDocumentSlugList: {defaultValue: mongoDocument.subDocumentSlugList},
                        subDocumentIdList: {defaultValue: mongoDocument.subDocumentIdList},
                        tagList: {defaultValue: mongoDocument.tagList.join(', ')},
                        isActive: {defaultValue: mongoDocument.isActive},
                        isInSiteMap: {defaultValue: mongoDocument.isInSiteMap},
                        rating: {defaultValue: mongoDocument.rating},
                        fileList: {defaultValue: extractUniqueArrayString(mongoDocument.fileList)},
                    }),
                },
            ],
        };
    }

    renderParentList(): Node {
        const {state} = this;
        const {parentList} = state;

        if (parentList.length === 0) {
            return (
                <Toolbar>
                    <Typography variant="body1">Parent list: no parents</Typography>
                </Toolbar>
            );
        }
        return (
            <Toolbar>
                <Typography variant="body1">
                    {'Parents: '}
                    {parentList.map((documentData: MongoDocumentType, index: number): Node => {
                        const {slug, header, id} = documentData;
                        const href = getLinkToEditArticle(id); // routePathMap.documentEdit.staticPartPath + '/' + slug;

                        return (
                            <Fragment key={slug}>
                                {index === 0 ? '' : ', '}
                                <a href={href} key={'a-' + id} rel="noopener noreferrer" target="_blank">
                                    {header}
                                </a>
                            </Fragment>
                        );
                    })}
                </Typography>
            </Toolbar>
        );
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

        const {header, slug} = mongoDocument;

        return (
            <Paper className={mainWrapperStyle.paper_wrapper}>
                <Toolbar>
                    <Typography component={Link} target="_blank" to={getLinkToReadArticle(slug)} variant="h5">
                        Edit the Document: {header} / {slug}
                    </Typography>
                </Toolbar>
                {this.renderParentList()}
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
