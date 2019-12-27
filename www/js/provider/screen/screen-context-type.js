// @flow

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
    +devicePixelRatio: number,
    +isLoaded: boolean,
|};
