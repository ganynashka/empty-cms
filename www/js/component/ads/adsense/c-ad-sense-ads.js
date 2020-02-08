// @flow

/* global window */

import React, {Component, type Node} from 'react';

// import {getAdSenseAdsBlockHtml} from './ad-sense-helper';

type PropsType = {|
    +adSlotId: number,
|};

type StateType = null;

export class AdSenseAds extends Component<PropsType, StateType> {
    componentDidMount() {
        window.adsbygoogle = window.adsbygoogle || [];

        const {log} = console;

        window.adsbygoogle.push({
            google_ad_client: 'ca-pub-8997870404482178',
            google_ad_slot: '2979854461',

            enable_page_level_ads: true,
        });

        log('!!!!!');
        log(window.adsbygoogle);
    }

    render(): Node {
        const {props} = this;
        const {adSlotId} = props;

        if (typeof window === 'undefined') {
            return null;
        }

        // eslint-disable-next-line react/no-danger, id-match
        return (
            <div
                // dangerouslySetInnerHTML={{__html: getAdSenseAdsBlockHtml(adSlotId)}}
                style={{width: '100%', height: 500}}
            >
                <ins
                    className="adsbygoogle"
                    data-ad-client="ca-pub-8997870404482178"
                    data-ad-format="auto"
                    data-ad-slot="2979854461"
                    data-full-width-responsive="true"
                    style={{display: 'block'}}
                />
            </div>
        );
    }
}
