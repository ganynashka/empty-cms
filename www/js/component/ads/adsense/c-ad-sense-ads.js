// @flow

/* global window */

import React, {Component, type Node} from 'react';

import {getAdSenseAdsBlockHtml} from './ad-sense-helper';

type PropsType = {|
    +adSlotId: number,
|};

type StateType = null;

export function AdSenseAds(props: PropsType): Node {
    const {adSlotId} = props;

    if (typeof window === 'undefined') {
        return null;
    }

    // eslint-disable-next-line react/no-danger, id-match
    return <div style={{width: 300}} dangerouslySetInnerHTML={{__html: getAdSenseAdsBlockHtml(adSlotId)}}/>;
}
