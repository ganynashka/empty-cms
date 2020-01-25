// @flow

import React, {Component, type Node} from 'react';
import {Link} from 'react-router-dom';

import type {InitialDataType} from '../../../provider/intial-data/intial-data-type';
import type {MongoDocumentLinkType} from '../../../../../server/src/database/database-type';
import {getLinkToReadArticle, sortDocumentByAlphabet} from '../../../lib/string';

import siblingListStyle from './sibling-list.scss';

type StateType = null;

type PropsType = {|
    +initialContextData: InitialDataType,
    +header: string,
|};

export class SiblingList extends Component<PropsType, StateType> {
    renderSiblingListItem(siblingData: MongoDocumentLinkType): Node {
        const {slug, header} = siblingData;

        return (
            <li className={siblingListStyle.single_article__sibling__item} key={slug}>
                <Link className={siblingListStyle.single_article__sibling__item__link} to={getLinkToReadArticle(slug)}>
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

    render(): Node {
        const {props} = this;
        const {initialContextData, header} = props;
        const {articlePathData} = initialContextData;
        const siblingDataList = this.getSiblingList();

        if (!articlePathData || siblingDataList.length === 0) {
            return null;
        }

        return (
            <div className={siblingListStyle.single_article__sibling__wrapper}>
                <h4 className={siblingListStyle.single_article__sibling__header}>{header}</h4>
                <ul className={siblingListStyle.single_article__sibling__list}>
                    {siblingDataList.map(this.renderSiblingListItem)}
                </ul>
            </div>
        );
    }
}
