// @flow

import classNames from 'classnames';

import type {ThemeContextType} from '../../provider/theme/theme-context-type';
import type {LocaleContextType} from '../../provider/locale/locale-context-type';
import type {ScreenContextType} from '../../provider/screen/screen-context-type';
import type {InitialDataType} from '../../provider/intial-data/intial-data-type';

import {themeNameMap} from '../../provider/theme/theme-context-const';
import {localeNameReference} from '../../provider/locale/locale-context-const';
import {screenNameReference} from '../../provider/screen/screen-context-const';
import {isSupportedDevice} from '../../../../server/src/util/device/device-helper';
import {deviceTypeNameMap} from '../../../../server/src/util/device/device-const';

import mainWrapperStyle from './main-wrapper.scss';
import {mainWrapperClassName} from './main-wrapper-const';

// eslint-disable-next-line complexity
export function getMainWrapperClassName(
    themeContextData: ThemeContextType,
    localeContextData: LocaleContextType,
    screenContextData: ScreenContextType,
    initialContextData: InitialDataType
): string {
    const {isLoaded} = screenContextData;

    const mainClassMap = {
        [mainWrapperStyle.main_wrapper]: true,
        [mainWrapperClassName.themeDefault]: themeContextData.name === themeNameMap.default,
        [mainWrapperClassName.themeDark]: themeContextData.name === themeNameMap.dark,
        [mainWrapperClassName.landscape]: screenContextData.isLandscape,
        [mainWrapperClassName.portrait]: screenContextData.isPortrait,
        [mainWrapperClassName.loaded]: isLoaded,
        [mainWrapperClassName.localeEnUs]: localeContextData.name === localeNameReference.enUs,
        [mainWrapperClassName.localeRuRu]: localeContextData.name === localeNameReference.ruRu,
        [mainWrapperClassName.localeZhCh]: localeContextData.name === localeNameReference.zhCn,
        [mainWrapperClassName.localeZhTw]: localeContextData.name === localeNameReference.zhTw,
    };

    const deviceBrowserClassMap = {
        [mainWrapperClassName.mobile]: screenContextData.isMobile,
        [mainWrapperClassName.tablet]: screenContextData.isTablet,
        [mainWrapperClassName.desktop]: screenContextData.isDesktop,
        [mainWrapperClassName.ltTabletWidth]: screenContextData.littleThenList.includes(screenNameReference.tablet),
        [mainWrapperClassName.ltDesktopWidth]: screenContextData.littleThenList.includes(screenNameReference.desktop),
    };

    if (isLoaded) {
        return classNames({...mainClassMap, ...deviceBrowserClassMap});
    }

    const {device} = initialContextData;

    if (!device) {
        return classNames({...mainClassMap, ...deviceBrowserClassMap});
    }

    const {type} = device;

    if (!isSupportedDevice(device) || type === deviceTypeNameMap.phone) {
        return classNames({
            ...mainClassMap,
            [mainWrapperClassName.mobile]: true,
            [mainWrapperClassName.tablet]: false,
            [mainWrapperClassName.desktop]: false,
            [mainWrapperClassName.ltTabletWidth]: true,
            [mainWrapperClassName.ltDesktopWidth]: true,
        });
    }

    if (type === deviceTypeNameMap.tablet) {
        return classNames({
            ...mainClassMap,
            [mainWrapperClassName.mobile]: false,
            [mainWrapperClassName.tablet]: true,
            [mainWrapperClassName.desktop]: false,
            [mainWrapperClassName.ltTabletWidth]: false,
            [mainWrapperClassName.ltDesktopWidth]: true,
        });
    }

    return classNames({
        ...mainClassMap,
        [mainWrapperClassName.mobile]: false,
        [mainWrapperClassName.tablet]: false,
        [mainWrapperClassName.desktop]: false,
        [mainWrapperClassName.ltTabletWidth]: false,
        [mainWrapperClassName.ltDesktopWidth]: false,
    });
}
