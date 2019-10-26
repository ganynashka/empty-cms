// @flow

/* global document */

export type ScreenWidthNameType = 'desktop' | 'tablet' | 'mobile';

export type ScreenContextType = {|
    +width: number,
    +height: number,
    +name: ScreenWidthNameType,
    +isDesktop: boolean,
    +isTablet: boolean,
    +isMobile: boolean,
    +littleThenList: Array<ScreenWidthNameType>,
    +isLandscape: boolean,
    +isPortrait: boolean,
|};

const screenMinWidth: {[key: ScreenWidthNameType]: number} = {
    desktop: 1280,
    tablet: 768,
    mobile: 320,
};

export const screenNameReference: {[key: ScreenWidthNameType]: ScreenWidthNameType} = {
    desktop: 'desktop',
    tablet: 'tablet',
    mobile: 'mobile',
};

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
        width: 800,
        height: 600,
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
    };
}
