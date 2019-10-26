// @flow

/* global window, fetch */

import {hasProperty} from './is';

const promiseCache = {};

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

export function fetchX<ExpectedResponseType>(
    url: string,
    options?: OptionsType
): Promise<ExpectedResponseType | Error> {
    const cacheProperty = url + ' - ' + (JSON.stringify(options) || '');

    if (hasProperty(promiseCache, cacheProperty)) {
        console.log(`fetchX - url: ${url}, options: ${JSON.stringify(options || {})} - get from cache`);
        return promiseCache[cacheProperty];
    }

    promiseCache[cacheProperty] = window
        .fetch(url, options)
        .then((rawResult: Response): Promise<ExpectedResponseType> => rawResult.json())
        .catch((error: Error): Error => {
            console.error('can not fetch url:', url);
            console.error(error);
            return error;
        });

    return promiseCache[cacheProperty];
}
