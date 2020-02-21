// @flow

/* global window, setTimeout */

import {waitForTime} from '../../../server/src/util/time';

import {isFunction} from './is';
import type {PromiseResolveType} from './promise';

export function waitIdle(timeout?: number): Promise<void> {
    return waitForTime(timeout || 0).then((): Promise<void> => {
        return new Promise<void>((resolve: PromiseResolveType<void>) => {
            if (typeof window === 'undefined') {
                setTimeout(resolve, 0);
                return;
            }

            const {requestIdleCallback} = window;

            if (!isFunction(requestIdleCallback)) {
                setTimeout(resolve, 0);
                return;
            }

            console.log('browser idle!');

            requestIdleCallback(resolve);
        });
    });
}
