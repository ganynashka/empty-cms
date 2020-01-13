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
import type {MongoDocumentTreeNodeType} from '../../../../../server/src/database/database-type';
import {Search} from '../search/c-search';
import {getLinkToReadArticle} from '../../../lib/string';
import {isMobileDevice} from '../../../../../server/src/util/device/device-helper';
import {scrollToTop} from '../../../provider/screen/screen-context-helper';
import {mongoDocumentTypeMap} from '../../../../../server/src/database/database-type';

import headerStyle from './header.scss';

type PropsType = {
    +location: LocationType,
    +themeContextData: ThemeContextType,
    +screenContextData: ScreenContextType,
    +initialContextData: InitialDataType,
};

type StateType = {|
    +isNavigationMenuOpen: boolean,
    +isSearchActive: boolean,
|};

export class Header extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            isNavigationMenuOpen: false,
            isSearchActive: false,
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
        this.setState({isNavigationMenuOpen: false});
    };

    handleSearchActive = (isSearchActive: boolean) => {
        this.setState({isSearchActive});
    };

    errorInitialContextData(error: Error) {
        const {props} = this;
        const {location} = props;
        const {setInitialData} = props.initialContextData;

        if (!isFunction(setInitialData)) {
            console.error('initialContextData.setInitialData should be the function!');
            return;
        }

        setInitialData({
            title: '',
            meta: '',
            is404: false,
            articlePathData: {
                slug: location.pathname
                    .split('/')
                    .filter(Boolean)
                    .pop(),
                titleImage: '',
                type: mongoDocumentTypeMap.article,
                title: 'Ошибка соединения',
                meta: '',
                shortDescription: '',
                content: 'Ошибка соединения. Проверьте наличие интернета и обновите страницу.',
                subNodeList: [],
                subDocumentSlugList: [],
                isActive: true,
                imageList: [],
            },
            documentNodeTree: props.initialContextData.documentNodeTree,
            setInitialData: null,
            device: props.initialContextData.device,
        });

        scrollToTop();

        setMeta({
            title: 'Ошибка соединения',
        });
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
            this.errorInitialContextData(initialContextData);
            return;
        }

        if (!isFunction(setInitialData)) {
            console.error('initialContextData.setInitialData should be the function!');
            return;
        }

        setInitialData(initialContextData);

        setMeta({
            title: initialContextData.title,
        });

        scrollToTop();
    }

    getMobileHeaderContent(): Array<Node> {
        const {state, props} = this;
        const {isNavigationMenuOpen, isSearchActive} = state;
        const {screenContextData, initialContextData} = props;

        if (isSearchActive) {
            return [
                <Search
                    initialContextData={initialContextData}
                    key="search"
                    onActiveChange={this.handleSearchActive}
                    screenContextData={screenContextData}
                />,
            ];
        }

        return [
            <button
                className={classNames(headerStyle.header__mobile__button__menu, {
                    [headerStyle.header__mobile__button__menu__close]: isNavigationMenuOpen,
                })}
                key="header-mobile-menu-button"
                onClick={this.handleToggleNavigationMenuOpenState}
                title="Меню"
                type="button"
            />,
            <Link
                className={headerStyle.header__desktop__menu_line__link}
                key="header-mobile-home-link"
                to={routePathMap.siteEnter.path}
            >
                Сказки детям
            </Link>,
            <Search
                initialContextData={initialContextData}
                key="search"
                onActiveChange={this.handleSearchActive}
                screenContextData={screenContextData}
            />,
        ];
    }

    renderMobile(): Node {
        return (
            <div className={headerStyle.header__desktop__menu_line__wrapper}>
                <div className={headerStyle.header__mobile__top_line}>{this.getMobileHeaderContent()}</div>
            </div>
        );
    }

    renderMobileMenu(): Node {
        return <nav className={headerStyle.header__mobile__navigation_wrapper}>{this.renderDesktopLinkList()}</nav>;
    }

    renderDesktopLink(linkData: MongoDocumentTreeNodeType): Node {
        const {slug, header} = linkData;

        return (
            <Link className={headerStyle.header__desktop__menu_line__link} key={slug} to={getLinkToReadArticle(slug)}>
                {header}
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
        const {props} = this;
        const {screenContextData, initialContextData} = props;

        return (
            <>
                <div className={headerStyle.header__desktop__top_line}>
                    <Link className={headerStyle.header__desktop__logo} to={routePathMap.siteEnter.path}>
                        Сказки детям
                    </Link>
                    <Search
                        initialContextData={initialContextData}
                        key="search"
                        onActiveChange={this.handleSearchActive}
                        screenContextData={screenContextData}
                    />
                </div>
                <div className={headerStyle.header__desktop__menu_line__wrapper}>
                    <nav className={headerStyle.header__desktop__menu_line}>{this.renderDesktopLinkList()}</nav>
                </div>
            </>
        );
    }

    renderServerSide(): Node {
        const {props} = this;
        const {initialContextData} = props;
        const {device} = initialContextData;

        if (!device) {
            return this.renderClientSide();
        }

        return (
            <header className={headerStyle.header__wrapper}>
                {isMobileDevice(device) ? this.renderMobile() : this.renderDesktop()}
            </header>
        );
    }

    renderClientSide(): Node {
        const {props, state} = this;
        const {screenContextData} = props;
        const {isNavigationMenuOpen} = state;
        const {isDesktop} = screenContextData;

        return (
            <>
                <header className={headerStyle.header__wrapper}>
                    {isDesktop ? this.renderDesktop() : this.renderMobile()}
                </header>
                {!isDesktop && isNavigationMenuOpen ? this.renderMobileMenu() : null}
            </>
        );
    }

    render(): Node {
        const {props} = this;
        const {location, screenContextData} = props;
        const {isLoaded} = screenContextData;

        if (isCMS(location)) {
            return null;
        }

        return isLoaded ? this.renderClientSide() : this.renderServerSide();
    }
}
