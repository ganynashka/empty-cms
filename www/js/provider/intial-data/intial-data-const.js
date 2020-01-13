// @flow

import {deviceTypeNameMap} from '../../../../server/src/util/device/device-const';

import {type InitialDataType} from './intial-data-type';

export const rootPathMetaData = {
    header: 'Сказки детям',
    // description: 'Хорошие сказки хорошим детям',
};

export const defaultInitialData: InitialDataType = {
    header: '',
    meta: '',
    // description: '',
    is404: false,
    articlePathData: null,
    documentNodeTree: null,
    setInitialData: null,
    device: {type: deviceTypeNameMap.phone},
};

export const page404InitialData: InitialDataType = {
    ...defaultInitialData,
    header: '404',
    // description: '404',
    is404: true,
    setInitialData: null,
};
