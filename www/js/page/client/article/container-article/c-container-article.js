// @flow

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
import type {LocationType} from '../../../../type/react-router-dom-v5-type-extract';
import type {
    AudioPlayerContextType,
    AudioPlayerListItemType,
} from '../../../../provider/audio-player/audio-player-type';
import {AudioPlayerContextConsumer} from '../../../../provider/audio-player/c-audio-player-context';
import {AudioPlayerControl} from '../../../../provider/audio-player/ui/audio-player-control/c-audio-player-control';
// eslint-disable-next-line max-len
import {AudioPlayerPlayList} from '../../../../provider/audio-player/ui/audio-player-play-list/c-audio-player-play-list';
import {defaultAudioPlayerContextData} from '../../../../provider/audio-player/audio-player-const';

type PropsType = {|
    +location: LocationType,
    +initialContextData: InitialDataType,
    +screenContextData: ScreenContextType,
    +audioPlayerContextData: AudioPlayerContextType,
|};

type StateType = null;

const listClassNameMap = {
    [mongoSubDocumentsViewTypeMap.auto]: articleStyle.article__list_image,
    [mongoSubDocumentsViewTypeMap.imageHeader]: articleStyle.article__list_image,
    [mongoSubDocumentsViewTypeMap.audioHeader]: articleStyle.article__list_audio,
    [mongoSubDocumentsViewTypeMap.header]: articleStyle.article__list_header,
};

export class ContainerArticle extends Component<PropsType, StateType> {
    componentDidMount() {
        this.initializeAudioPlayer();
    }

    componentDidUpdate(prevProps: PropsType, prevState: StateType) {
        const {props, state} = this;

        if (!prevProps.initialContextData.articlePathData && props.initialContextData.articlePathData) {
            this.initializeAudioPlayer();
        }
    }

    initializeAudioPlayer() {
        const {props} = this;
        const {initialContextData, audioPlayerContextData} = props;
        const {articlePathData} = initialContextData;

        if (!articlePathData) {
            return;
        }

        const {sudNodeShortDataList} = articlePathData;

        const audioItemList: Array<AudioPlayerListItemType> = sudNodeShortDataList.map<AudioPlayerListItemType>(
            (shortData: MongoDocumentShortDataType): AudioPlayerListItemType => {
                const {fileList, header} = shortData;
                const src = fileList[0] || '';
                const audioSrc = fileApiConst.pathToUploadFiles + '/' + src;

                return {
                    title: header,
                    src: audioSrc,
                };
            }
        );

        audioPlayerContextData.stop();
        audioPlayerContextData.setActiveIndex(defaultAudioPlayerContextData.activeIndex);
        audioPlayerContextData.setPlayList(audioItemList);
    }

    getSubNodeImage(subNode: MongoDocumentShortDataType): string | null {
        const {titleImage, fileList} = subNode;

        if (titleImage.length > 0) {
            return titleImage;
        }

        if (fileList.length > 0) {
            return fileList[0];
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
        const {type, contentLength, fileList} = subNode;

        if (type !== mongoDocumentTypeMap.article) {
            return null;
        }

        const firstFileName = fileList[0] || '';

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

    /*
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
            `.${articleStyle.article__list_audio_item__audio}[data-slug="${nextActiveSubNode.slug}"]`,
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
        const {slug, header, fileList} = subNode;
        const src = fileList[0] || '';
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
*/

    renderHeaderSubNode(subNode: MongoDocumentShortDataType): Node {
        const {slug, header, subDocumentIdList} = subNode;
        const childListLength = subDocumentIdList.length;

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
            // see ths.renderList();
            // return this.renderAudioHeaderSubNode(subNode);
            return null;
        }

        if (mongoSubDocumentsViewTypeMap.header === subDocumentListViewType) {
            return this.renderHeaderSubNode(subNode);
        }

        return this.renderImageHeaderSubNode(subNode);
    };

    renderList(): Node {
        const {props, state} = this;
        const {initialContextData} = props;
        const {articlePathData} = initialContextData;

        if (!articlePathData) {
            return null;
        }

        const {subDocumentListViewType} = articlePathData.mongoDocument;
        const subNodeList = articlePathData.sudNodeShortDataList;
        const listClassName = listClassNameMap[subDocumentListViewType];

        if (mongoSubDocumentsViewTypeMap.audioHeader === subDocumentListViewType) {
            return (
                <AudioPlayerContextConsumer>
                    {(audioPlayerContext: AudioPlayerContextType): Node => {
                        return (
                            <>
                                <AudioPlayerControl audioPlayerContext={audioPlayerContext}/>
                                <AudioPlayerPlayList audioPlayerContext={audioPlayerContext}/>
                            </>
                        );
                    }}
                </AudioPlayerContextConsumer>
            );
        }

        return <ul className={listClassName}>{subNodeList.sort(sortDocumentByAlphabet).map(this.renderSubNode)}</ul>;
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
                {this.renderList()}
                <Markdown additionalClassName={singleArticleStyle.markdown} text={content}/>
                <ShareButtonList
                    initialContextData={initialContextData}
                    location={location}
                    screenContextData={screenContextData}
                />
            </>
        );
    }
}
