// @flow

import React from 'react';

export type RouterStaticContextType = {
    url?: string,
    is404: boolean,
};

export type InitialDataType = {|
    +apiData: null,
|};

export const defaultInitialData: InitialDataType = {
    apiData: null,
};

const initialDataContext = React.createContext<InitialDataType>(defaultInitialData);

export const InitialDataProvider = initialDataContext.Provider;

export const InitialDataConsumer = initialDataContext.Consumer;
