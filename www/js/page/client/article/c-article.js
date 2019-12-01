// @flow

import React, {Component, type Node} from 'react';

import type {RenderPageInputDataType} from '../../../component/app/render-route/render-route-type';
import type {InitialDataType} from '../../../../../server/src/intial-data/intial-data-type';
import {getInitialClientData} from '../../../component/app/client-app-helper';
import {routePathMap} from '../../../component/app/routes-path-map';
import {isError} from '../../../lib/is';
import type {MatchType, RouterHistoryType} from '../../../type/react-router-dom-v5-type-extract';
import {setMeta} from '../../../lib/meta';
import {rootPathMetaData, page404InitialData} from '../../../../../server/src/intial-data/intial-data-const';
import {Markdown} from '../../../component/layout/markdown/c-markdown';

type PropsType = {
    +initialContextData: InitialDataType,
    +match: MatchType | null,
    +history: RouterHistoryType,
};

type StateType = {|
    +initialContextData: InitialDataType,
|};

export class Article extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            initialContextData: props.initialContextData,
        };
    }

    componentDidMount() {
        this.fetchInitialContextData();

        console.log('---> Component Article did mount');
    }

    // eslint-disable-next-line complexity, max-statements
    async fetchInitialContextData() {
        const {props, state} = this;
        const {articlePathData} = state.initialContextData;
        const {match, history} = props;

        if (match === null) {
            console.error('DocumentEdit props.match is not defined!');
            return;
        }

        const slug = match.params.slug || '';

        if (articlePathData && articlePathData.slug === slug) {
            return;
        }

        const initialContextData = await getInitialClientData(routePathMap.article.staticPartPath + '/' + slug);

        if (isError(initialContextData)) {
            setMeta({
                title: rootPathMetaData.title,
                description: rootPathMetaData.description,
            });
            console.error('---> Can not get initial data!');
            return;
        }

        if (initialContextData.is404) {
            setMeta({
                title: page404InitialData.title,
                description: page404InitialData.description,
            });
            console.error('---> Article is not exists!');
            return;
        }

        if (!initialContextData.articlePathData) {
            setMeta({
                title: page404InitialData.title,
                description: page404InitialData.description,
            });
            console.error('---> Can not get article data!');
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

    renderContent(): Node {
        const {props, state} = this;
        const {articlePathData} = state.initialContextData;
        const {match} = props;

        if (match === null) {
            console.error('DocumentEdit props.match is not defined!');
            return null;
        }

        const slug = match.params.slug || '';

        if (!articlePathData || articlePathData.slug !== slug) {
            return null;
        }

        return <Markdown text={articlePathData.content}/>;
    }

    render(): Node {
        return (
            <div>
                <h1>Skazki pro kogoto</h1>
                <hr/>
                {this.renderContent()}
            </div>
        );
    }
}
