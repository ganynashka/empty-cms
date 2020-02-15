// @flow

/* global window, requestAnimationFrame, sessionStorage */

import React, {Component, type Node} from 'react';

import type {LocationType} from '../../../type/react-router-dom-v5-type-extract';
import type {InitialDataType} from '../../intial-data/intial-data-type';
import type {PromiseResolveType} from '../../../lib/promise';
import {debounce} from '../../../lib/decorator';

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

        window.addEventListener('scroll', debounce<() => void>(this.saveScrollTopPosition, 150), {
            capture: false,
            passive: true,
        });

        console.log('---> ScrollRestoration did MOUNT');
    }

    componentDidUpdate(prevProps: PropsType) {
        const {props} = this;
        const {location} = props;
        const {pathname} = location;

        if (prevProps.initialContextData.header !== props.initialContextData.header) {
            this.restoreScrollTopPosition(pathname);
        }
    }

    saveScrollTopPosition = () => {
        const {props} = this;
        const {location} = props;
        const {pathname} = location;
        const {scrollTop} = window.document.documentElement;

        sessionStorage.setItem(storageKeyPrefix + pathname, String(scrollTop));
    };

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
