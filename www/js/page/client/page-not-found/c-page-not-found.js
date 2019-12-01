// @flow

/* global location */

import React, {Component, type Node} from 'react';
import {Link} from 'react-router-dom';

import type {InitialDataType} from '../../../../../server/src/intial-data/intial-data-type';
import {routePathMap} from '../../../component/app/routes-path-map';
import type {LocationType} from '../../../type/react-router-dom-v5-type-extract';

type PropsType = {
    +initialContextData: InitialDataType,
    +location: LocationType,
};

type StateType = null;

// eslint-disable-next-line react/prefer-stateless-function
export class PageNotFound extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        // Object.assign(props.staticContext || {}, {is404: true});
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
    }
}
