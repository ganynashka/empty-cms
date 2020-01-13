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

// import containerArticleStyle from './container-article.scss';

type PropsType = {|
    +initialContextData: InitialDataType,
    +screenContextData: ScreenContextType,
|};

type StateType = {};

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

    renderSubNode = (subNode: MongoDocumentTreeNodeType): Node => {
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
    };

    render(): Node {
        const {props} = this;
        const {initialContextData} = props;
        const {articlePathData} = initialContextData;

        if (!articlePathData) {
            return <h1 className={articleStyle.article__header}>Here is not list of link</h1>;
        }

        const {header, subNodeList, content} = articlePathData;

        return (
            <>
                <h1 className={articleStyle.article__header}>{header}</h1>
                <ul className={articleStyle.article__list}>{subNodeList.map(this.renderSubNode)}</ul>
                <Markdown text={content}/>
            </>
        );
    }
}
