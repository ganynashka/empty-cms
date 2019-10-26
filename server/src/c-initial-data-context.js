// @flow

import React from 'react';

import type {ApiDataType} from '../../www/js/component/need-end-point/c-need-end-point';

export type RouterStaticContextType = {
    url?: string,
    is404: boolean,
};

export type InitialDataType = {|
    +apiData: ApiDataType | null,
|};

export const defaultInitialData: InitialDataType = {
    apiData: null,
};

const initialDataContext = React.createContext<InitialDataType>(defaultInitialData);

export const InitialDataProvider = initialDataContext.Provider;

export const InitialDataConsumer = initialDataContext.Consumer;
