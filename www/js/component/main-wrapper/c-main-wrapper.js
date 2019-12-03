// @flow

import React, {type Node} from 'react';
import classNames from 'classnames';

import type {LocaleContextType} from '../../provider/locale/locale-context-type';
import {LocaleContextConsumer} from '../../provider/locale/c-locale-context';
import type {ScreenContextType} from '../../provider/screen/screen-context-type';
import {ScreenContextConsumer} from '../../provider/screen/c-screen-context';
import {screenNameReference} from '../../provider/screen/screen-context-const';
import {localeNameReference} from '../../provider/locale/locale-context-const';
import {ThemeContextConsumer} from '../../provider/theme/c-theme-context';
import type {ThemeContextType} from '../../provider/theme/theme-context-type';
import {themeNameMap} from '../../provider/theme/theme-context-const';

import mainWrapperStyle from './main-wrapper.scss';

const mainWrapperClassName = {
    desktop: 'desktop',
    landscape: 'landscape',
    localeEnUs: 'locale--en-us',
    localeRuRu: 'locale--ru-ru',
    localeZhCh: 'locale--zh-ch',
    localeZhTw: 'locale--zh-tw',
    ltDesktopWidth: 'lt-desktop-width',
    ltTabletWidth: 'lt-tablet-width',
    mobile: 'mobile',
    portrait: 'portrait',
    tablet: 'tablet',
    themeDefault: 'theme-default',
    themeDark: 'theme-dark',
};

type PropsType = {|
    +children: Node,
|};

export function MainWrapper(props: PropsType): Node {
    const {children} = props;

    return (
        <ThemeContextConsumer>
            {(themeContextData: ThemeContextType): Node => {
                return (
                    <LocaleContextConsumer>
                        {(localeContextData: LocaleContextType): Node => {
                            return (
                                <ScreenContextConsumer>
                                    {(screenContextData: ScreenContextType): Node => {
                                        const className = getClassName(
                                            themeContextData,
                                            localeContextData,
                                            screenContextData
                                        );

                                        return <div className={className}>{children}</div>;
                                    }}
                                </ScreenContextConsumer>
                            );
                        }}
                    </LocaleContextConsumer>
                );
            }}
        </ThemeContextConsumer>
    );
}

function getClassName(
    themeContextData: ThemeContextType,
    localeContextData: LocaleContextType,
    screenContextData: ScreenContextType
): string {
    return classNames({
        [mainWrapperStyle.main_wrapper]: true,
        [mainWrapperClassName.themeDefault]: themeContextData.name === themeNameMap.default,
        [mainWrapperClassName.themeDark]: themeContextData.name === themeNameMap.dark,
        [mainWrapperClassName.landscape]: screenContextData.isLandscape,
        [mainWrapperClassName.portrait]: screenContextData.isPortrait,
        [mainWrapperClassName.desktop]: screenContextData.isDesktop,
        [mainWrapperClassName.tablet]: screenContextData.isTablet,
        [mainWrapperClassName.mobile]: screenContextData.isMobile,
        [mainWrapperClassName.ltDesktopWidth]: screenContextData.littleThenList.includes(screenNameReference.desktop),
        [mainWrapperClassName.ltTabletWidth]: screenContextData.littleThenList.includes(screenNameReference.tablet),
        [mainWrapperClassName.localeEnUs]: localeContextData.name === localeNameReference.enUs,
        [mainWrapperClassName.localeRuRu]: localeContextData.name === localeNameReference.ruRu,
        [mainWrapperClassName.localeZhCh]: localeContextData.name === localeNameReference.zhCn,
        [mainWrapperClassName.localeZhTw]: localeContextData.name === localeNameReference.zhTw,
    });
}
