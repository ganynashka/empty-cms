// @flow

import type {LangDataType} from './translation/type';
import {enUs} from './translation/en-us/data';
import {ruRu} from './translation/ru-ru/data';
import {zhCn} from './translation/zh-cn/data';
import {zhTw} from './translation/zh-tw/data';

export type LocaleNameType = 'en-US' | 'ru-RU' | 'zh-CN' | 'zh-TW';

export const localeNameReference: {+[key: string]: LocaleNameType} = {
    enUs: 'en-US',
    ruRu: 'ru-RU',
    zhCn: 'zh-CN',
    zhTw: 'zh-TW',
};

export const allLocalesData: {+[key: LocaleNameType]: LangDataType} = {
    [localeNameReference.enUs]: enUs,
    [localeNameReference.ruRu]: ruRu,
    [localeNameReference.zhCn]: zhCn,
    [localeNameReference.zhTw]: zhTw,
};

export const localeNameList: Array<LocaleNameType> = Object.keys(allLocalesData);

export const localeConst = {
    defaults: {
        localeName: localeNameReference.enUs,
    },
    key: {
        localStorage: {
            // eslint-disable-next-line id-match
            localeName: 'my-locale-name-v.1.0', // PROJECT_ID + 'my-locale-name-v.1.0'
        },
    },
};
