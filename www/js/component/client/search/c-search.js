// @flow

/* global setTimeout */

import React, {Component, type Node} from 'react';
import {Link} from 'react-router-dom';
import classNames from 'classnames';

import type {ScreenContextType} from '../../../provider/screen/screen-context-type';
import type {MongoDocumentShortDataType} from '../../../../../server/src/database/database-type';
import {cleanText, getLinkToReadArticle} from '../../../lib/string';
import {isError} from '../../../lib/is';
import type {InitialDataType} from '../../../provider/intial-data/intial-data-type';
import {isMobileDevice} from '../../../../../server/src/util/device/device-helper';
import type {LocationType} from '../../../type/react-router-dom-v5-type-extract';
import serviceStyle from '../../../../css/service.scss';
import {CssSpinner} from '../../layout/css-spinner/c-css-spinner';

import searchStyle from './search.scss';
import {searchDocumentShortData} from './search-api';
import {filterResultCallBack, sortSearchResultList} from './search-helper';

type PropsType = {|
    +onActiveChange: (isActive: boolean) => mixed,
    +screenContextData: ScreenContextType,
    +initialContextData: InitialDataType,
    +location: LocationType,
|};

type StateType = {|
    +isActive: boolean,
    +searchText: string,
    +resultList: Array<MongoDocumentShortDataType> | null,
    +inputRef: {current: null | HTMLInputElement},
    +isSearchInProgress: boolean,
|};

const minSearchSymbolCount = 3;

export class Search extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            isActive: false,
            searchText: '',
            resultList: null,
            inputRef: React.createRef<HTMLInputElement>(),
            isSearchInProgress: false,
        };
    }

    componentDidUpdate(prevProps: PropsType, prevState: StateType) {
        const {props} = this;
        const inputNode = this.getInputNode();

        if (props.location.pathname !== prevProps.location.pathname && inputNode) {
            inputNode.blur();
        }
    }

    /*
    makeHandleListItemClick(text: string): () => mixed {
        return () => {
            this.setSearchInputValue(text);
        };
    }
*/

    getInputValue(): string {
        const inputNode = this.getInputNode();

        if (!inputNode) {
            return '';
        }

        return inputNode.value;
    }

    /*
    setSearchInputValue(text: string) {
        const searchText = cleanText(text);

        this.setState({searchText}, () => {
            const inputNode = this.getInputNode();

            if (!inputNode) {
                return;
            }

            inputNode.value = searchText;
            this.handleInput();
        });
    }
*/

    getStyledHeader(header: string): Node {
        const {state} = this;
        const {searchText} = state;
        const cleanSearchText = cleanText(searchText).toLocaleLowerCase();
        const beginIndex = header.toLowerCase().indexOf(cleanSearchText);
        const endIndex = beginIndex + cleanSearchText.length;

        if (beginIndex < 0) {
            return header;
        }

        const startPart = header.slice(0, beginIndex);
        const middlePart = header.slice(beginIndex, endIndex);
        const endPart = header.slice(endIndex);

        return (
            <>
                {startPart}
                <span className={serviceStyle.bold}>{middlePart}</span>
                {endPart}
            </>
        );
    }

    renderSearchResultItem = (mongoDocument: MongoDocumentShortDataType): Node => {
        const {slug, header} = mongoDocument;
        // const handleListItemClick = this.makeHandleListItemClick(header);
        const styledHeader = this.getStyledHeader(header);

        return (
            <li className={searchStyle.search_result_list_item} key={slug}>
                <Link
                    className={searchStyle.search_result_item}
                    // onClick={handleListItemClick}
                    to={getLinkToReadArticle(slug)}
                >
                    {styledHeader}
                </Link>
            </li>
        );
    };

    getResultList(): Array<MongoDocumentShortDataType> | null {
        const {state} = this;
        const {resultList, searchText} = state;

        if (!resultList) {
            return null;
        }

        const cleanSearchText = cleanText(searchText).toLocaleLowerCase();
        const filteredResult = resultList.filter(filterResultCallBack);

        return sortSearchResultList(filteredResult, cleanSearchText);
    }

    renderSearchResult(): Node {
        const {state} = this;
        const {searchText, isActive, isSearchInProgress} = state;

        const resultList = this.getResultList();

        if (!isActive) {
            return null;
        }

        if (isSearchInProgress) {
            return (
                <div className={searchStyle.search_result_list__in_progress}>
                    <CssSpinner/>
                </div>
            );
        }

        if (!resultList) {
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

        this.setState({isActive: true}, (): mixed => {
            props.onActiveChange(true);

            this.moveInputCursorToEnd();

            setTimeout(() => {
                this.moveInputCursorToEnd();
            }, 200);
            setTimeout(() => {
                this.moveInputCursorToEnd();
            }, 300);
        });
    };

    moveInputCursorToEnd() {
        const inputNode = this.getInputNode();

        if (!inputNode) {
            return;
        }

        const {length} = inputNode.value;

        inputNode.selectionStart = length;
        inputNode.selectionEnd = length;
    }

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
            this.setState({
                isSearchInProgress: false,
                resultList: null,
            });
            return;
        }

        this.setState({isSearchInProgress: true});

        const resultList = await searchDocumentShortData({
            header: searchText,
            tagList: searchText,
        });

        const {state} = this;

        if (searchText !== state.searchText) {
            console.log(searchText, state.searchText);
            return;
        }

        this.setState({isSearchInProgress: false});

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

    getInputNode(): HTMLInputElement | null {
        const {state} = this;
        const {inputRef} = state;

        return inputRef.current;
    }

    handleStopSearch = () => {
        const {props} = this;
        const inputNode = this.getInputNode();

        if (!inputNode) {
            return;
        }

        inputNode.value = '';

        this.setState({
            isActive: false,
            searchText: '',
            resultList: null,
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
        const {isScriptLoaded} = screenContextData;

        return isScriptLoaded ? this.renderClientSide() : this.renderServerSide();
    }
}
