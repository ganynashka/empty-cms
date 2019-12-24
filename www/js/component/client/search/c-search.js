// @flow

import React, {Component, type Node} from 'react';
import {Link} from 'react-router-dom';
import classNames from 'classnames';

import type {ScreenContextType} from '../../../provider/screen/screen-context-type';

import searchStyle from './search.scss';

type PropsType = {|
    +onActiveChange: (isActive: boolean) => mixed,
    +screenContextData: ScreenContextType,
|};

type StateType = {
    +isActive: boolean,
};

export class Search extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            isActive: false,
        };
    }

    renderSearchResult(): Node {
        return 'res';
    }

    handleFocus = () => {
        const {props} = this;

        this.setState({isActive: true}, (): mixed => props.onActiveChange(true));
    };

    handleBlur = () => {
        const {props} = this;

        this.setState({isActive: false}, (): mixed => props.onActiveChange(false));
    };

    renderDesktop(): Node {
        const {state} = this;
        const {isActive} = state;

        return (
            <div
                className={classNames(searchStyle.desktop__search_wrapper, {
                    [searchStyle.search_wrapper__active]: isActive,
                })}
            >
                <input
                    className={searchStyle.desktop__search_input}
                    key="search-input"
                    onBlur={this.handleBlur}
                    onFocus={this.handleFocus}
                    placeholder="Поиск"
                    type="text"
                />
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
                <input
                    className={searchStyle.desktop__search_input}
                    key="search-input"
                    onBlur={this.handleBlur}
                    onFocus={this.handleFocus}
                    placeholder="Поиск"
                    type="text"
                />
            </div>
        );
    }

    render(): Node {
        const {props, state} = this;
        const {screenContextData} = props;

        return screenContextData.isDesktop ? this.renderDesktop() : this.renderMobile();
    }
}
