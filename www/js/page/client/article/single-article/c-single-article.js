// @flow

import React, {Component, type Node} from 'react';

import {Markdown} from '../../../../component/layout/markdown/c-markdown';
import type {InitialDataType} from '../../../../provider/intial-data/intial-data-type';
import articleStyle from '../article.scss';
import {BreadcrumbList} from '../../../../component/layout/breadcrumb-list/c-breadcrumb-list';
import {SiblingList} from '../../../../component/layout/sibling-list/sibling-list';

import singleArticleStyle from './single-article.scss';

type PropsType = {|
    +initialContextData: InitialDataType,
|};

type StateType = null;

export class SingleArticle extends Component<PropsType, StateType> {
    renderAuthor(): Node {
        const {props} = this;
        const {initialContextData} = props;
        const {articlePathData} = initialContextData;

        if (!articlePathData) {
            return null;
        }

        const {artist, author, illustrator} = articlePathData;

        const creatorList = [artist, author, illustrator].filter((creator: string): boolean => Boolean(creator.trim()));

        if (creatorList.length === 0) {
            return null;
        }

        return <p className={singleArticleStyle.single_article__author}>{creatorList.join(' / ')}</p>;
    }

    render(): Node {
        const {props} = this;
        const {initialContextData} = props;
        const {articlePathData, parentNodeList} = initialContextData;

        if (!articlePathData) {
            return <h1 className={articleStyle.article__header}>Here is not list of link</h1>;
        }

        const {header, content} = articlePathData;

        return (
            <>
                <BreadcrumbList parentNodeList={parentNodeList}/>
                <h1 className={articleStyle.article__header}>{header}</h1>
                <Markdown additionalClassName={singleArticleStyle.markdown} text={content}/>
                {this.renderAuthor()}
                <SiblingList header="Читайте также:" initialContextData={initialContextData}/>
            </>
        );
    }
}
