// @flow

import React, {Component, type Node} from 'react';

import {Markdown} from '../../../../component/layout/markdown/c-markdown';
import type {InitialDataType} from '../../../../provider/intial-data/intial-data-type';
import articleStyle from '../article.scss';
import {BreadcrumbList} from '../../../../component/layout/breadcrumb-list/c-breadcrumb-list';
import {SiblingList} from '../../../../component/layout/sibling-list/sibling-list';
import {beautifyMarkDawn} from '../../../../lib/string';
import {ShareButtonList} from '../../../../component/share/share-button-list/c-share-button-list';
import type {ScreenContextType} from '../../../../provider/screen/screen-context-type';
import type {LocationType} from '../../../../type/react-router-dom-v5-type-extract';
import {ErrorConnectionContent} from '../error-connection-content/c-error-connection-content';

import singleArticleStyle from './single-article.scss';

type PropsType = {|
    +location: LocationType,
    +screenContextData: ScreenContextType,
    +initialContextData: InitialDataType,
|};

type StateType = null;

export class SingleArticle extends Component<PropsType, StateType> {
    renderAuthorList(): Node {
        const {props} = this;
        const {initialContextData} = props;
        const {articlePathData} = initialContextData;

        if (!articlePathData) {
            return null;
        }

        const {artist, author, illustrator} = articlePathData.mongoDocument;

        const creatorList = [artist, author, illustrator].filter((creator: string): boolean => Boolean(creator.trim()));

        if (creatorList.length === 0) {
            return null;
        }

        return <p className={singleArticleStyle.single_article__author}>{creatorList.join(' / ')}</p>;
    }

    getSiblingListHeader(): string {
        const {props} = this;
        const {initialContextData} = props;
        const {articlePathData} = initialContextData;

        if (!articlePathData) {
            return '';
        }

        const {mongoDocument} = articlePathData;
        const {fileList} = mongoDocument;
        const firstFile = fileList[0];

        if (firstFile && firstFile.endsWith('.mp3')) {
            return 'Слушайте также:';
        }

        return 'Читайте также:';
    }

    render(): Node {
        const {props} = this;
        const {initialContextData, screenContextData, location} = props;
        const {articlePathData, parentNodeList} = initialContextData;

        if (!articlePathData) {
            return <h1 className={articleStyle.article__header}>Here is not list of link</h1>;
        }

        const {header, content} = articlePathData.mongoDocument;

        return (
            <>
                <BreadcrumbList parentNodeList={parentNodeList}/>
                <h1 className={articleStyle.article__header}>{header}</h1>
                <Markdown additionalClassName={singleArticleStyle.markdown} text={beautifyMarkDawn(content)}/>
                {this.renderAuthorList()}
                <ShareButtonList
                    initialContextData={initialContextData}
                    location={location}
                    screenContextData={screenContextData}
                />
                <SiblingList header={this.getSiblingListHeader()} initialContextData={initialContextData}/>
            </>
        );
    }
}
