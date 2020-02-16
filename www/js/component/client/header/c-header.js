// @flow

import React, {Component, type Node} from 'react';
import {Link} from 'react-router-dom';
import classNames from 'classnames';

import type {LocationType} from '../../../type/react-router-dom-v5-type-extract';
import {isCMS} from '../../../lib/url';
import {routePathMap} from '../../app/routes-path-map';
import type {ThemeContextType} from '../../../provider/theme/theme-context-type';
import type {ScreenContextType} from '../../../provider/screen/screen-context-type';
import type {InitialDataType, SetInitialDataArgumentType} from '../../../provider/intial-data/intial-data-type';
import {setMeta} from '../../../lib/meta';
import {getInitialClientData} from '../../app/client-app-helper';
import {isError, isFunction} from '../../../lib/is';
import type {
    MongoDocumentShortDataType,
    MongoDocumentTreeNodeType,
} from '../../../../../server/src/database/database-type';
import {Search} from '../search/c-search';
import {getLinkToReadArticle} from '../../../lib/string';
import {isMobileDevice} from '../../../../../server/src/util/device/device-helper';
import {scrollToTop} from '../../../lib/screen';
import {mongoDocumentTypeMap, mongoSubDocumentsViewTypeMap} from '../../../../../server/src/database/database-type';
import {rootPathMetaData} from '../../../provider/intial-data/intial-data-const';

import faviconImage from './image/favicon.svg';
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

        console.log('---> Header did MOUNT');
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

        const data: SetInitialDataArgumentType = {
            header: '',
            title: '',
            meta: '',
            is404: false,
            articlePathData: {
                mongoDocument: {
                    slug:
                        location.pathname
                            .split('/')
                            .filter(Boolean)
                            .pop() || '',
                    titleImage: '',
                    type: mongoDocumentTypeMap.article,
                    subDocumentListViewType: mongoSubDocumentsViewTypeMap.header,
                    title: 'Ошибка соединения',
                    header: '',
                    author: '',
                    illustrator: '',
                    artist: '',
                    publicationDate: 0,
                    meta: '',
                    shortDescription: '',
                    content: 'Ошибка соединения. Проверьте наличие интернета и обновите страницу.',
                    createdDate: 0,
                    updatedDate: 0,
                    subDocumentSlugList: [],
                    tagList: [],
                    rating: 0,
                    isActive: true,
                    isInSiteMap: false,
                    fileList: [],
                },
                sudNodeShortDataList: [],
            },
            // documentNodeTree: props.initialContextData.documentNodeTree,
            setInitialData: null,
            device: props.initialContextData.device,
        };

        setInitialData(data);

        setMeta({
            title: 'Ошибка соединения',
        });

        scrollToTop();
    }

    async fetchInitialContextData() {
        const {props} = this;
        const {location} = props;
        const {setInitialData} = props.initialContextData;

        if (isCMS(location)) {
            return;
        }

        const initialContextData = await getInitialClientData(props.location.pathname, 1);

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
    }

    getIsActiveLink(linkData: MongoDocumentShortDataType): boolean {
        const {props} = this;
        const {initialContextData} = props;
        const {parentNodeList} = initialContextData;
        const parentNodeListLength = parentNodeList.length;

        if (parentNodeListLength <= 1) {
            return false;
        }

        const mainCategoryNode = parentNodeList[parentNodeListLength - 2];

        if (!mainCategoryNode) {
            return false;
        }

        return linkData.slug === mainCategoryNode.slug;
    }

    // ---- mobile

    renderMobile(): Node {
        return (
            <div className={headerStyle.header__desktop__menu_line__wrapper}>
                <div className={headerStyle.header__mobile__top_line}>{this.getMobileHeaderContent()}</div>
            </div>
        );
    }

    getMobileHeaderContent(): Array<Node> {
        const {state, props} = this;
        const {isNavigationMenuOpen, isSearchActive} = state;
        const {screenContextData, initialContextData, location} = props;

        if (isSearchActive) {
            return [
                <Search
                    initialContextData={initialContextData}
                    key="search"
                    location={location}
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
                className={headerStyle.header__mobile__logo__link}
                key="header-mobile-home-link"
                title={rootPathMetaData.header}
                to={routePathMap.siteEnter.path}
            >
                <img
                    alt={rootPathMetaData.header}
                    className={headerStyle.header__mobile__logo__link__image}
                    src={faviconImage}
                />
            </Link>,
            <Search
                initialContextData={initialContextData}
                key="search"
                location={location}
                onActiveChange={this.handleSearchActive}
                screenContextData={screenContextData}
            />,
        ];
    }

    renderMobileMenu(): Node {
        const {props} = this;
        const {location} = props;
        const rootPath = routePathMap.siteEnter.path;

        const rootClassName = classNames(headerStyle.header__mobile__menu_line__link, {
            [headerStyle.header__mobile__menu_line__link__active]: location.pathname === rootPath,
        });

        return (
            <nav className={headerStyle.header__mobile__navigation_wrapper}>
                <Link className={rootClassName} key="root" to={rootPath}>
                    Главная
                </Link>
                {this.renderMobileLinkList()}
            </nav>
        );
    }

    renderMobileLinkList(): Array<Node> | null {
        const {props} = this;
        const {initialContextData} = props;
        const {headerData} = initialContextData;

        if (!headerData) {
            return null;
        }

        return headerData.documentShortDataList.map(this.renderMobileLink);
    }

    renderMobileLink = (linkData: MongoDocumentShortDataType): Node => {
        const {slug, header} = linkData;

        const className = classNames(headerStyle.header__mobile__menu_line__link, {
            [headerStyle.header__mobile__menu_line__link__active]: this.getIsActiveLink(linkData),
        });

        return (
            <Link className={className} key={slug} to={getLinkToReadArticle(slug)}>
                {header}
            </Link>
        );
    };

    // ---- desktop

    renderDesktop(): Node {
        const {props} = this;
        const {screenContextData, initialContextData, location} = props;

        return (
            <>
                <div className={headerStyle.header__desktop__top_line}>
                    <Link
                        className={headerStyle.header__desktop__logo}
                        title={rootPathMetaData.header}
                        to={routePathMap.siteEnter.path}
                    >
                        <img
                            alt={rootPathMetaData.header}
                            className={headerStyle.header__desktop__logo__image}
                            src={faviconImage}
                        />
                        <span className={headerStyle.header__desktop__logo__title}>{rootPathMetaData.header}</span>
                    </Link>
                    <Search
                        initialContextData={initialContextData}
                        key="search"
                        location={location}
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

    renderDesktopLinkList(): Array<Node> | null {
        const {props} = this;
        const {initialContextData} = props;
        const {headerData} = initialContextData;

        if (!headerData) {
            return null;
        }

        return headerData.documentShortDataList.map(this.renderDesktopLink);
    }

    renderDesktopLink = (linkData: MongoDocumentShortDataType): Node => {
        const {slug, header} = linkData;

        const className = classNames(headerStyle.header__desktop__menu_line__link, {
            [headerStyle.header__desktop__menu_line__link__active]: this.getIsActiveLink(linkData),
        });

        return (
            <Link className={className} key={slug} to={getLinkToReadArticle(slug)}>
                {header}
            </Link>
        );
    };

    // ---- main render

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
        const {isScriptLoaded} = screenContextData;

        if (isCMS(location)) {
            return null;
        }

        return isScriptLoaded ? this.renderClientSide() : this.renderServerSide();
    }
}
