// @flow

import React, {Component, type Node} from 'react';
import {Link} from 'react-router-dom';

import type {ContextRouterType} from '../../../type/react-router-dom-v5-type-extract';
import {isCMS} from '../../../lib/url';
import {routePathMap} from '../../app/routes-path-map';

export function Header(props: ContextRouterType): Node {
    const {location} = props;

    if (isCMS(location)) {
        return null;
    }

    return (
        <div>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <Link to={routePathMap.siteEnter.path}>Home page</Link>

            <h1>Skazki header</h1>
        </div>
    );
}
