// @flow

import React, {Component, type Node} from 'react';
import TreeItem from '@material-ui/lab/TreeItem';

import type {MongoDocumentType} from '../../../../../server/src/database/database-type';
import {documentSearchExact} from '../../../page/cms/document/document-api';
import {typeConverter} from '../../../lib/type';
import {stopPropagation} from '../../../lib/event';
import {isError} from '../../../lib/is';
import {getLinkToEditArticle} from '../../../lib/string';

import documentTreeStyle from './document-tree.scss';

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

    fetchDocument = async () => {
        const {props} = this;
        const {slug} = props;

        const mayBeDocumentPromise = await documentSearchExact('slug', String(slug));
        const mayBeDocument = await mayBeDocumentPromise;

        if (isError(mayBeDocument)) {
            this.setState({hasError: true});
            return;
        }

        const {errorList} = mayBeDocument;

        if (Array.isArray(errorList) && errorList.length > 0) {
            this.setState({hasError: true});
            return;
        }

        const mongoDocument: MongoDocumentType = typeConverter<MongoDocumentType>(mayBeDocument);

        this.setState({mongoDocument});
    };

    renderSubDocumentList(): Array<Node> {
        const {props, state} = this;
        const {mongoDocument} = state;
        const {deep} = props;

        if (mongoDocument === null) {
            return [];
        }

        return mongoDocument.subDocumentSlugList.map((subDocumentSlug: string): Node => {
            return <DocumentTreeItem deep={deep - 1} key={subDocumentSlug} slug={subDocumentSlug}/>;
        });
    }

    renderLabel(): Array<Node> {
        const {props, state} = this;
        const {mongoDocument} = state;
        const {slug} = props;

        if (mongoDocument === null) {
            return [<span key="title-text">Loading...</span>, <span key="label-slug">&nbsp;&ndash;&nbsp;{slug}</span>];
        }

        const {header, isActive} = mongoDocument;
        const href = getLinkToEditArticle(slug);

        const className = isActive ? null : documentTreeStyle.not_active_item;

        return [
            <a
                className={className}
                href={href}
                key="header-link"
                onClick={stopPropagation}
                rel="noopener noreferrer"
                target="_blank"
            >
                {header}
            </a>,
            <span className={className} key="label-slug">
                &nbsp;&ndash;&nbsp;{slug}
            </span>,
        ];
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

        if (mongoDocument.subDocumentSlugList.length === 0) {
            return <TreeItem label={this.renderLabel()} nodeId={slug}/>;
        }

        return (
            <TreeItem label={this.renderLabel()} nodeId={slug}>
                {this.renderSubDocumentList()}
            </TreeItem>
        );
    }
}
