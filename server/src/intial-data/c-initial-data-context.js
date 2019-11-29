// @flow

import React from 'react';

import type {InitialDataType} from './intial-data-type';
import {defaultInitialData} from './intial-data-const';

const initialDataContext = React.createContext<InitialDataType>(defaultInitialData);

export const InitialDataProvider = initialDataContext.Provider;

export const InitialDataConsumer = initialDataContext.Consumer;
