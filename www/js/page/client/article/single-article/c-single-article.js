// @flow

import React, {Component, type Node} from 'react';
import {Link} from 'react-router-dom';

import {Markdown} from '../../../../component/layout/markdown/c-markdown';
import type {InitialDataType} from '../../../../provider/intial-data/intial-data-type';
import articleStyle from '../article.scss';
import {BreadcrumbList} from '../../../../component/layout/breadcrumb-list/c-breadcrumb-list';
import type {MongoDocumentLinkType} from '../../../../../../server/src/database/database-type';
import {getLinkToReadArticle, sortDocumentByAlphabet} from '../../../../lib/string';

import singleArticleStyle from './single-article.scss';

type PropsType = {|
    +initialContextData: InitialDataType,
|};

type StateType = {};

export class SingleArticle extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {};
    }

    renderAuthor(): Node {
        const {props} = this;
        const {initialContextData} = props;
        const {articlePathData} = initialContextData;

        if (!articlePathData) {
            return null;
        }

        const {author} = articlePathData;

        if (!author.trim()) {
            return null;
        }

        return <p className={singleArticleStyle.single_article__author}>{author}</p>;
    }

    renderSiblingListItem(siblingData: MongoDocumentLinkType): Node {
        const {slug, header, type} = siblingData;

        return (
            <li className={singleArticleStyle.single_article__read_also__item} key={slug}>
                <Link
                    className={singleArticleStyle.single_article__read_also__item__link}
                    to={getLinkToReadArticle(slug)}
                >
                    {header}
                </Link>
            </li>
        );
    }

    getSiblingList(): Array<MongoDocumentLinkType> {
        const {props} = this;
        const {initialContextData} = props;
        const {articlePathData} = initialContextData;
        const siblingDataList = [...initialContextData.siblingDataList];
        const siblingListCount = 8;

        if (!articlePathData || siblingDataList.length <= 1) {
            return [];
        }

        const sortedSiblingDataList = siblingDataList.sort(sortDocumentByAlphabet);

        let currentArticleIndex = -1;

        sortedSiblingDataList.forEach((siblingData: MongoDocumentLinkType, index: number) => {
            if (siblingData.slug === articlePathData.slug) {
                currentArticleIndex = index;
            }
        });

        if (currentArticleIndex < 0) {
            return [];
        }

        sortedSiblingDataList.splice(currentArticleIndex, 1);

        if (sortedSiblingDataList.length <= siblingListCount) {
            return sortedSiblingDataList;
        }

        const lastPart = sortedSiblingDataList.slice(currentArticleIndex, siblingListCount);
        const firstPart = sortedSiblingDataList.slice(0, siblingListCount - lastPart.length);

        return [...lastPart, ...firstPart];
    }

    renderSiblingList(): Node {
        const {props} = this;
        const {initialContextData} = props;
        const {articlePathData} = initialContextData;
        const siblingDataList = this.getSiblingList();

        if (!articlePathData || siblingDataList.length === 0) {
            return null;
        }

        return (
            <div className={singleArticleStyle.single_article__read_also__wrapper}>
                <h4 className={singleArticleStyle.single_article__read_also__header}>Читайте также:</h4>
                <ul className={singleArticleStyle.single_article__read_also__list}>
                    {siblingDataList.map(this.renderSiblingListItem)}
                </ul>
            </div>
        );
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
                {this.renderSiblingList()}
            </>
        );
    }
}
