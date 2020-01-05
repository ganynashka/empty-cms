// @flow

/* global location */

import React, {Component, type Node} from 'react';

import type {InitialDataType, RouterStaticContextType} from '../../../provider/intial-data/intial-data-type';
import type {LocationType} from '../../../type/react-router-dom-v5-type-extract';
import articleStyle from '../article/article.scss';

import {PageNotFoundContent} from './page-not-found-content';

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
        return (
            <div className={articleStyle.article__wrapper}>
                <PageNotFoundContent/>
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
