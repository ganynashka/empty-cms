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
        const {slug, title} = subNode;
        const pathToImage = this.getSubNodeImage(subNode);
        const src = pathToImage ? getResizedInsideImageSrc(pathToImage, 269, 170, devicePixelRatio) : noImageImage;
        const style = {backgroundImage: 'url(' + src + ')'};

        return (
            <li
                className={classNames(articleStyle.article__list_image_item, {
                    [articleStyle.article__list_image_item__no_image]: !pathToImage,
                })}
                key={slug}
                style={style}
            >
                <Link className={articleStyle.article__list_image_item__link} to={getLinkToReadArticle(slug)}>
                    <span className={articleStyle.article__list_image_item__link_text}>{title}</span>
                </Link>
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
