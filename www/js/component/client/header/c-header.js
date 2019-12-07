// @flow

import React, {Component, type Node} from 'react';
import {Link} from 'react-router-dom';

import type {LocationType} from '../../../type/react-router-dom-v5-type-extract';
import {isCMS} from '../../../lib/url';
import {routePathMap} from '../../app/routes-path-map';
import type {ThemeContextType} from '../../../provider/theme/theme-context-type';
import type {ScreenContextType} from '../../../provider/screen/screen-context-type';
import type {InitialDataType} from '../../../provider/intial-data/intial-data-type';

import {setMeta} from '../../../lib/meta';
import {getInitialClientData} from '../../app/client-app-helper';
import {isError} from '../../../lib/is';
import {rootPathMetaData} from '../../../provider/intial-data/intial-data-const';

import headerStyle from './header.scss';

type PropsType = {
    +location: LocationType,
    +themeContextData: ThemeContextType,
    +screenContextData: ScreenContextType,
    +initialContextData: InitialDataType,
};

type StateType = {|
    +initialContextData: InitialDataType,
|};

export class Header extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            initialContextData: props.initialContextData,
        };
    }

    componentDidUpdate() {
        console.log('header update');
    }

    componentDidMount() {
        this.fetchInitialContextData();

        console.log('---> Header Home did mount');
    }

    async fetchInitialContextData() {
        const {state} = this;

        if (state.initialContextData.rootPathData) {
            setMeta({
                title: state.initialContextData.title,
                description: state.initialContextData.description,
            });
            return;
        }

        const initialContextData = await getInitialClientData(routePathMap.siteEnter.path);

        if (isError(initialContextData)) {
            setMeta({
                title: rootPathMetaData.title,
                description: rootPathMetaData.description,
            });
            return;
        }

        setMeta({
            title: initialContextData.title,
            description: initialContextData.description,
        });
        this.setState({initialContextData});
    }

    renderLinkList(): Node {
        return null;
    }

    renderMobile(): Node {
        const {props} = this;
        const {location, themeContextData} = props;

        return (
            <>
                <Link to={routePathMap.siteEnter.path}>Home page</Link>
                <div>theme: {themeContextData.name}</div>
                <h1>renderMobile Skazki header</h1>
                <h2>{this.renderLinkList()}</h2>
            </>
        );
    }

    renderDesktop(): Node {
        const {props} = this;
        const {location, themeContextData} = props;

        return (
            <>
                <Link to={routePathMap.siteEnter.path}>Home page</Link>
                <div>theme: {themeContextData.name}</div>
                <h1>renderDesktop Skazki header</h1>
                <h2>{this.renderLinkList()}</h2>
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
