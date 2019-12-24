// @flow

/* global setTimeout */

import React, {Component, type Node} from 'react';
import {Link} from 'react-router-dom';
import classNames from 'classnames';

import type {ScreenContextType} from '../../../provider/screen/screen-context-type';
import type {MongoDocumentType} from '../../../../../server/src/database/database-type';

import searchStyle from './search.scss';

type PropsType = {|
    +onActiveChange: (isActive: boolean) => mixed,
    +screenContextData: ScreenContextType,
|};

type StateType = {|
    +isActive: boolean,
    +searchText: string,
    +resultList: Array<MongoDocumentType>,
|};

const minSearchSymbolCount = 3;

export class Search extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            isActive: false,
            searchText: '',
            resultList: [],
        };
    }

    renderSearchResultItem(mongoDocument: MongoDocumentType): Node {
        const {slug} = mongoDocument;

        return (
            <Link key={slug} to="#">
                {slug}
            </Link>
        );
    }

    renderSearchResult(): Node {
        const {state} = this;
        const {searchText, isActive, resultList} = state;

        const slug = '/article/fads';

        if (!isActive) {
            return null;
        }

        if (searchText.length < minSearchSymbolCount) {
            return null;
        }

        if (resultList.length === 0) {
            return (
                <div className={searchStyle.search_result_list__no_result}>
                    По запросу &quot;{searchText}&quot; ничего не найдено.
                </div>
            );
        }

        return (
            <div className={searchStyle.search_result_list}>
                <Link to={slug}>{slug}</Link>
                {searchText + String(isActive)}
                <br/>
                <Link to={slug}>{slug}</Link>
                {searchText + String(isActive)}
                <br/>
                <Link to={slug}>{slug}</Link>
                {searchText + String(isActive)}
                <br/>
                <Link to={slug}>{slug}</Link>
                {searchText + String(isActive)}
                <br/>
                <Link to={slug}>{slug}</Link>
                {searchText + String(isActive)}
                <br/>
                <Link to={slug}>{slug}</Link>
                {searchText + String(isActive)}
                <br/>
                <Link to={slug}>{slug}</Link>
                {searchText + String(isActive)}
                <br/>
                <Link to={slug}>{slug}</Link>
                {searchText + String(isActive)}
                <br/>
            </div>
        );
    }

    handleFocus = () => {
        const {props} = this;

        this.setState({isActive: true}, (): mixed => props.onActiveChange(true));
    };

    handleBlur = () => {
        const {props} = this;

        setTimeout(() => {
            this.setState({isActive: false}, (): mixed => props.onActiveChange(false));
        }, 250);
    };

    handleInput = (evt: SyntheticEvent<HTMLInputElement>) => {
        this.setState({searchText: String(evt.currentTarget.value).trim()});
    };

    renderSearchInput(): Node {
        return (
            <input
                className={searchStyle.desktop__search_input}
                key="search-input"
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                onInput={this.handleInput}
                placeholder="Поиск"
                type="text"
            />
        );
    }

    renderDesktop(): Node {
        const {state} = this;
        const {isActive} = state;

        return (
            <div
                className={classNames(searchStyle.desktop__search_wrapper, {
                    [searchStyle.search_wrapper__active]: isActive,
                })}
            >
                {this.renderSearchInput()}
                {this.renderSearchResult()}
            </div>
        );
    }

    renderMobile(): Node {
        const {state} = this;
        const {isActive} = state;

        return (
            <div
                className={classNames(searchStyle.mobile__search_wrapper, {
                    [searchStyle.search_wrapper__active]: isActive,
                })}
            >
                {this.renderSearchInput()}
                {this.renderSearchResult()}
            </div>
        );
    }

    render(): Node {
        const {props, state} = this;
        const {screenContextData} = props;

        return screenContextData.isDesktop ? this.renderDesktop() : this.renderMobile();
    }
}
