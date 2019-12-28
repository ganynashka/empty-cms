// @flow

/* global setTimeout */

import React, {Component, type Node} from 'react';
import {Link} from 'react-router-dom';
import classNames from 'classnames';

import type {ScreenContextType} from '../../../provider/screen/screen-context-type';
import type {MongoDocumentType} from '../../../../../server/src/database/database-type';
import {cleanText, getLinkToArticle} from '../../../lib/string';
import {isError} from '../../../lib/is';

import searchStyle from './search.scss';
import {searchDocument} from './search-api';

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
        const {slug, title} = mongoDocument;

        return (
            <li key={slug}>
                <Link className={searchStyle.search_result_item} to={getLinkToArticle(slug)}>
                    {title}
                </Link>
            </li>
        );
    }

    renderSearchResult(): Node {
        const {state} = this;
        const {searchText, isActive, resultList} = state;

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

        return <ul className={searchStyle.search_result_list}>{resultList.map(this.renderSearchResultItem)}</ul>;
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

    handleInput = async (evt: SyntheticEvent<HTMLInputElement>) => {
        const searchText = cleanText(String(evt.currentTarget.value));

        const resultList = await searchDocument({
            title: searchText,
            tagList: searchText,
            content: searchText,
        });

        if (isError(resultList)) {
            this.setState({searchText, resultList: []});
            return;
        }

        this.setState({searchText, resultList});
    };

    renderSearchInput(): Node {
        return (
            <input
                aria-label="Поиск"
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
