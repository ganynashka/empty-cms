// @flow

import React, {Component, type Node} from 'react';

import {Markdown} from '../../../../component/layout/markdown/c-markdown';
import type {InitialDataType} from '../../../../provider/intial-data/intial-data-type';
import articleStyle from '../article.scss';
import type {ScreenContextType} from '../../../../provider/screen/screen-context-type';
import singleArticleStyle from '../single-article/single-article.scss';
import {getPdfUrlFromImage, getResizedInsideImageSrc} from '../../../../lib/url';
import {BreadcrumbList} from '../../../../component/layout/breadcrumb-list/c-breadcrumb-list';
import serviceStyle from '../../../../../css/service.scss';

import imageListArticleStyle from './downloadable-image-list-article.scss';

type PropsType = {|
    +initialContextData: InitialDataType,
    +screenContextData: ScreenContextType,
|};

type StateType = {|
    +imageForPrint: {|
        +src: string,
        +iframe: {current: HTMLIFrameElement | null},
    |},
|};

export class DownloadableImageListArticle extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            imageForPrint: {
                src: '',
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

    printIFrameNode = () => {
        const iFrameNode = this.getIFrameNode();

        if (!iFrameNode) {
            return;
        }

        iFrameNode.contentWindow.print();
    };

    makeHandlePrintImage = (imageSrc: string): (() => mixed) => {
        return () => {
            const {state} = this;
            const {imageForPrint} = state;
            const newImageForPrint = {...imageForPrint, src: imageSrc};

            this.setState({imageForPrint: newImageForPrint}, this.printIFrameNode);
        };
    };

    renderDownloadableImage = (imageSrc: string): Node => {
        const {props} = this;
        const {screenContextData} = props;
        const {devicePixelRatio} = screenContextData;

        return (
            <li className={imageListArticleStyle.image_list_article__list_item} key={imageSrc}>
                <img
                    alt=""
                    className={imageListArticleStyle.image_list_article__list_item_image}
                    src={getResizedInsideImageSrc(imageSrc, 504, 504, devicePixelRatio)}
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
                        href={getResizedInsideImageSrc(imageSrc, 10e3, 10e3, devicePixelRatio)}
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
        const {src, iframe} = imageForPrint;

        if (!src.trim()) {
            return null;
        }

        return (
            <iframe className={serviceStyle.hidden} key={src} ref={iframe} src={getPdfUrlFromImage(src)} title={src}/>
        );
    }

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
                <ul className={imageListArticleStyle.image_list_article__list}>
                    {imageList.map(this.renderDownloadableImage)}
                </ul>

                <Markdown additionalClassName={singleArticleStyle.markdown} text={content}/>
                {this.renderPrintableIFrame()}
            </>
        );
    }
}
