// @flow

/* eslint-disable jsx-a11y/media-has-caption */

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
import {mongoSubDocumentsViewTypeMap} from '../../../../../../server/src/database/database-type';
import {BreadcrumbList} from '../../../../component/layout/breadcrumb-list/c-breadcrumb-list';
import {fileApiConst} from '../../../../../../server/src/api/part/file-api-const';

type PropsType = {|
    +initialContextData: InitialDataType,
    +screenContextData: ScreenContextType,
|};

type StateType = {};

const listClassNameMap = {
    [mongoSubDocumentsViewTypeMap.auto]: articleStyle.article__list_image,
    [mongoSubDocumentsViewTypeMap.imageHeader]: articleStyle.article__list_image,
    [mongoSubDocumentsViewTypeMap.audioHeader]: articleStyle.article__list_audio,
    [mongoSubDocumentsViewTypeMap.header]: articleStyle.article__list_header,
};

export class ContainerArticle extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {};
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
            </li>
        );
    }

    renderAudioHeaderSubNode(subNode: MongoDocumentShortDataType): Node {
        const {props} = this;
        const {slug, header, imageList, type} = subNode;
        const src = imageList[0] || '';

        const audioSrc = fileApiConst.pathToUploadFiles + '/' + src;

        return (
            <li className={articleStyle.article__list_audio_item} key={slug}>
                <Link
                    className={articleStyle.article__list_audio_item__link}
                    key={slug}
                    to={getLinkToReadArticle(slug)}
                >
                    {header} - {type}
                </Link>
                <audio
                    className={articleStyle.article__list_audio_item__audio}
                    controls
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
                {/* {String(index + 1).padStart(String(array.length + 1).length, '0')}.&nbsp;*/}
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

    renderSubNode = (
        subNode: MongoDocumentShortDataType
        // index: number,
        // array: Array<MongoDocumentTreeNodeType>
    ): Node => {
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
        const {props} = this;
        const {initialContextData} = props;
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
                <ul className={listClassName}>{subNodeList.sort(sortDocumentByAlphabet).map(this.renderSubNode)}</ul>
                <Markdown text={content}/>
            </>
        );
    }
}
