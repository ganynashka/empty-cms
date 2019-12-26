// @flow

import React, {Component, type Node} from 'react';

import {Markdown} from '../../../../component/layout/markdown/c-markdown';
import type {InitialDataType} from '../../../../provider/intial-data/intial-data-type';
import articleStyle from '../article.scss';

import singleArticleStyle from './single-article.scss';

type PropsType = {|
    +initialContextData: InitialDataType,
|};

type StateType = {};

export class SingleArticle extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {};
    }

    render(): Node {
        const {props} = this;
        const {initialContextData} = props;
        const {articlePathData} = initialContextData;

        if (!articlePathData) {
            return <h1 className={articleStyle.article__header}>Here is not list of link</h1>;
        }

        const {title, content} = articlePathData;

        return (
            <>
                <h1 className={articleStyle.article__header}>{title}</h1>
                <Markdown additionalClassName={singleArticleStyle.markdown} text={content}/>
            </>
        );
    }
}
