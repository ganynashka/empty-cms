// @flow

import React, {Component, type Node} from 'react';

import {Markdown} from '../../../../component/layout/markdown/c-markdown';
import type {InitialDataType} from '../../../../provider/intial-data/intial-data-type';
import articleStyle from '../article.scss';
import type {ScreenContextType} from '../../../../provider/screen/screen-context-type';
import singleArticleStyle from '../single-article/single-article.scss';
import {getResizedInsideImageSrc} from '../../../../lib/url';
import {BreadcrumbList} from '../../../../component/layout/breadcrumb-list/c-breadcrumb-list';

import downloadableImageListArticleStyle from './downloadable-image-list-article.scss';

type PropsType = {|
    +initialContextData: InitialDataType,
    +screenContextData: ScreenContextType,
|};

type StateType = {};

export class DownloadableImageListArticle extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {};
    }

    renderDownloadableImage = (imageSrc: string): Node => {
        const {props} = this;
        const {screenContextData} = props;
        const {devicePixelRatio} = screenContextData;

        return (
            <li className={downloadableImageListArticleStyle.downloadable_image_list_article__list_item} key={imageSrc}>
                <a
                    className={downloadableImageListArticleStyle.downloadable_image_list_article__list_item_link}
                    download
                    href={getResizedInsideImageSrc(imageSrc, 10e3, 10e3, devicePixelRatio)}
                >
                    <img
                        alt=""
                        className={downloadableImageListArticleStyle.downloadable_image_list_article__list_item_image}
                        src={getResizedInsideImageSrc(imageSrc, 100, 100, devicePixelRatio)}
                    />
                    <span>Скачать файл</span>
                    <span>Скачать как pdf</span>
                    <span>Распечатать</span>
                </a>
            </li>
        );
    };

    render(): Node {
        const {props} = this;
        const {initialContextData} = props;
        const {articlePathData, parentNodeList} = initialContextData;

        if (!articlePathData) {
            return <h1 className={articleStyle.article__header}>Here is not list of link</h1>;
        }

        const {header, content, imageList} = articlePathData;

        return (
            <>
                <BreadcrumbList parentNodeList={parentNodeList}/>
                <h1 className={articleStyle.article__header}>{header}</h1>
                <ul className={downloadableImageListArticleStyle.downloadable_image_list_article__list}>
                    {imageList.map(this.renderDownloadableImage)}
                </ul>

                <Markdown additionalClassName={singleArticleStyle.markdown} text={content}/>
            </>
        );
    }
}
