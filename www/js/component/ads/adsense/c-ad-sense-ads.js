// @flow

/* global window*/

import React, {Component, type Node} from 'react';

import {getAdSenseAdsBlockHtml} from './ad-sense-helper';

type PropsType = {|
    +adSlotId: number,
|};

type StateType = null;

export function AdSenseAds(props: PropsType): Node {
    const {adSlotId} = props;

    // eslint-disable-next-line react/no-danger, id-match
    return <div dangerouslySetInnerHTML={{__html: getAdSenseAdsBlockHtml(adSlotId)}}/>;
}
