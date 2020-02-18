// @flow

import React, {Component, type Node} from 'react';

import type {LocationType} from '../../../../type/react-router-dom-v5-type-extract';
import type {InitialDataType} from '../../../../provider/intial-data/intial-data-type';
import {setMeta} from '../../../../lib/meta';
import {scrollToTop} from '../../../../lib/screen';
import {isNotError, isNotFunction} from '../../../../lib/is';
import {CssSpinner} from '../../../../component/layout/css-spinner/c-css-spinner';

import errorConnectionContentStyle from './error-connection-content.scss';

type PropsType = {|
    +location: LocationType,
    +initialContextData: InitialDataType,
|};

type StateType = {|
    +isRefreshing: boolean,
|};

const title = 'Ошибка соединения';

export class ErrorConnectionContent extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            isRefreshing: false,
        };
    }

    componentDidMount() {
        setMeta({title});
        scrollToTop();
    }

    handleRefreshInitialState = async () => {
        const {props} = this;
        const {location} = props;
        const {refreshInitialData} = props.initialContextData;

        if (isNotFunction(refreshInitialData)) {
            return;
        }

        this.setState({isRefreshing: true});

        const refreshResult = await refreshInitialData(location.pathname);

        if (isNotError(refreshResult)) {
            return;
        }

        this.setState({isRefreshing: false});
    };

    renderRefreshButton(): Node {
        const {state} = this;
        const {isRefreshing} = state;

        if (isRefreshing) {
            return <CssSpinner/>;
        }

        return (
            <button
                className={errorConnectionContentStyle.connection__button}
                onClick={this.handleRefreshInitialState}
                type="button"
            >
                Обновить страницу
            </button>
        );
    }

    render(): Node {
        return (
            <>
                <h1 className={errorConnectionContentStyle.connection__header}>{title}</h1>
                <p className={errorConnectionContentStyle.connection__text}>
                    Проверьте наличие интернета и обновите страницу.
                </p>
                <div className={errorConnectionContentStyle.connection__button__wrapper}>
                    {this.renderRefreshButton()}
                </div>
            </>
        );
    }
}
