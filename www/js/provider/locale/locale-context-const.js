// @flow

import {enUs} from './translation/en-us/data';
import {ruRu} from './translation/ru-ru/data';
import {zhCn} from './translation/zh-cn/data';
import {zhTw} from './translation/zh-tw/data';
import type {LocaleNameType} from './locale-context-type';

export const localeNameReference = {
    enUs: 'en-US',
    ruRu: 'ru-RU',
    zhCn: 'zh-CN',
    zhTw: 'zh-TW',
};

export const allLocalesData = {
    'en-US': enUs,
    'ru-RU': ruRu,
    'zh-CN': zhCn,
    'zh-TW': zhTw,
};

export const localeNameList: Array<LocaleNameType> = Object.keys(allLocalesData);

export const localeConst = {
    defaults: {
        localeName: localeNameReference.enUs,
    },
    key: {
        localStorage: {
            localeName: 'my-locale-name-v.1.0', // PROJECT_ID + 'my-locale-name-v.1.0'
        },
    },
};
