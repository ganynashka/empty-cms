// @flow

import React, {Component, type Node} from 'react';
import {Link} from 'react-router-dom';

// import type {RenderPageInputDataType} from '../../../component/app/render-route/render-route-type';
import type {InitialDataType} from '../../../../../server/src/intial-data/intial-data-type';
import {routePathMap} from '../../../component/app/routes-path-map';
import {getInitialClientData} from '../../../component/app/client-app-helper';
import {isError} from '../../../lib/is';
import {rootPathMetaData} from '../../../../../server/src/intial-data/intial-data-const';
import type {MongoDocumentType} from '../../../../../server/src/database/database-type';
import {setMeta} from '../../../lib/meta';

import homeStyle from './home.scss';
import imageLogo from './image/empty.jpg';

type PropsType = {
    +initialContextData: InitialDataType,
};

type StateType = {|
    +initialContextData: InitialDataType,
|};

export class Home extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            initialContextData: props.initialContextData,
        };
    }

    componentDidMount() {
        this.fetchInitialContextData();

        console.log('---> Component Home did mount');
    }

    async fetchInitialContextData() {
        const {state} = this;

        if (state.initialContextData.rootPathData) {
            setMeta({
                title: state.initialContextData.title,
                description: state.initialContextData.description,
            });
            return;
        }

        const initialContextData = await getInitialClientData(routePathMap.siteEnter.path);

        if (isError(initialContextData)) {
            setMeta({
                title: rootPathMetaData.title,
                description: rootPathMetaData.description,
            });
            return;
        }

        setMeta({
            title: initialContextData.title,
            description: initialContextData.description,
        });
        this.setState({initialContextData});
    }

    /*
    loadAsyncLoadTestComponent = async (): Promise<Node> => {
        const {AsyncLoadTest} = await import(
            /!* webpackChunkName: 'async-load-test' *!/ '../../component/test/c-async-load-test'
        );

        return <AsyncLoadTest/>;
        <LoadComponent load={this.loadAsyncLoadTestComponent}/>
    };
*/

    renderArticleLinkList(): Node {
        const {state} = this;
        const {initialContextData} = state;
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
        const {state} = this;
        const {initialContextData} = state;

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
