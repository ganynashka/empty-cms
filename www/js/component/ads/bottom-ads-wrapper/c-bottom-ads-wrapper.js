// @flow

import React, {Component, type Node} from 'react';

import {AdSenseAds} from '../adsense/c-ad-sense-ads';
import type {ScreenContextType} from '../../../provider/screen/screen-context-type';
import type {InitialDataType} from '../../../provider/intial-data/intial-data-type';
import {googleAdSenseBottomAdId} from '../../../const';

import bottomAdsWrapperStyle from './bottom-ads-wrapper.scss';

type PropsType = {|
    +screenContextData: ScreenContextType,
    +initialContextData: InitialDataType,
|};

type StateType = null;

// eslint-disable-next-line react/prefer-stateless-function
export class BottomAdsWrapper extends Component<PropsType, StateType> {
    render(): Node {
        const {props} = this;
        const {screenContextData, initialContextData} = props;

        const {articlePathData} = initialContextData;
        const {isWindowLoaded} = screenContextData;

        if (!articlePathData || !isWindowLoaded) {
            return null;
        }

        const {mongoDocument} = articlePathData;

        return (
            <div className={bottomAdsWrapperStyle.bottom_ads_wrapper__wrapper}>
                <AdSenseAds
                    // additionalClass={bottomAdsWrapperStyle.bottom_ads_ins_block}
                    adSlotId={googleAdSenseBottomAdId}
                    key={`slug:${mongoDocument.slug}-screen-width:${screenContextData.width}`}
                />
            </div>
        );
    }
}
