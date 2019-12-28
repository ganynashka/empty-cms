// @flow

import React, {Component, type Node} from 'react';
import {Link} from 'react-router-dom';

import {Markdown} from '../../../../component/layout/markdown/c-markdown';
import type {InitialDataType} from '../../../../provider/intial-data/intial-data-type';
import type {MongoDocumentTreeNodeType} from '../../../../../../server/src/database/database-type';
import {getLinkToArticle} from '../../../../lib/string';
import articleStyle from '../article.scss';

import containerArticleStyle from './container-article.scss';

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
            <li className={articleStyle.article__list_item} key={slug}>
                <Link className={articleStyle.article__list_item__link} to={getLinkToArticle(slug)}>
                    {title}
                </Link>
            </li>
        );
    }

    render(): Node {
        const {props} = this;
        const {initialContextData} = props;
        const {articlePathData} = initialContextData;

        if (!articlePathData) {
            return <h1 className={articleStyle.article__header}>Here is not list of link</h1>;
        }

        const {title, subNodeList, content} = articlePathData;

        return (
            <>
                <h1 className={articleStyle.article__header}>{title}</h1>
                <ul className={articleStyle.article__list}>{subNodeList.map(this.renderSubNode)}</ul>
                <Markdown text={content}/>
            </>
        );
    }
}
