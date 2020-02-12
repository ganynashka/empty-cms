// @flow

/* global document */

import React, {Component, type Node} from 'react';
import {InlineShareButtons} from 'sharethis-reactjs';

import type {ScreenContextType} from '../../../provider/screen/screen-context-type';

import shareButtonListStyle from './share-button-list.scss';

type PropsType = {|
    +screenContextData: ScreenContextType,
|};

export function ShareButtonList(props: PropsType): Node {
    const {screenContextData} = props;

    if (!screenContextData.isWindowLoaded) {
        return null;
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
                }}
            />
        </div>
    );
}
