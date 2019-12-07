// @flow

import React, {Component, type Node} from 'react';
import {Link} from 'react-router-dom';

import type {LocationType} from '../../../type/react-router-dom-v5-type-extract';
import {isCMS} from '../../../lib/url';
import {routePathMap} from '../../app/routes-path-map';
import type {ThemeContextType} from '../../../provider/theme/theme-context-type';
import type {ScreenContextType} from '../../../provider/screen/screen-context-type';

import headerStyle from './header.scss';

type PropsType = {
    +location: LocationType,
    +themeContextData: ThemeContextType,
    +screenContextData: ScreenContextType,
};

type StateType = {};

export class Header extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);
        this.state = {};
    }

    renderMobile(): Node {
        const {props} = this;
        const {location, themeContextData} = props;

        console.log(props);

        return (
            <>
                <Link to={routePathMap.siteEnter.path}>Home page</Link>

                <div>theme: {themeContextData.name}</div>

                <h1>renderMobile Skazki header</h1>
            </>
        );
    }

    renderDesktop(): Node {
        const {props} = this;
        const {location, themeContextData} = props;

        console.log(props);

        return (
            <>
                <Link to={routePathMap.siteEnter.path}>Home page</Link>

                <div>theme: {themeContextData.name}</div>

                <h1>renderDesktop Skazki header</h1>
            </>
        );
    }

    render(): Node {
        const {props} = this;
        const {location, themeContextData, screenContextData} = props;

        console.log(props);

        if (isCMS(location)) {
            return null;
        }

        return (
            <header className={headerStyle.header__wrapper}>
                {screenContextData.isDesktop ? this.renderDesktop() : this.renderMobile()}
            </header>
        );
    }
}
