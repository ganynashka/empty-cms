// @flow

import React, {Component, type Node} from 'react';
import TreeItem from '@material-ui/lab/TreeItem';

import type {MongoDocumentType} from '../../../../../server/src/db/type';
import {documentSearchExact} from '../../../page/document/document-api';
import {typeConverter} from '../../../lib/type';
import {routePathMap} from '../../app/routes-path-map';

type PropsType = {|
    +slug: string,
    +deep: number,
|};

type StateType = {|
    +mongoDocument: MongoDocumentType | null,
    +hasError: boolean,
|};

export class DocumentTreeItem extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            mongoDocument: null,
            hasError: false,
        };
    }

    async componentDidMount() {
        this.fetchDocument();
    }

    async fetchDocument() {
        const {props} = this;
        const {slug} = props;

        const {data, errorList} = await documentSearchExact('slug', String(slug));

        if (errorList.length > 0) {
            this.setState({hasError: true});
            return;
        }

        const mongoDocument: MongoDocumentType = typeConverter<MongoDocumentType>(data);

        this.setState({mongoDocument});
    }

    renderSubDocumentList(): Array<Node> {
        const {props, state} = this;
        const {mongoDocument} = state;
        const {deep} = props;

        if (mongoDocument === null) {
            return [null];
        }

        return mongoDocument.subDocumentList.map((subDocumentSlug: string): Node => {
            return <DocumentTreeItem deep={deep - 1} key={subDocumentSlug} slug={subDocumentSlug}/>;
        });
    }

    renderShortInfo(): Node {
        const {props, state} = this;
        const {mongoDocument} = state;
        const {slug} = props;

        if (mongoDocument === null) {
            return null;
        }

        const {title} = mongoDocument;
        const href = routePathMap.documentEdit.staticPartPath + '/' + slug;

        const label = [
            <span key="title-text">Title: </span>,
            <a href={href} key="title-link" rel="noopener noreferrer" target="_blank">
                {title}
            </a>,
        ];

        return <TreeItem label={label} nodeId={slug + '-info'}/>;
    }

    render(): Node {
        const {props, state} = this;
        const {mongoDocument, hasError} = state;
        const {slug, deep} = props;

        if (deep === 0) {
            return <TreeItem key={slug} label="DEEP = 0 !!!" nodeId={slug}/>;
        }

        if (hasError) {
            return <TreeItem label={`Can not load!!! Slug: ${slug}`} nodeId={slug}/>;
        }

        if (mongoDocument === null) {
            return <TreeItem label="Loading..." nodeId={slug}/>;
        }

        return (
            <TreeItem label={slug} nodeId={slug}>
                {this.renderShortInfo()}
                {this.renderSubDocumentList()}
            </TreeItem>
        );
    }
}
