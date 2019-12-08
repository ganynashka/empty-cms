// @flow

import React, {Component, type Node} from 'react';
import {Link} from 'react-router-dom';

import type {InitialDataType} from '../../../provider/intial-data/intial-data-type';
import {routePathMap} from '../../../component/app/routes-path-map';
import type {MongoDocumentType} from '../../../../../server/src/database/database-type';

import homeStyle from './home.scss';
import imageLogo from './image/empty.jpg';

type PropsType = {
    +initialContextData: InitialDataType,
};

type StateType = null;

export class Home extends Component<PropsType, StateType> {
    componentDidMount() {
        // this.fetchInitialContextData();

        console.log('---> Component Home did mount');
    }

    renderArticleLinkList(): Node {
        const {props} = this;
        const {initialContextData} = props;
        const {rootPathData} = initialContextData;

        if (!rootPathData) {
            return null;
        }

        return (
            <div>
                {rootPathData.subDocumentList.map((article: MongoDocumentType): Node => {
                    return (
                        <p key={article.slug}>
                            <Link to={routePathMap.article.staticPartPath + '/' + article.slug}>{article.title}</Link>
                            <br/>
                            <Link to={routePathMap.article.staticPartPath + '/' + article.slug + '1'}>
                                {article.title} wrong
                            </Link>
                        </p>
                    );
                })}
            </div>
        );
    }

    render(): Node {
        const {props} = this;
        const {initialContextData} = props;

        return (
            <div>
                <h1>Skazki</h1>
                <hr/>
                {this.renderArticleLinkList()}
                <hr/>
                <Link to="/qweqeqwe/s">Not me</Link>
                <hr/>
                <p style={{wordBreak: 'break-all'}}>{JSON.stringify(initialContextData.rootPathData)}</p>
            </div>
        );
    }
}
