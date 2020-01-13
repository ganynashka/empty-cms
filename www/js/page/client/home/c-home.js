// @flow

import React, {Component, type Node} from 'react';
import {Link} from 'react-router-dom';

import type {InitialDataType} from '../../../provider/intial-data/intial-data-type';
import type {MongoDocumentTreeNodeType} from '../../../../../server/src/database/database-type';
import type {MatchType} from '../../../type/react-router-dom-v5-type-extract';
import serviceStyle from '../../../../css/service.scss';
import {Markdown} from '../../../component/layout/markdown/c-markdown';
import type {ScreenContextType} from '../../../provider/screen/screen-context-type';
import {getResizedInsideImageSrc} from '../../../lib/url';
import {getLinkToReadArticle} from '../../../lib/string';
import {PageLoading} from '../../../component/client/page-loading/c-page-loading';

import homeStyle from './home.scss';

type PropsType = {
    +initialContextData: InitialDataType,
    +screenContextData: ScreenContextType,
    +match: MatchType | null,
};

type StateType = null;

export class Home extends Component<PropsType, StateType> {
    componentDidMount() {
        console.log('---> Component Home did mount');
    }

    renderCategoryLink = (documentData: MongoDocumentTreeNodeType): Node => {
        const {props} = this;
        const {screenContextData} = props;
        const {devicePixelRatio} = screenContextData;
        const {slug, titleImage, header, shortDescription} = documentData;
        const titleImageSrc = getResizedInsideImageSrc(titleImage, 120, 120, devicePixelRatio); // `${fileApiRouteMap.getResizedImage}/${titleImage}?width=${maxImageSize}&height=${maxImageSize}&fit=inside`;

        return (
            <Link className={homeStyle.home__category_link__wrapper} key={slug} to={getLinkToReadArticle(slug)}>
                <img alt={header} className={homeStyle.home__category_link__icon} src={titleImageSrc}/>
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
        const {documentNodeTree} = initialContextData;

        if (!documentNodeTree) {
            return null;
        }

        return (
            <div className={homeStyle.home__category_list}>
                {documentNodeTree.subNodeList.map(this.renderCategoryLink)}
            </div>
        );
    }

    renderRootDocument(): Node {
        const {props} = this;
        const {initialContextData} = props;
        const {documentNodeTree} = initialContextData;

        if (!documentNodeTree) {
            return null;
        }

        return <Markdown text={documentNodeTree.content}/>;
    }

    render(): Node {
        const {props} = this;
        const {initialContextData} = props;
        const {documentNodeTree} = initialContextData;

        if (!documentNodeTree) {
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
