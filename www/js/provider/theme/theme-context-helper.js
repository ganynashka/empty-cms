// @flow

/* global localStorage */

import type {ThemeContextType, ThemeNameType} from './theme-context-type';
import {themeConst, themeNameList} from './theme-context-const';

function getSavedThemeName(): ThemeNameType {
    if (typeof localStorage === 'undefined') {
        return themeConst.defaults.themeName;
    }

    const savedThemeName = localStorage.getItem(themeConst.key.localStorage.themeName);

    let themeName: ThemeNameType = themeConst.defaults.themeName;

    const hasGotFromStorage = themeNameList.some((themeNameInList: ThemeNameType): boolean => {
        if (themeNameInList === savedThemeName) {
            themeName = themeNameInList;
            return true;
        }

        return false;
    });

    if (hasGotFromStorage) {
        return themeName;
    }

    return themeConst.defaults.themeName;
}

export function getDefaultThemeContextData(): ThemeContextType {
    return {
        name: getSavedThemeName(),
        setName(themeName: ThemeNameType): null {
            return null;
        },
    };
}

export function setThemeName(themeName: ThemeNameType): ThemeNameType {
    console.log('---> write to localStorage:', themeConst.key.localStorage.themeName, themeName);
    localStorage.setItem(themeConst.key.localStorage.themeName, themeName);

    return themeName;
}
