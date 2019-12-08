// @flow

import React, {Component, type Node} from 'react';

import type {InitialDataType} from '../../../provider/intial-data/intial-data-type';
import type {MatchType, RouterHistoryType} from '../../../type/react-router-dom-v5-type-extract';
import {Markdown} from '../../../component/layout/markdown/c-markdown';

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

    renderContent(): Node {
        const {props} = this;
        const {articlePathData} = props.initialContextData;
        const {match} = props;

        if (match === null) {
            console.log('===> Article props.match is not defined!');
            return null;
        }

        const slug = match.params.slug || '';

        if (!articlePathData || articlePathData.slug !== slug) {
            return null;
        }

        return <Markdown text={articlePathData.content}/>;
    }

    render(): Node {
        const {props} = this;
        const {is404} = props.initialContextData;

        if (is404) {
            return (
                <div>
                    <h1>here is no skazka, sorry :(</h1>
                </div>
            );
        }

        return (
            <div>
                <h1>Skazka pro kogoto</h1>
                <hr/>
                {this.renderContent()}
            </div>
        );
    }
}
