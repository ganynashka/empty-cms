// @flow

/* global document */

import React, {Component, type Node} from 'react';
import {InlineShareButtons} from 'sharethis-reactjs';

import type {ScreenContextType} from '../../../provider/screen/screen-context-type';
import type {InitialDataType} from '../../../provider/intial-data/intial-data-type';
import type {LocationType} from '../../../type/react-router-dom-v5-type-extract';

import {footerLinkList} from '../../client/footer/footer-const';

import shareButtonListStyle from './share-button-list.scss';

type PropsType = {|
    +location: LocationType,
    +screenContextData: ScreenContextType,
    +initialContextData: InitialDataType,
|};

export function ShareButtonList(props: PropsType): Node {
    const {screenContextData, initialContextData, location} = props;

    if (footerLinkList.includes(location.pathname)) {
        return null;
    }

    if (!screenContextData.isWindowLoaded) {
        return <div className={shareButtonListStyle.share_button_list__wrapper}/>;
    }

    const {openGraphData} = initialContextData;

    if (!openGraphData) {
        return <div className={shareButtonListStyle.share_button_list__wrapper}/>;
    }

    return (
        <div className={shareButtonListStyle.share_button_list__wrapper}>
            <InlineShareButtons
                config={{
                    alignment: 'left',
                    color: 'social',
                    enabled: true,
                    // eslint-disable-next-line id-match, camelcase
                    font_size: 16,
                    labels: null,
                    language: 'ru',
                    networks: ['vk', 'facebook', 'odnoklassniki', 'twitter'],
                    padding: 12,
                    radius: 4,
                    // eslint-disable-next-line id-match, camelcase
                    show_total: false,
                    size: 40,

                    url: openGraphData.url,
                    image: openGraphData.image,
                    description: openGraphData.description,
                    title: openGraphData.title,
                }}
            />
        </div>
    );
}
