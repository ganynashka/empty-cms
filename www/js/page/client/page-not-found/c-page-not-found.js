// @flow

/* global location */

import React, {Component, type Node} from 'react';

import type {InitialDataType, RouterStaticContextType} from '../../../provider/intial-data/intial-data-type';
import type {LocationType} from '../../../type/react-router-dom-v5-type-extract';
import articleStyle from '../article/article.scss';
import {Markdown} from '../../../component/layout/markdown/c-markdown';
import singleArticleStyle from '../article/single-article/single-article.scss';

import pageNoFoundStyle from './page-not-found.scss';

type PropsType = {
    +initialContextData: InitialDataType,
    +location: LocationType,
    +staticContext?: RouterStaticContextType,
};

type StateType = null;

// eslint-disable-next-line react/prefer-stateless-function
export class PageNotFound extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        Object.assign(props.staticContext || {}, {is404: true});
    }

    componentDidUpdate(prevProps: PropsType, prevState: StateType, prevContext: *): * {
        const {props} = this;

        if (typeof location === 'undefined') {
            console.error('PageNotFound: location is not define');
            return;
        }

        if (prevProps.location.pathname === props.location.pathname) {
            return;
        }

        location.reload();
    }

    render(): Node {
        const {props} = this;
        const {initialContextData} = props;

        return (
            <div className={articleStyle.article__wrapper}>
                <div className={pageNoFoundStyle.page_not_found__wrapper}>
                    <h1 className={articleStyle.article__header}>404 - Страница не найдена</h1>
                    <Markdown
                        additionalClassName={singleArticleStyle.markdown}
                        text="Всё хорошо, вы всё равно можете почитать у нас сказки, стихи и многое другое!"
                    />
                </div>
            </div>
        );

        /*
        if (initialContextData.is404) {
            return (
                <div>
                    <span>Page Not Found, Sorry on server :(</span>
                    <br/>
                    <a href={routePathMap.siteEnter.path}>to home with reload page</a>
                </div>
            );
        }

        return (
            <div>
                <span>Page Not Found, Sorry on client :(</span>
                <br/>
                <Link to={routePathMap.siteEnter.path}>to home without reload page</Link>
            </div>
        );
*/
    }
}
