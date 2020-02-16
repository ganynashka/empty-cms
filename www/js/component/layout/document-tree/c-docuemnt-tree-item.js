// @flow

import React, {Component, type Node} from 'react';
import TreeItem from '@material-ui/lab/TreeItem';

import type {MongoDocumentType} from '../../../../../server/src/database/database-type';
import {documentSearchExact} from '../../../page/cms/document/document-api';
import {typeConverter} from '../../../lib/type';
import {stopPropagation} from '../../../lib/event';
import {isError} from '../../../lib/is';
import {getLinkToEditArticle, getLinkToReadArticle} from '../../../lib/string';

import documentTreeStyle from './document-tree.scss';

type PropsType = {|
    +id: string,
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
        const {id} = props;

        const mayBeDocumentPromise = await documentSearchExact('id', id);
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

        return mongoDocument.subDocumentIdList.map((subDocumentId: string): Node => {
            return <DocumentTreeItem deep={deep - 1} id={subDocumentId} key={subDocumentId}/>;
        });
    }

    renderLabel(): Array<Node> {
        const {state} = this;
        const {mongoDocument} = state;

        if (mongoDocument === null) {
            return [<span key="title-text">Loading...</span>];
        }

        const {header, isActive, slug, id} = mongoDocument;
        const hrefToEditArticle = getLinkToEditArticle(id);

        const className = isActive ? null : documentTreeStyle.not_active_item;

        return [
            <a
                className={className}
                href={hrefToEditArticle}
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
        const {id, deep} = props;

        if (deep === 0) {
            return <TreeItem key={id} label="DEEP = 0 !!!" nodeId={id}/>;
        }

        if (hasError) {
            return <TreeItem label={`Can not load!!! Id: ${id}`} nodeId={id}/>;
        }

        if (mongoDocument === null) {
            return <TreeItem label="Loading..." nodeId={id}/>;
        }

        if (mongoDocument.subDocumentIdList.length === 0) {
            return <TreeItem label={this.renderLabel()} nodeId={id}/>;
        }

        return (
            <TreeItem label={this.renderLabel()} nodeId={id}>
                {this.renderSubDocumentList()}
            </TreeItem>
        );
    }
}
