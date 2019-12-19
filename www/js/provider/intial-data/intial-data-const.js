// @flow

import {type InitialDataType} from './intial-data-type';

export const rootPathMetaData = {
    title: 'Сказки детям',
    // description: 'Хорошие сказки хорошим детям',
};

export const defaultInitialData: InitialDataType = {
    title: '',
    meta: '',
    // description: '',
    is404: false,
    articlePathData: null,
    documentNodeTree: null,
    setInitialData: null,
};

export const page404InitialData: InitialDataType = {
    ...defaultInitialData,
    title: '404',
    // description: '404',
    is404: true,
    setInitialData: null,
};
