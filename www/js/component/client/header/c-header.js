// @flow

import React, {Component, type Node} from 'react';
import {Link} from 'react-router-dom';
import classNames from 'classnames';

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
import {PageWrapper} from '../../page-wrapper/c-page-wrapper';

import headerStyle from './header.scss';

type PropsType = {
    +location: LocationType,
    +themeContextData: ThemeContextType,
    +screenContextData: ScreenContextType,
    +initialContextData: InitialDataType,
};

type StateType = {|
    +isNavigationMenuOpen: boolean,
|};

export class Header extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            isNavigationMenuOpen: false,
        };
    }

    componentDidMount() {
        this.fetchInitialContextData();

        console.log('---> Header Home did mount');
    }

    componentDidUpdate(prevProps: PropsType, prevState: StateType) {
        const {props} = this;

        if (props.location.pathname !== prevProps.location.pathname) {
            this.fetchInitialContextData();
            this.handleCloseNavigationMenuOpenState();
        }
    }

    handleToggleNavigationMenuOpenState = () => {
        const {state} = this;
        const {isNavigationMenuOpen} = state;

        this.setState({isNavigationMenuOpen: !isNavigationMenuOpen});
    };

    handleCloseNavigationMenuOpenState = () => {
        const {state} = this;
        const {isNavigationMenuOpen} = state;

        this.setState({isNavigationMenuOpen: false});
    };

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

    renderMobile(): Node {
        const {props, state} = this;
        const {location, themeContextData} = props;
        const {isNavigationMenuOpen} = state;

        return (
            <div className={headerStyle.header__desktop__menu_line__wrapper}>
                <nav className={headerStyle.header__mobile__top_line}>
                    <button
                        className={classNames(headerStyle.header__mobile__button__menu, {
                            [headerStyle.header__mobile__button__menu__close]: isNavigationMenuOpen,
                        })}
                        onClick={this.handleToggleNavigationMenuOpenState}
                        title="Меню"
                        type="button"
                    />
                    <Link className={headerStyle.header__desktop__menu_line__link} to={routePathMap.siteEnter.path}>
                        Сказки детям
                    </Link>
                    <button
                        className={headerStyle.header__mobile__button__search}
                        title="Поиск пока не работает"
                        type="button"
                    />
                </nav>
            </div>
        );
    }

    renderMobileMenu(): Node {
        const {props} = this;

        return (
            <PageWrapper additionalClassName={headerStyle.header__mobile__navigation_wrapper} location={props.location}>
                {this.renderDesktopLinkList()}
            </PageWrapper>
        );
    }

    renderDesktopLink(linkData: MongoDocumentTreeNodeType): Node {
        const {slug, title} = linkData;

        return (
            <Link
                className={headerStyle.header__desktop__menu_line__link}
                key={slug}
                to={routePathMap.article.staticPartPath + '/' + slug}
            >
                {title}
            </Link>
        );
    }

    renderDesktopLinkList(): Array<Node> | null {
        const {props} = this;
        const {initialContextData} = props;
        const {documentNodeTree} = initialContextData;

        if (!documentNodeTree) {
            return null;
        }

        return documentNodeTree.subNodeList.map(this.renderDesktopLink);
    }

    renderDesktop(): Node {
        return (
            <>
                <div className={headerStyle.header__desktop__top_line}>
                    <Link className={headerStyle.header__desktop__logo} to={routePathMap.siteEnter.path}>
                        Сказки детям
                    </Link>
                    <input
                        className={headerStyle.header__desktop__search_input}
                        placeholder="Поиск пока не работает"
                        type="text"
                    />
                </div>
                <div className={headerStyle.header__desktop__menu_line__wrapper}>
                    <nav className={headerStyle.header__desktop__menu_line}>{this.renderDesktopLinkList()}</nav>
                </div>
            </>
        );
    }

    render(): Node {
        const {props, state} = this;
        const {location, screenContextData} = props;
        const {isNavigationMenuOpen} = state;

        if (isCMS(location)) {
            return null;
        }

        return (
            <>
                <header className={headerStyle.header__wrapper}>
                    {screenContextData.isDesktop ? this.renderDesktop() : this.renderMobile()}
                </header>
                {!screenContextData.isDesktop && isNavigationMenuOpen ? this.renderMobileMenu() : null}
            </>
        );
    }
}
