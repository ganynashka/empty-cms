// @flow

import React from 'react';
import {type $Request, type $Response} from 'express';

/*
export type RouterStaticContextType = {
    url?: string,
    is404: boolean,
};
*/

export type InitialDataType = {|
    +title: string,
    +description: string,
|};

export const defaultInitialData: InitialDataType = {
    title: 'the title',
    description: 'the description',
};

export const page404InitialData: InitialDataType = {
    title: '404',
    description: '',
};

export function getInitialData(request: $Request, response: $Response): Promise<InitialDataType> {
    if (String(response.statusCode) === '404') {
        return Promise.resolve({...page404InitialData});
    }

    return Promise.resolve({...defaultInitialData});
}

const initialDataContext = React.createContext<InitialDataType>(defaultInitialData);

export const InitialDataProvider = initialDataContext.Provider;

export const InitialDataConsumer = initialDataContext.Consumer;
