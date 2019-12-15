// @flow

import React, {Component, type Node} from 'react';
import {Link} from 'react-router-dom';

import type {InitialDataType} from '../../../provider/intial-data/intial-data-type';
import {routePathMap} from '../../../component/app/routes-path-map';
import type {MongoDocumentType} from '../../../../../server/src/database/database-type';
import type {MatchType} from '../../../type/react-router-dom-v5-type-extract';
import serviceStyle from '../../../../css/service.scss';
import {Footer} from '../../../component/client/footer/c-footer';
import {Markdown} from '../../../component/layout/markdown/c-markdown';
import {fileApiRouteMap} from '../../../../../server/src/api/api-route-map';

import homeStyle from './home.scss';

type PropsType = {
    +initialContextData: InitialDataType,
    +match: MatchType | null,
};

type StateType = null;

export class Home extends Component<PropsType, StateType> {
    componentDidMount() {
        // this.fetchInitialContextData();

        console.log('---> Component Home did mount');
    }

    renderCategoryLink(documentData: MongoDocumentType): Node {
        const {slug, imageList, titleImage, title} = documentData;
        const icon = imageList[0] || '';
        const titleImageSrc = `${fileApiRouteMap.getResizedImage}/${titleImage}?width=1024&height=1024&fit=inside`;

        return (
            <Link className={homeStyle.home__category_link__wrapper} key={slug} to="#">
                <img
                    alt={title}
                    className={homeStyle.home__category_link__icon}
                    src={fileApiRouteMap.getResizedImage + '/' + icon}
                />
                <h2 className={homeStyle.home__category_link__title}>{title}</h2>
                <span
                    className={homeStyle.home__category_link__background}
                    style={{backgroundImage: 'url(' + titleImageSrc + ')'}}
                />
            </Link>
        );
    }

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
                {rootPathData.subDocumentList.map(this.renderCategoryLink)}
                {rootPathData.subDocumentList.map(this.renderCategoryLink)}
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

        return <Markdown text={rootPathData.rootDocument.content}/>;
    }

    render(): Node {
        const {props} = this;
        const {initialContextData} = props;

        return (
            <>
                <div className={serviceStyle.width_limit}>
                    {this.renderRootDocument()}
                    {this.renderCategoryLinkList()}
                </div>
                <Footer/>
            </>
        );
    }
}
