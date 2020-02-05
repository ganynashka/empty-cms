// @flow

import React, {Component, type Node} from 'react';

import {Markdown} from '../../../../component/layout/markdown/c-markdown';
import type {InitialDataType} from '../../../../provider/intial-data/intial-data-type';
import articleStyle from '../article.scss';
import type {ScreenContextType} from '../../../../provider/screen/screen-context-type';
import singleArticleStyle from '../single-article/single-article.scss';
import {getResizedImageSrc} from '../../../../lib/url';
import {BreadcrumbList} from '../../../../component/layout/breadcrumb-list/c-breadcrumb-list';
import serviceStyle from '../../../../../css/service.scss';
import {imageSrcToHtml} from '../../../../../../server/src/api/part/pdf-api-helper';
import {SiblingList} from '../../../../component/layout/sibling-list/sibling-list';

import imageListArticleStyle from './downloadable-image-list-article.scss';

const maxImageSideSize = 5e3;

type PropsType = {|
    +initialContextData: InitialDataType,
    +screenContextData: ScreenContextType,
|};

type StateType = {|
    +imageForPrint: {|
        +iframe: {current: HTMLIFrameElement | null},
    |},
|};

export class DownloadableImageListArticle extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            imageForPrint: {
                iframe: React.createRef<HTMLIFrameElement>(),
            },
        };
    }

    getIFrameNode(): HTMLIFrameElement | null {
        const {state} = this;
        const {imageForPrint} = state;
        const {iframe} = imageForPrint;

        return iframe.current;
    }

    printIFrameNode = (imageSrc: string) => {
        const iFrameNode = this.getIFrameNode();

        if (!iFrameNode) {
            return;
        }

        const iFrameBody = iFrameNode.contentWindow.document.querySelector('body');

        iFrameBody.innerHTML = imageSrcToHtml(
            getResizedImageSrc({src: imageSrc, width: maxImageSideSize, height: maxImageSideSize})
        );
    };

    makeHandlePrintImage = (imageSrc: string): (() => mixed) => {
        return () => {
            this.printIFrameNode(imageSrc);
        };
    };

    renderDownloadableImage = (imageSrc: string): Node => {
        const {props} = this;
        const {screenContextData} = props;
        const {devicePixelRatio} = screenContextData;
        const imageWidth = 267;
        const imageHeight = 208;

        return (
            <li className={imageListArticleStyle.image_list_article__list_item} key={imageSrc}>
                <img
                    alt=""
                    className={imageListArticleStyle.image_list_article__list_item_image}
                    height={imageHeight}
                    loading="lazy"
                    src={getResizedImageSrc({
                        src: imageSrc,
                        width: imageWidth,
                        height: imageHeight,
                        aspectRatio: devicePixelRatio / 1.5,
                    })}
                    width={imageWidth}
                />
                <div className={imageListArticleStyle.image_list_article__list_item_button_list_wrapper}>
                    <button
                        className={imageListArticleStyle.image_list_article__list_item_button}
                        onClick={this.makeHandlePrintImage(imageSrc)}
                        type="button"
                    >
                        Распечатать
                    </button>
                    <a
                        className={imageListArticleStyle.image_list_article__list_item_button}
                        download
                        href={getResizedImageSrc({src: imageSrc, width: maxImageSideSize, height: maxImageSideSize})}
                    >
                        Скачать
                    </a>
                </div>
            </li>
        );
    };

    renderPrintableIFrame(): Node {
        const {state} = this;
        const {imageForPrint} = state;
        const {iframe} = imageForPrint;

        return <iframe className={serviceStyle.hidden} key="print-iframe" ref={iframe} title="print document"/>;
    }

    render(): Node {
        const {props} = this;
        const {initialContextData} = props;
        const {articlePathData, parentNodeList} = initialContextData;

        if (!articlePathData) {
            return <h1 className={articleStyle.article__header}>Here is not list of link</h1>;
        }

        const {header, content, imageList} = articlePathData.mongoDocument;

        return (
            <>
                <BreadcrumbList parentNodeList={parentNodeList}/>
                <h1 className={articleStyle.article__header}>{header}</h1>
                <ul className={imageListArticleStyle.image_list_article__list}>
                    {imageList.map(this.renderDownloadableImage)}
                </ul>
                <Markdown additionalClassName={singleArticleStyle.markdown} text={content}/>
                <SiblingList header="Смотрите также:" initialContextData={initialContextData}/>
                {this.renderPrintableIFrame()}
            </>
        );
    }
}
