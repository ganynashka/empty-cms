// @flow

import React, {Component, type Node} from 'react';
import {Link} from 'react-router-dom';

import {Markdown} from '../../../../component/layout/markdown/c-markdown';
import type {InitialDataType} from '../../../../provider/intial-data/intial-data-type';
import type {MongoDocumentTreeNodeType} from '../../../../../../server/src/database/database-type';
import {routePathMap} from '../../../../component/app/routes-path-map';
import {getLinkToArticle} from '../../../../lib/string';

type PropsType = {|
    +initialContextData: InitialDataType,
|};

type StateType = {};

export class ContainerArticle extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {};
    }

    renderSubNode(subNode: MongoDocumentTreeNodeType): Node {
        const {slug, title} = subNode;

        return (
            <li key={slug}>
                <Link to={getLinkToArticle(slug)}>{title}</Link>
            </li>
        );
    }

    render(): Node {
        const {props} = this;
        const {initialContextData} = props;
        const {articlePathData} = initialContextData;

        if (!articlePathData) {
            return <h1>Here is not list of link</h1>;
        }

        const {title, subNodeList, content} = articlePathData;

        return (
            <>
                <h1>{title}</h1>
                <ul>{subNodeList.map(this.renderSubNode)}</ul>
                <Markdown text={content}/>
            </>
        );
    }
}
