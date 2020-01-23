// @flow

/* global window, requestAnimationFrame, sessionStorage */

import React, {Component, type Node} from 'react';

import type {LocationType} from '../../../type/react-router-dom-v5-type-extract';
import type {InitialDataType} from '../../intial-data/intial-data-type';
import type {PromiseResolveType} from '../../../lib/promise';

type PropsType = {
    +location: LocationType,
    +initialContextData: InitialDataType,
};

type StateType = null;

const storageKeyPrefix = 'scroll-restoration-path:';

export class ScrollRestoration extends Component<PropsType, StateType> {
    componentDidMount() {
        const {props} = this;
        const {location} = props;
        const {pathname} = location;

        this.restoreScrollTopPosition(pathname);

        console.log('---> ScrollRestoration did MOUNT');
    }

    shouldComponentUpdate(nextProps: PropsType): true {
        const {props} = this;
        const {location} = props;
        const {pathname} = location;
        const {scrollTop} = window.document.documentElement;

        if (nextProps.location.pathname !== location.pathname) {
            this.saveScrollTopPosition(pathname, scrollTop);
        }

        return true;
    }

    componentDidUpdate(prevProps: PropsType) {
        const {props} = this;
        const {location} = props;
        const {pathname} = location;

        if (prevProps.initialContextData.header !== props.initialContextData.header) {
            this.restoreScrollTopPosition(pathname);
        }
    }

    saveScrollTopPosition(pathname: string, scrollTop: number) {
        sessionStorage.setItem(storageKeyPrefix + pathname, String(scrollTop));
    }

    restoreScrollTopPosition(pathname: string): Promise<void> {
        const scrollTop = parseInt(sessionStorage.getItem(storageKeyPrefix + pathname), 10) || 0;
        const {documentElement} = window.document;

        return new Promise((resolve: PromiseResolveType<void>) => {
            requestAnimationFrame(() => {
                documentElement.scrollTop = scrollTop;

                requestAnimationFrame(() => {
                    documentElement.scrollTop = scrollTop;
                    resolve();
                });
            });
        });
    }

    render(): Node {
        return null;
    }
}
