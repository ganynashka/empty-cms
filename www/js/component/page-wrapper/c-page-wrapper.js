// @flow

import React, {type Node} from 'react';

import {CMSHeaderWrapper} from '../cms/header/c-cms-header-wrapper';
import {Footer} from '../client/footer/c-footer';
import type {LocationType} from '../../type/react-router-dom-v5-type-extract';
import {BottomAdsWrapper} from '../ads/bottom-ads-wrapper/c-bottom-ads-wrapper';
import type {ScreenContextType} from '../../provider/screen/screen-context-type';
import type {InitialDataType} from '../../provider/intial-data/intial-data-type';

import {FacebookShareButton} from '../share/facebook/c-facebook-share-button';

import pageWrapperStyle from './page-wrapper.scss';

type PropsType = {|
    +children: Node,
    +location: LocationType,
    +screenContextData: ScreenContextType,
    +initialContextData: InitialDataType,
|};

export type PageWrapperPropsType = PropsType;

export function PageWrapper(props: PropsType): Array<Node> {
    const {children, location, screenContextData, initialContextData} = props;

    return [
        <CMSHeaderWrapper key="cms-header-wrapper" location={location}/>,
        <main className={pageWrapperStyle.main_content} key="main">
            {children}
        </main>,
        <FacebookShareButton
            key={'facebook-share-button-' + location.pathname}
            location={location}
            screenContextData={screenContextData}
        />,
        <BottomAdsWrapper
            initialContextData={initialContextData}
            key="bottom-ad-wrapper"
            screenContextData={screenContextData}
        />,
        <Footer key="footer" location={location}/>,
    ];
}
