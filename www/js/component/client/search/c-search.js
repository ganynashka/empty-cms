// @flow

/* global setTimeout */

import React, {Component, type Node} from 'react';
import {Link} from 'react-router-dom';
import classNames from 'classnames';

import type {ScreenContextType} from '../../../provider/screen/screen-context-type';
import type {MongoDocumentType} from '../../../../../server/src/database/database-type';
import {cleanText, getLinkToReadArticle} from '../../../lib/string';
import {isError} from '../../../lib/is';
import type {InitialDataType} from '../../../provider/intial-data/intial-data-type';
import {isMobileDevice} from '../../../../../server/src/util/device/device-helper';
import type {LocationType} from '../../../type/react-router-dom-v5-type-extract';

import searchStyle from './search.scss';
import {searchDocument} from './search-api';

type PropsType = {|
    +onActiveChange: (isActive: boolean) => mixed,
    +screenContextData: ScreenContextType,
    +initialContextData: InitialDataType,
    +location: LocationType,
|};

type StateType = {|
    +isActive: boolean,
    +searchText: string,
    +resultList: Array<MongoDocumentType>,
    +inputRef: {current: null | HTMLInputElement},
|};

const minSearchSymbolCount = 3;

export class Search extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            isActive: false,
            searchText: '',
            resultList: [],
            inputRef: React.createRef<HTMLInputElement>(),
        };
    }

    componentDidUpdate(prevProps: PropsType, prevState: StateType) {
        const {props, state} = this;
        const input = state.inputRef.current;

        if (props.location.pathname !== prevProps.location.pathname && input) {
            input.blur();
        }
    }

    makeHandleListItemClick(text: string): () => mixed {
        return () => {
            this.setSearchInputValue(text);
        };
    }

    getInputValue(): string {
        const {state} = this;
        const {inputRef} = state;
        const inputNode = inputRef.current;

        if (!inputNode) {
            return '';
        }

        return inputNode.value;
    }

    setSearchInputValue(text: string) {
        const {state} = this;
        const {inputRef} = state;
        const inputNode = inputRef.current;
        const searchText = cleanText(text);

        this.setState({searchText}, () => {
            if (!inputNode) {
                return;
            }

            inputNode.value = searchText;
            this.handleInput();
        });
    }

    renderSearchResultItem = (mongoDocument: MongoDocumentType): Node => {
        const {slug, header} = mongoDocument;

        const handleListItemClick = this.makeHandleListItemClick(header);

        return (
            <li key={slug}>
                <Link
                    className={searchStyle.search_result_item}
                    onClick={handleListItemClick}
                    to={getLinkToReadArticle(slug)}
                >
                    {header}
                </Link>
            </li>
        );
    };

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

    handleInput = async () => {
        const searchText = cleanText(this.getInputValue());

        this.setState({searchText});

        if (searchText.length < minSearchSymbolCount) {
            this.setState({resultList: []});
            return;
        }

        const resultList = await searchDocument({
            header: searchText,
            tagList: searchText,
            content: searchText,
        });

        if (isError(resultList)) {
            this.setState({resultList: []});
            return;
        }

        this.setState({resultList});
    };

    renderSearchInput(): Node {
        const {state} = this;

        return (
            <input
                aria-label="Поиск"
                className={searchStyle.desktop__search_input}
                key="search-input"
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                onInput={this.handleInput}
                placeholder="Поиск"
                ref={state.inputRef}
                type="text"
            />
        );
    }

    handleStopSearch = () => {
        const {state, props} = this;
        const {inputRef} = state;
        const inputNode = inputRef.current;

        if (!inputNode) {
            return;
        }

        inputNode.value = '';

        this.setState({
            isActive: false,
            searchText: '',
            resultList: [],
        });

        props.onActiveChange(false);
    };

    renderStopSearchButton(): Node {
        const {state} = this;
        const {isActive} = state;

        if (isActive) {
            return (
                <button
                    className={searchStyle.desktop__search_input__stop_search}
                    onClick={this.handleStopSearch}
                    type="button"
                />
            );
        }

        return null;
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
                {this.renderStopSearchButton()}
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
                {this.renderStopSearchButton()}
            </div>
        );
    }

    renderClientSide(): Node {
        const {props} = this;
        const {screenContextData} = props;
        const {isDesktop} = screenContextData;

        return isDesktop ? this.renderDesktop() : this.renderMobile();
    }

    renderServerSide(): Node {
        const {props} = this;
        const {initialContextData} = props;
        const {device} = initialContextData;

        if (!device) {
            return this.renderClientSide();
        }

        return isMobileDevice(device) ? this.renderMobile() : this.renderDesktop();
    }

    render(): Node {
        const {props} = this;
        const {screenContextData} = props;
        const {isLoaded} = screenContextData;

        return isLoaded ? this.renderClientSide() : this.renderServerSide();
    }
}
