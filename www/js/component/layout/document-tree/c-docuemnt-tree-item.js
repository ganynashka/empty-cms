// @flow

import React, {Component, type Node} from 'react';
import TreeItem from '@material-ui/lab/TreeItem';

import type {MongoDocumentType} from '../../../../../server/src/db/type';
import {documentSearchExact} from '../../../page/document/document-api';
import {typeConverter} from '../../../lib/type';
import {routePathMap} from '../../app/routes-path-map';
import {stopPropagation} from '../../../lib/event';

import documentTreeStyle from './document-tree.style.scss';

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
            return [];
        }

        return mongoDocument.subDocumentList.map((subDocumentSlug: string): Node => {
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

        const {title, isActive} = mongoDocument;
        const href = routePathMap.documentEdit.staticPartPath + '/' + slug;

        const className = isActive ? null : documentTreeStyle.not_active_item;

        return [
            <a
                className={className}
                href={href}
                key="title-link"
                onClick={stopPropagation}
                rel="noopener noreferrer"
                target="_blank"
            >
                {title}
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

        if (mongoDocument.subDocumentList.length === 0) {
            return <TreeItem label={this.renderLabel()} nodeId={slug}/>;
        }

        return (
            <TreeItem label={this.renderLabel()} nodeId={slug}>
                {this.renderSubDocumentList()}
            </TreeItem>
        );
    }
}
