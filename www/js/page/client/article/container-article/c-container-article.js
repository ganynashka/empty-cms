// @flow

/* eslint-disable jsx-a11y/media-has-caption */

/* global HTMLAudioElement */

import React, {Component, type Node} from 'react';
import {Link} from 'react-router-dom';

import {Markdown} from '../../../../component/layout/markdown/c-markdown';
import type {InitialDataType} from '../../../../provider/intial-data/intial-data-type';
import type {MongoDocumentShortDataType} from '../../../../../../server/src/database/database-type';
import {getLinkToReadArticle, sortDocumentByAlphabet} from '../../../../lib/string';
import articleStyle from '../article.scss';
import {getResizedImageSrc} from '../../../../lib/url';
import type {ScreenContextType} from '../../../../provider/screen/screen-context-type';
import {ImagePreview} from '../../../../component/layout/image-preview/c-image-preview';
import {mongoDocumentTypeMap, mongoSubDocumentsViewTypeMap} from '../../../../../../server/src/database/database-type';
import {BreadcrumbList} from '../../../../component/layout/breadcrumb-list/c-breadcrumb-list';
import {fileApiConst} from '../../../../../../server/src/api/part/file-api-const';
import {promiseCatch} from '../../../../lib/promise';
import {ShareButtonList} from '../../../../component/share/share-button-list/c-share-button-list';
import singleArticleStyle from '../single-article/single-article.scss';

type PropsType = {|
    +initialContextData: InitialDataType,
    +screenContextData: ScreenContextType,
|};

type StateType = {|
    +listRef: {current: HTMLUListElement | null},
|};

const listClassNameMap = {
    [mongoSubDocumentsViewTypeMap.auto]: articleStyle.article__list_image,
    [mongoSubDocumentsViewTypeMap.imageHeader]: articleStyle.article__list_image,
    [mongoSubDocumentsViewTypeMap.audioHeader]: articleStyle.article__list_audio,
    [mongoSubDocumentsViewTypeMap.header]: articleStyle.article__list_header,
};

export class ContainerArticle extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            listRef: React.createRef<HTMLUListElement>(),
        };
    }

    getSubNodeImage(subNode: MongoDocumentShortDataType): string | null {
        const {titleImage, imageList} = subNode;

        if (titleImage.length > 0) {
            return titleImage;
        }

        if (imageList.length > 0) {
            return imageList[0];
        }

        return null;
    }

    renderImageHeaderSubNode(subNode: MongoDocumentShortDataType): Node {
        const {props} = this;
        const {screenContextData} = props;
        const {devicePixelRatio} = screenContextData;
        const {slug, header} = subNode;
        const pathToImage = this.getSubNodeImage(subNode);
        const src = pathToImage
            ? getResizedImageSrc({
                src: pathToImage,
                width: 269,
                height: 170,
                aspectRatio: devicePixelRatio / 1.5,
            })
            : '';
        const imageData = {src, title: header};

        return (
            <li className={articleStyle.article__list_image_item} key={slug}>
                <ImagePreview image={imageData} link={{to: getLinkToReadArticle(slug)}}/>
                {this.renderArticleTimeToRead(subNode)}
            </li>
        );
    }

    renderArticleTimeToRead(subNode: MongoDocumentShortDataType): Node {
        const {type, contentLength, imageList} = subNode;

        if (type !== mongoDocumentTypeMap.article) {
            return null;
        }

        const firstFileName = imageList[0] || '';

        if (firstFileName.endsWith('.mp3')) {
            return null;
        }

        // 16 - reading speed, letters  per seconds
        const lettersPerSecond = 16;
        const gapInSeconds = 15;
        const fullTime = Math.round(contentLength / lettersPerSecond) + gapInSeconds;

        const minutes = Math.floor(fullTime / 60);
        const seconds = Math.floor(fullTime % 60 / gapInSeconds) * gapInSeconds;

        return (
            <p className={articleStyle.article__list_label_item}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </p>
        );
    }

    // eslint-disable-next-line complexity
    playNextAudioTrack(slug: string) {
        const {props, state} = this;
        const {listRef} = state;
        const listNode = listRef.current;
        const {initialContextData} = props;
        const {articlePathData} = initialContextData;

        if (!listNode) {
            return;
        }

        if (!articlePathData) {
            return;
        }

        const subNodeList = articlePathData.sudNodeShortDataList;
        const activeSubNode = subNodeList.find((subNode: MongoDocumentShortDataType): boolean => subNode.slug === slug);

        if (!activeSubNode) {
            return;
        }

        const activeSubNodeIndex = subNodeList.indexOf(activeSubNode);
        const nextActiveSubNode = subNodeList[activeSubNodeIndex + 1];

        if (!nextActiveSubNode) {
            return;
        }

        const nextActiveHtmlNode = listNode.querySelector(
            `.${articleStyle.article__list_audio_item__audio}[data-slug="${nextActiveSubNode.slug}"]`
        );

        if (nextActiveHtmlNode instanceof HTMLAudioElement) {
            nextActiveHtmlNode.play().catch(promiseCatch);
        }
    }

    pauseAllExcept(slug: string) {
        const {state} = this;
        const {listRef} = state;
        const listNode = listRef.current;

        if (!listNode) {
            return;
        }

        const audioNodeList = listNode.querySelectorAll(`.${articleStyle.article__list_audio_item__audio}`);

        audioNodeList.forEach((audioNode: HTMLElement) => {
            if (audioNode instanceof HTMLAudioElement && audioNode.dataset.slug !== slug) {
                audioNode.pause();
            }
        });
    }

    makeHandleAudioEnded(slug: string): () => void {
        return () => {
            this.playNextAudioTrack(slug);
        };
    }

    makeHandlePauseAllExcept(slug: string): () => void {
        return () => {
            this.pauseAllExcept(slug);
        };
    }

    renderAudioHeaderSubNode(subNode: MongoDocumentShortDataType): Node {
        const {slug, header, imageList} = subNode;
        const src = imageList[0] || '';
        const audioSrc = fileApiConst.pathToUploadFiles + '/' + src;

        return (
            <li className={articleStyle.article__list_audio_item} key={slug}>
                <Link
                    className={articleStyle.article__list_audio_item__link}
                    key={slug}
                    to={getLinkToReadArticle(slug)}
                >
                    {header}
                </Link>
                <audio
                    className={articleStyle.article__list_audio_item__audio}
                    controls
                    data-slug={slug}
                    onEnded={this.makeHandleAudioEnded(slug)}
                    onPlay={this.makeHandlePauseAllExcept(slug)}
                    preload="metadata"
                    src={audioSrc}
                />
            </li>
        );
    }

    renderHeaderSubNode(subNode: MongoDocumentShortDataType): Node {
        const {slug, header, subDocumentSlugList} = subNode;
        const childListLength = subDocumentSlugList.length;

        return (
            <li className={articleStyle.article__list_header_item} key={slug}>
                <Link
                    className={articleStyle.article__list_header_item__link}
                    key={slug}
                    to={getLinkToReadArticle(slug)}
                >
                    {header}
                    {childListLength === 0 ? null : `\u00A0[${childListLength}]`}
                </Link>
            </li>
        );
    }

    renderSubNode = (subNode: MongoDocumentShortDataType): Node => {
        const {props} = this;
        const {initialContextData} = props;
        const {articlePathData} = initialContextData;

        if (!articlePathData) {
            return null;
        }

        const {subDocumentListViewType} = articlePathData.mongoDocument;

        if (mongoSubDocumentsViewTypeMap.imageHeader === subDocumentListViewType) {
            return this.renderImageHeaderSubNode(subNode);
        }

        if (mongoSubDocumentsViewTypeMap.audioHeader === subDocumentListViewType) {
            return this.renderAudioHeaderSubNode(subNode);
        }

        if (mongoSubDocumentsViewTypeMap.header === subDocumentListViewType) {
            return this.renderHeaderSubNode(subNode);
        }

        return this.renderImageHeaderSubNode(subNode);
    };

    render(): Node {
        const {props, state} = this;
        const {initialContextData, screenContextData} = props;
        const {articlePathData, parentNodeList} = initialContextData;

        if (!articlePathData) {
            return <h1 className={articleStyle.article__header}>Here is not list of link</h1>;
        }

        const {header, content, subDocumentListViewType} = articlePathData.mongoDocument;
        const subNodeList = articlePathData.sudNodeShortDataList;
        const listClassName = listClassNameMap[subDocumentListViewType];

        return (
            <>
                <BreadcrumbList parentNodeList={parentNodeList}/>
                <h1 className={articleStyle.article__header}>{header}</h1>
                <ul className={listClassName} ref={state.listRef}>
                    {subNodeList.sort(sortDocumentByAlphabet).map(this.renderSubNode)}
                </ul>
                <Markdown additionalClassName={singleArticleStyle.markdown} text={content}/>
                <ShareButtonList initialContextData={initialContextData} screenContextData={screenContextData}/>
            </>
        );
    }
}
