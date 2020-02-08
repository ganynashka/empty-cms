// @flow

/* global window */

import React, {Component, type Node} from 'react';
import AdSense from 'react-adsense';

import {getAdSenseAdsBlockHtml} from './ad-sense-helper';
import {googleAdSenseId} from '../../../const';

type PropsType = {|
    +adSlotId: number,
|};

type StateType = null;

export function AdSenseAds(props: PropsType): Node {
    const {adSlotId} = props;

    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <AdSense.Google
            client={googleAdSenseId}
            slot={adSlotId}
/*
            style={{display: 'block'}}
            format='auto'
            responsive='true'
            layoutKey='-gw-1+2a-9x+5c'
*/
        />
    );

/*
    // eslint-disable-next-line react/no-danger, id-match
    return <div dangerouslySetInnerHTML={{__html: getAdSenseAdsBlockHtml(adSlotId)}} style={{width: 300}}/>;
*/
}
