// @flow

import React, {Component, type Node} from 'react';
import {Link} from 'react-router-dom';

// import type {RenderPageInputDataType} from '../../../component/app/render-route/render-route-type';
import type {InitialDataType} from '../../../../../server/src/intial-data/intial-data-type';

import {routePathMap} from '../../../component/app/routes-path-map';
import {getInitialClientData} from '../../../component/app/client-app-helper';
import {isError} from '../../../lib/is';

import type {MongoDocumentType} from '../../../../../server/src/database/database-type';

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

        console.log(props);

        this.state = {
            initialContextData: props.initialContextData,
        };
    }

    componentDidMount() {
        this.fetchInitialContextData();

        // fetch initialContextData

        console.log('---> Component Home did mount');
    }

    async fetchInitialContextData() {
        const {state} = this;

        if (state.initialContextData.rootPathData) {
            return;
        }

        const initialContextData = await getInitialClientData(routePathMap.siteEnter.path);

        if (isError(initialContextData)) {
            return;
        }

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
                        <Link key={article.slug} to={article.slug}>
                            {article.title}
                        </Link>
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
                <p>{JSON.stringify(initialContextData.rootPathData)}</p>
            </div>
        );
    }
}
