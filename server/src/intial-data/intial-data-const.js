// @flow

import {type InitialDataType} from './intial-data-type';

export const rootPathMetaData = {
    title: 'Сказки детям',
    description: 'Хорошие сказки хорошим детям',
};

export const defaultInitialData: InitialDataType = {
    title: '',
    description: '',
    is404: false,
    rootPathData: null,
    articlePathData: null,
};

export const page404InitialData: InitialDataType = {
    ...defaultInitialData,
    title: '404',
    description: '404',
};
