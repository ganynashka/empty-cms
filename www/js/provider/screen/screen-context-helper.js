// @flow

/* global window, document */

import {isNotNumber, isNumber} from '../../lib/is';

import type {ScreenWidthNameType, ScreenContextType} from './screen-context-type';
import {screenMinWidth, screenNameReference} from './screen-context-const';

function getScreenName(screenWidth: number): ScreenWidthNameType {
    let screenName = 'mobile';

    Object.keys(screenMinWidth).every((screenNameInList: ScreenWidthNameType): boolean => {
        if (screenWidth >= screenMinWidth[screenNameInList]) {
            screenName = screenNameInList;
            return false;
        }

        return true;
    });

    return screenName;
}

function getLittleThenList(screenWidth: number): Array<ScreenWidthNameType> {
    const littleThenList = [];

    Object.keys(screenMinWidth).forEach((screenName: ScreenWidthNameType) => {
        if (screenWidth < screenMinWidth[screenName]) {
            littleThenList.push(screenName);
        }
    });

    return littleThenList;
}

function getScreenSize(): {|+width: number, +height: number|} {
    const defaultSize = {
        width: screenMinWidth.desktop,
        height: screenMinWidth.desktop,
    };

    if (typeof document === 'undefined') {
        return defaultSize;
    }

    const {documentElement} = document;

    if (!documentElement) {
        return defaultSize;
    }

    const {clientWidth: width, clientHeight: height} = documentElement;

    return {width, height};
}

export function getDevicePixelRatio(): number {
    const defaultDevicePixelRatio = 2;

    if (typeof window === 'undefined') {
        return defaultDevicePixelRatio;
    }

    const {devicePixelRatio} = window;

    if (isNotNumber(devicePixelRatio)) {
        return defaultDevicePixelRatio;
    }

    if (devicePixelRatio <= defaultDevicePixelRatio) {
        return defaultDevicePixelRatio;
    }

    return devicePixelRatio;
}

export function getScreenState(): ScreenContextType {
    const {width, height} = getScreenSize();

    const isLandscape = width > height; // use >, do not use >=, if width === height it is portrait
    const screenName = getScreenName(width);

    return {
        width,
        height,
        name: screenName,
        littleThenList: getLittleThenList(width),
        isDesktop: screenName === screenNameReference.desktop,
        isTablet: screenName === screenNameReference.tablet,
        isMobile: screenName === screenNameReference.mobile,
        isLandscape,
        isPortrait: !isLandscape,
        devicePixelRatio: getDevicePixelRatio(),
    };
}
