// @flow

import React, {type Node} from 'react';
import classNames from 'classnames';

import type {LocaleContextType} from '../locale/c-locale-context';
import {LocaleContextConsumer} from '../locale/c-locale-context';
import type {ScreenContextType} from '../screen/screen-helper';
import {screenNameReference} from '../screen/screen-helper';
import {ScreenContextConsumer} from '../screen/c-screen-context';
import {localeNameReference} from '../locale/const';

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
};

type PropsType = {|
    +children: Node,
|};

export function MainWrapper(props: PropsType): Node {
    const {children} = props;

    return (
        <LocaleContextConsumer>
            {(localeContextData: LocaleContextType): Node => {
                return (
                    <ScreenContextConsumer>
                        {(screenContextData: ScreenContextType): Node => {
                            return <div className={getClassName(localeContextData, screenContextData)}>{children}</div>;
                        }}
                    </ScreenContextConsumer>
                );
            }}
        </LocaleContextConsumer>
    );
}

function getClassName(localeContextData: LocaleContextType, screenContextData: ScreenContextType): string {
    return classNames({
        [mainWrapperStyle.main_wrapper]: true,
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
