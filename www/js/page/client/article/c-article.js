// @flow

import React, {Component, type Node} from 'react';

import type {InitialDataType} from '../../../provider/intial-data/intial-data-type';
import type {MatchType, RouterHistoryType} from '../../../type/react-router-dom-v5-type-extract';
import {mongoDocumentTypeMap} from '../../../../../server/src/database/database-type';

import articleStyle from './article.scss';
import {SingleArticle} from './single-article/c-single-article';
import {ContainerArticle} from './container-article/c-container-article';

type PropsType = {
    +initialContextData: InitialDataType,
    +match: MatchType | null,
    +history: RouterHistoryType,
};

type StateType = null;

export class Article extends Component<PropsType, StateType> {
    componentDidMount() {
        console.log('---> Component Article did mount');
    }

    shouldComponentUpdate(nextProps: PropsType, nextState: StateType, nextContext: mixed): boolean {
        const {props} = this;

        return Boolean(props.match && nextProps.match);
    }

    // eslint-disable-next-line complexity
    renderContent(): Node {
        const {props} = this;
        const {initialContextData, match} = props;
        const {is404, articlePathData} = initialContextData;

        if (is404) {
            return <h1>here is no skazka, sorry :(</h1>;
        }

        if (match === null) {
            console.log('===> Article props.match is not defined!');
            return null;
        }

        const slug = match.params.slug || '';

        if (!articlePathData || articlePathData.slug !== slug) {
            return null;
        }

        const {type} = articlePathData;
        const {article, container} = mongoDocumentTypeMap;

        if (article === type) {
            return <SingleArticle initialContextData={initialContextData}/>;
        }

        if (container === type) {
            return <ContainerArticle initialContextData={initialContextData}/>;
        }

        console.error('Can not detect article type:', type);
        return <h1>Unsupported document type: {type}</h1>;
    }

    render(): Node {
        return <div className={articleStyle.article__wrapper}>{this.renderContent()}</div>;
    }
}
