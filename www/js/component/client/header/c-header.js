// @flow

import React, {Component, type Node} from 'react';
import {Link} from 'react-router-dom';

import type {LocationType} from '../../../type/react-router-dom-v5-type-extract';
import {isCMS} from '../../../lib/url';
import {routePathMap} from '../../app/routes-path-map';
import type {ThemeContextType} from '../../../provider/theme/theme-context-type';

type PropsType = {
    +location: LocationType,
    +themeContextData: ThemeContextType,
};

export function Header(props: PropsType): Node {
    const {location, themeContextData} = props;

    console.log(props);

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
            <Link to={routePathMap.siteEnter.path}>Home page</Link>

            <div>theme: {themeContextData.name}</div>

            <h1>Skazki header</h1>
        </div>
    );
}
