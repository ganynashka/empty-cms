// @flow

/* global localStorage, navigator */

import type {LocaleNameType} from './const';
import {allLocalesData, localeConst, localeNameList} from './const';
import type {LangKeyType} from './translation/type';

export type ValueMapType = {
    [key: string]: string | number,
};

export function getLocaleName(): LocaleNameType {
    if (typeof localStorage === 'undefined' || typeof navigator === 'undefined') {
        return localeConst.defaults.localeName;
    }

    const savedLocaleName = localStorage.getItem(localeConst.key.localStorage.localeName);

    let localeName: LocaleNameType = localeConst.defaults.localeName;

    const hasGotFromStorage = localeNameList.some((localeNameInList: LocaleNameType): boolean => {
        if (localeNameInList === savedLocaleName) {
            localeName = localeNameInList;
            return true;
        }

        return false;
    });

    if (hasGotFromStorage) {
        return localeName;
    }

    const navigatorLanguages = navigator.languages;

    if (!Array.isArray(navigatorLanguages)) {
        return localeName;
    }

    navigatorLanguages.some((deviceLocaleName: mixed): boolean => {
        return localeNameList.some((localeNameInList: LocaleNameType): boolean => {
            if (localeNameInList === deviceLocaleName) {
                localeName = localeNameInList;
                return true;
            }
            return false;
        });
    });

    return localeName;
}

function replacePlaceholderMap(rawString: string, valueMap: ValueMapType): string {
    let resultString = rawString;

    Object.keys(valueMap).forEach((valueKey: string) => {
        resultString = resultString.replace(`{${valueKey}}`, String(valueMap[valueKey]));
    });

    return resultString;
}

export function getLocalizedString(
    stringKey: LangKeyType,
    localeName: LocaleNameType,
    valueMap?: ValueMapType
): string {
    const resultString = allLocalesData[localeName][stringKey];

    return valueMap ? replacePlaceholderMap(resultString, valueMap) : resultString;
}
