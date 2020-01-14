// @flow

import React, {Component, type Node} from 'react';
import {Link} from 'react-router-dom';
import classNames from 'classnames';

import {Markdown} from '../../../../component/layout/markdown/c-markdown';
import type {InitialDataType} from '../../../../provider/intial-data/intial-data-type';
import type {MongoDocumentTreeNodeType} from '../../../../../../server/src/database/database-type';
import {getLinkToReadArticle} from '../../../../lib/string';
import articleStyle from '../article.scss';
import {getResizedInsideImageSrc} from '../../../../lib/url';
import type {ScreenContextType} from '../../../../provider/screen/screen-context-type';
import noImageImage from '../image/no-image.svg';
import {ImagePreview} from '../../../../component/layout/image-preview/c-image-preview';
import {mongoSubDocumentsViewTypeMap} from '../../../../../../server/src/database/database-type';

// import containerArticleStyle from './container-article.scss';

type PropsType = {|
    +initialContextData: InitialDataType,
    +screenContextData: ScreenContextType,
|};

type StateType = {};

const listClassNameMap = {
    [mongoSubDocumentsViewTypeMap.auto]: articleStyle.article__list_image,
    [mongoSubDocumentsViewTypeMap.imageHeader]: articleStyle.article__list_image,
    [mongoSubDocumentsViewTypeMap.header]: articleStyle.article__list_header,
};

export class ContainerArticle extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {};
    }

    getSubNodeImage(subNode: MongoDocumentTreeNodeType): string | null {
        const {titleImage, imageList} = subNode;

        if (titleImage.length > 0) {
            return titleImage;
        }

        if (imageList.length > 0) {
            return imageList[0];
        }

        return null;
    }

    renderImageHeaderSubNode(subNode: MongoDocumentTreeNodeType): Node {
        const {props} = this;
        const {screenContextData} = props;
        const {devicePixelRatio} = screenContextData;
        const {slug, header} = subNode;
        const pathToImage = this.getSubNodeImage(subNode);
        const src = pathToImage ? getResizedInsideImageSrc(pathToImage, 269, 170, devicePixelRatio) : noImageImage;
        const imageData = {src, title: header};

        return (
            <li className={articleStyle.article__list_image_item} key={slug}>
                <ImagePreview image={imageData} link={{to: getLinkToReadArticle(slug)}}/>
            </li>
        );
    }

    renderHeaderSubNode(
        subNode: MongoDocumentTreeNodeType,
        index: number,
        array: Array<MongoDocumentTreeNodeType>
    ): Node {
        const {slug, header} = subNode;

        return (
            <li className={articleStyle.article__list_header_item} key={slug}>
                {String(index + 1).padStart(String(array.length + 1).length, '0')}.&nbsp;
                <Link
                    className={articleStyle.article__list_header_item__link}
                    key={slug}
                    to={getLinkToReadArticle(slug)}
                >
                    {header}
                </Link>
            </li>
        );
    }

    renderSubNode = (
        subNode: MongoDocumentTreeNodeType,
        index: number,
        array: Array<MongoDocumentTreeNodeType>
    ): Node => {
        const {props} = this;
        const {initialContextData} = props;
        const {articlePathData} = initialContextData;

        if (!articlePathData) {
            return null;
        }

        const {subDocumentListViewType} = articlePathData;

        if (mongoSubDocumentsViewTypeMap.imageHeader === subDocumentListViewType) {
            return this.renderImageHeaderSubNode(subNode);
        }

        if (mongoSubDocumentsViewTypeMap.header === subDocumentListViewType) {
            return this.renderHeaderSubNode(subNode, index, array);
        }

        return this.renderImageHeaderSubNode(subNode);
    };

    sortDocumentByAlphabet(subNodeA: MongoDocumentTreeNodeType, subNodeB: MongoDocumentTreeNodeType): number {
        return subNodeA.header > subNodeB.header ? 1 : -1;
    }

    render(): Node {
        const {props} = this;
        const {initialContextData} = props;
        const {articlePathData} = initialContextData;

        if (!articlePathData) {
            return <h1 className={articleStyle.article__header}>Here is not list of link</h1>;
        }

        const {header, subNodeList, content, subDocumentListViewType} = articlePathData;
        const listClassName = listClassNameMap[subDocumentListViewType];

        return (
            <>
                <h1 className={articleStyle.article__header}>{header}</h1>
                <ul className={listClassName}>
                    {subNodeList.sort(this.sortDocumentByAlphabet).map(this.renderSubNode)}
                </ul>
                <Markdown text={content}/>
            </>
        );
    }
}
