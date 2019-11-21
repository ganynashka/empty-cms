// @flow

/* global localStorage, navigator */

import {allLocalesData, localeConst, localeNameList} from './locale-context-const';
import type {LangKeyType} from './translation/type';
import type {LocaleNameType, LocaleContextValueMapType, LocaleContextType} from './locale-context-type';

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

export function setLocaleName(localeName: LocaleNameType): LocaleNameType {
    console.log('---> write to localStorage:', localeConst.key.localStorage.localeName, localeName);
    localStorage.setItem(localeConst.key.localStorage.localeName, localeName);

    return localeName;
}

function replacePlaceholderMap(rawString: string, valueMap: LocaleContextValueMapType): string {
    let resultString = rawString;

    Object.keys(valueMap).forEach((valueKey: string) => {
        resultString = resultString.replace(`{${valueKey}}`, String(valueMap[valueKey]));
    });

    return resultString;
}

export function getLocalizedString(
    stringKey: LangKeyType,
    localeName: LocaleNameType,
    valueMap?: LocaleContextValueMapType
): string {
    const resultString = allLocalesData[localeName][stringKey];

    return valueMap ? replacePlaceholderMap(resultString, valueMap) : resultString;
}

export function getDefaultLocaleContextData(): LocaleContextType {
    return {
        name: getLocaleName(),
        setName: (localeName: LocaleNameType): null => null,
        getLocalizedString: (stringKey: LangKeyType, valueMap?: LocaleContextValueMapType): string => stringKey,
    };
}
