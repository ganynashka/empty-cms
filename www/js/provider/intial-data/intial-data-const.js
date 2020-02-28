// @flow

import {deviceTypeNameMap} from '../../../../server/src/util/device/device-const';
import type {OpenGraphDataType} from '../../../../server/src/database/database-type';
import {protocolHostingDomainName} from '../../../../server/src/config';

import {type InitialDataType} from './intial-data-type';

export const faviconPngFileName = 'favicon.png';

export const rootPathMetaData = {
    title: 'Сказки детям',
    header: 'Сказки детям',
    // description: 'Хорошие сказки хорошим детям',
};

export const defaultOpenGraphData: OpenGraphDataType = {
    title: rootPathMetaData.header,
    type: 'article', // "article"
    image: faviconPngFileName,
    description: '',
    locale: 'ru_RU',
    url: protocolHostingDomainName,
};

export const defaultInitialData: InitialDataType = {
    title: '',
    header: '',
    meta: '',
    metaDescription: '',
    openGraphData: defaultOpenGraphData,
    headerData: {
        documentShortDataList: [],
    },
    // description: '',
    is404: false,
    rootPathData: null,
    articlePathData: null,
    // documentNodeTree: null,
    // setInitialData: null,
    refreshInitialData: null,
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
    // setInitialData: null,
};
