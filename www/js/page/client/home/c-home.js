// @flow

import React, {Component, type Node} from 'react';
import {Link} from 'react-router-dom';

import type {InitialDataType} from '../../../provider/intial-data/intial-data-type';
import type {MongoDocumentType} from '../../../../../server/src/database/database-type';
import type {LocationType, MatchType} from '../../../type/react-router-dom-v5-type-extract';
import serviceStyle from '../../../../css/service.scss';
import {Markdown} from '../../../component/layout/markdown/c-markdown';
import type {ScreenContextType} from '../../../provider/screen/screen-context-type';
import {getResizedImageSrc} from '../../../lib/url';
import {getLinkToReadArticle} from '../../../lib/string';
import {PageLoading} from '../../../component/client/page-loading/c-page-loading';
import {ErrorConnectionContent} from '../article/error-connection-content/c-error-connection-content';
import articleStyle from '../article/article.scss';

import homeStyle from './home.scss';

type PropsType = {
    +location: LocationType,
    +initialContextData: InitialDataType,
    +screenContextData: ScreenContextType,
    +match: MatchType | null,
};

type StateType = null;

export class Home extends Component<PropsType, StateType> {
    componentDidMount() {
        console.log('---> Component Home did mount');
    }

    renderCategoryLink = (documentData: MongoDocumentType): Node => {
        const {props} = this;
        const {screenContextData} = props;
        const {devicePixelRatio} = screenContextData;
        const {slug, titleImage, header, shortDescription} = documentData;
        const imageSize = 120;
        const titleImageSrc = getResizedImageSrc({
            src: titleImage,
            width: imageSize,
            height: imageSize,
            aspectRatio: devicePixelRatio,
        });

        return (
            <Link className={homeStyle.home__category_link__wrapper} key={slug} to={getLinkToReadArticle(slug)}>
                <img
                    alt={header}
                    className={homeStyle.home__category_link__icon}
                    height={imageSize}
                    loading="lazy"
                    src={titleImageSrc}
                    width={imageSize}
                />
                <div className={homeStyle.home__category_link__text_content}>
                    <h2 className={homeStyle.home__category_link__title}>{header}</h2>
                    <Markdown
                        additionalClassName={homeStyle.home__category_link__short_description}
                        text={shortDescription}
                    />
                </div>
            </Link>
        );
    };

    renderCategoryLinkList(): Node {
        const {props} = this;
        const {initialContextData} = props;
        const {rootPathData} = initialContextData;

        if (!rootPathData) {
            return null;
        }

        return (
            <div className={homeStyle.home__category_list}>
                {rootPathData.subDocumentList.map(this.renderCategoryLink)}
            </div>
        );
    }

    renderRootDocument(): Node {
        const {props} = this;
        const {initialContextData} = props;
        const {rootPathData} = initialContextData;

        if (!rootPathData) {
            return null;
        }

        return <Markdown text={rootPathData.mongoDocument.content}/>;
    }

    render(): Node {
        const {props} = this;
        const {initialContextData, location} = props;
        const {rootPathData, isConnectionError} = initialContextData;

        if (isConnectionError === true) {
            return (
                <div className={articleStyle.article__wrapper}>
                    <ErrorConnectionContent initialContextData={initialContextData} location={location}/>
                </div>
            );
        }

        if (!rootPathData) {
            return (
                <div className={serviceStyle.width_limit} key="loading">
                    <PageLoading/>
                </div>
            );
        }

        return (
            <div className={serviceStyle.width_limit} key="loaded">
                {this.renderRootDocument()}
                {this.renderCategoryLinkList()}
            </div>
        );
    }
}
