// @flow

import React from 'react';

export type RouterStaticContextType = {
    url?: string,
    is404: boolean,
};

export type InitialDataType = {|
    +title: string,
    +description: string,
|};

export const defaultInitialData: InitialDataType = {
    title: 'the title',
    description: 'the description',
};

const initialDataContext = React.createContext<InitialDataType>(defaultInitialData);

export const InitialDataProvider = initialDataContext.Provider;

export const InitialDataConsumer = initialDataContext.Consumer;
