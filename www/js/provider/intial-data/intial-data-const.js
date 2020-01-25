// @flow

import {deviceTypeNameMap} from '../../../../server/src/util/device/device-const';
import type {OpenGraphDataType} from '../../../../server/src/database/database-type';

import {type InitialDataType} from './intial-data-type';

export const rootPathMetaData = {
    title: 'Сказки детям',
    header: 'Сказки детям',
    // description: 'Хорошие сказки хорошим детям',
};

export const defaultOpenGraphData: OpenGraphDataType = {
    title: rootPathMetaData.header,
    type: 'article', // "article"
    image: 'favicon-512.png',
    description: '',
    locale: 'ru_RU',
};

export const defaultInitialData: InitialDataType = {
    title: '',
    header: '',
    meta: '',
    openGraphData: defaultOpenGraphData,
    // description: '',
    is404: false,
    articlePathData: null,
    documentNodeTree: null,
    setInitialData: null,
    parentNodeList: [],
    device: {type: deviceTypeNameMap.phone},
    siblingDataList: [],
};

export const page404InitialData: InitialDataType = {
    ...defaultInitialData,
    title: '404',
    header: '404',
    // description: '404',
    is404: true,
    setInitialData: null,
};
