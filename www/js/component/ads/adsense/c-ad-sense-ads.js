// @flow

/* global window */

import React, {Component, type Node} from 'react';

import {googleAdSenseId} from '../../../const';
// import type {ScreenContextType} from '../../../provider/screen/screen-context-type';

// import adSenseStyle from './ad-sense.scss';

type PropsType = {|
    +adSlotId: number,
|};

type StateType = null;

export class AdSenseAds extends Component<PropsType, StateType> {
    componentDidMount() {
        const {props} = this;
        const {adSlotId} = props;

        window.adsbygoogle = window.adsbygoogle || [];

        window.adsbygoogle.push({
            // eslint-disable-next-line camelcase, id-match
            google_ad_client: googleAdSenseId,
            // eslint-disable-next-line camelcase, id-match
            google_ad_slot: String(adSlotId),
        });
    }

    render(): Node {
        const {props} = this;
        const {adSlotId} = props;

        if (typeof window === 'undefined') {
            return null;
        }

        return (
            <>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <ins
                    className="adsbygoogle"
                    data-ad-client={googleAdSenseId}
                    data-ad-format="auto"
                    data-ad-slot={adSlotId}
                    data-full-width-responsive="true"
                    style={{display: 'block'}}
                />
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
            </>
        );
    }
}
