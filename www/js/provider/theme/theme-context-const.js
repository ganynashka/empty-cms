// @flow

import type {ThemeNameType} from './theme-context-type';

export const themeNameMap = {
    'default': 'default',
    dark: 'dark',
};

export const themeNameList: Array<ThemeNameType> = Object.keys(themeNameMap);

export const themeConst = {
    defaults: {
        themeName: themeNameMap.default,
    },
    key: {
        localStorage: {
            themeName: 'my-theme-name-v.1.0', // PROJECT_ID + 'my-theme-name-v.1.0'
        },
    },
};
