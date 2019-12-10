// @flow

/* global window, fetch */

import {documentApiRouteMap} from '../../../server/src/api/api-route-map';

import {promiseCatch} from './promise';
import {isNumber, isString} from './is';

type OptionsType = {|
    +method?: 'GET' | 'POST', // GET, POST, PUT, DELETE, etc. (default: GET)
    +mode?: 'cors' | 'no-cors', // no-cors, cors, same-origin (default: same-origin)
    +cache?: 'default', // default, no-cache, reload, force-cache, only-if-cached (default: default)
    +credentials?: 'include', // include, same-origin, omit (default: same-origin)
    +headers?: {|
        +'Access-Control-Allow-Headers'?: '*',
        +Accept?: 'application/json, text/javascript, */*; q=0.01',
        +'Content-Type'?: 'application/x-www-form-urlencoded; charset=UTF-8',
    |},
    redirect?: 'follow', // manual, follow, error (default: follow)
    referrer?: 'no-referrer', // no-referrer, client (default: client)
    +body?: FormData | string, // body data type must match "Content-Type" header
|};

const promiseCache = {};

export function fetchX<ExpectedResponseType>(
    url: string,
    options?: OptionsType
): Promise<ExpectedResponseType | Error> {
    const cacheProperty = url + ' - ' + (JSON.stringify(options) || '');

    const savedPromise = promiseCache[cacheProperty];

    if (savedPromise) {
        console.log(`fetchX - url: ${url}, options: ${JSON.stringify(options || {})} - get from cache`);
        return savedPromise;
    }

    promiseCache[cacheProperty] = window
        .fetch(url, options)
        .then((rawResult: Response): Promise<ExpectedResponseType> => rawResult.json())
        .catch((error: Error): Error => {
            promiseCache[cacheProperty] = null;
            return promiseCatch(error);
        });

    return promiseCache[cacheProperty];
}

export function fetchNumber(url: string): Promise<number | Error> {
    return fetch(url)
        .then((response: Response): Promise<string | Error> => response.text())
        .then((responseText: string | Error): number | Error => {
            if (!isString(responseText)) {
                console.error(responseText);
                return new Error('Bad response');
            }

            const size = parseInt(responseText, 10);

            if (isNumber(size)) {
                return size;
            }

            return new Error('Response is not a number');
        })
        .catch(promiseCatch);
}
