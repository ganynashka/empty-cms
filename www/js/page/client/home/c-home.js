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
import imageLogo from './image/empty.jpg';

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
        const {slug, imageList, titleImage} = documentData;
        const icon = imageList[0] || '';
        const titleImageSrc = `${fileApiRouteMap.getResizedImage}/${titleImage}?width=1024&height=1024&fit=inside'`;

        return (
            <Link className={homeStyle.home__category_link__wrapper} key={slug} to="#">
                <img alt="" src={fileApiRouteMap.getResizedImage + '/' + icon}/>
                <img alt="" src={titleImageSrc}/>
                <h2>{slug}</h2>
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
