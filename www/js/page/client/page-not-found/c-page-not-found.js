// @flow

import React, {Component, type Node} from 'react';
import {Link} from 'react-router-dom';

import type {InitialDataType} from '../../../../../server/src/intial-data/intial-data-type';
import {routePathMap} from '../../../component/app/routes-path-map';

type PropsType = {
    +initialContextData: InitialDataType,
};

type StateType = null;

// eslint-disable-next-line react/prefer-stateless-function
export class PageNotFound extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        // Object.assign(props.staticContext || {}, {is404: true});
    }

    render(): Node {
        const {props} = this;
        const {initialContextData} = props;

        console.log(this.props);

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
                <span>Page Not Found, Sorry on server :(</span>
                <br/>
                <Link to={routePathMap.siteEnter.path}>to home without reload page</Link>
            </div>
        );
    }
}
