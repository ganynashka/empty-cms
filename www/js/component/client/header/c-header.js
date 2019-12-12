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
import {isError, isFunction} from '../../../lib/is';
import {rootPathMetaData} from '../../../provider/intial-data/intial-data-const';
import type {MongoDocumentTreeNodeType} from '../../../../../server/src/database/database-type';

import headerStyle from './header.scss';

type PropsType = {
    +location: LocationType,
    +themeContextData: ThemeContextType,
    +screenContextData: ScreenContextType,
    +initialContextData: InitialDataType,
};

type StateType = null;

export class Header extends Component<PropsType, StateType> {
    componentDidMount() {
        this.fetchInitialContextData();

        console.log('---> Header Home did mount');
    }

    componentDidUpdate(prevProps: PropsType, prevState: StateType) {
        const {props} = this;

        if (props.location.pathname !== prevProps.location.pathname) {
            this.fetchInitialContextData();
        }
    }

    async fetchInitialContextData() {
        const {props} = this;
        const {location} = props;
        const {setInitialData} = props.initialContextData;

        if (isCMS(location)) {
            return;
        }

        const initialContextData = await getInitialClientData(props.location.pathname);

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

        if (isFunction(setInitialData)) {
            setInitialData(initialContextData);
        } else {
            console.error('initialContextData.setInitialData should be the function!');
        }
    }

    renderLinkList(): Node {
        const {props} = this;
        const {initialContextData} = props;
        const {documentNodeTree} = initialContextData;

        if (!documentNodeTree) {
            return null;
        }

        return <div>{documentNodeTree.subNodeList.map(this.renderLinkInList)}</div>;
    }

    renderLinkInList(linkData: MongoDocumentTreeNodeType): Node {
        const {slug, title} = linkData;

        return (
            <Link key={slug} to={routePathMap.article.staticPartPath + '/' + slug}>
                {title}
            </Link>
        );
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
                <div className={headerStyle.header__desktop__top_line}>
                    <Link className={headerStyle.header__desktop__logo} to={routePathMap.siteEnter.path}>
                        Сказки детям
                    </Link>
                    <input className={headerStyle.header__desktop__search_input} placeholder="Поиск" type="text"/>
                </div>
                <div className={headerStyle.header__desktop__menu_line__wrapper}>
                    <div className={headerStyle.header__desktop__menu_line}>categorise top line</div>
                </div>

                {/*
                <Link to={routePathMap.siteEnter.path}>Home page</Link>
                <div>theme: {themeContextData.name}</div>
                <h1>renderDesktop Skazki header</h1>
                <h2>{this.renderLinkList()}</h2>
*/}
            </>
        );
    }

    render(): Node {
        const {props} = this;
        const {location, screenContextData} = props;

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
