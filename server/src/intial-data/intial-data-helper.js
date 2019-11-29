// @flow

import {type $Request, type $Response} from 'express';

import type {InitialDataType} from './intial-data-type';
import {defaultInitialData, page404InitialData} from './intial-data-const';

export function getInitialData(request: $Request, response: $Response): Promise<InitialDataType> {
    if (String(response.statusCode) === '404') {
        return Promise.resolve({...page404InitialData});
    }

    const {path} = request;

    return Promise.resolve({...defaultInitialData});
}
