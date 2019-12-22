// @flow

import React, {Component, type Node} from 'react';

import type {InitialDataType} from '../../../provider/intial-data/intial-data-type';
import type {MatchType, RouterHistoryType} from '../../../type/react-router-dom-v5-type-extract';
import {Markdown} from '../../../component/layout/markdown/c-markdown';
import serviceStyle from '../../../../css/service.scss';
import {mongoDocumentTypeMap} from '../../../../../server/src/database/database-type';

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

    renderContainerContent(): Node {
        const {props} = this;
        const {initialContextData} = props;
        const {articlePathData} = initialContextData;

        if (!articlePathData) {
            console.error('Article.renderContainerContent has no content');
            return null;
        }

        return <Markdown text={articlePathData.content}/>;
    }

    renderArticleContent(): Node {
        const {props} = this;
        const {initialContextData} = props;
        const {articlePathData} = initialContextData;

        if (!articlePathData) {
            console.error('Article.renderArticleContent has no content');
            return null;
        }

        return <Markdown text={articlePathData.content}/>;
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
            return this.renderArticleContent();
        }

        if (container === type) {
            return this.renderContainerContent();
        }

        console.error('Can not detect article type:', type);
        return null;
    }

    render(): Node {
        return <div className={serviceStyle.width_limit}>{this.renderContent()}</div>;
    }
}
