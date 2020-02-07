// @flow

/* global window*/

import React, {Component, type Node} from 'react';

type PropsType = {};

type StateType = null;

export function AdsenseAds(): Node {
    if (typeof window === 'undefined') {
        return null;
    }

    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.push({});

    return (
        <ins
            className="adsbygoogle"
            data-ad-client="ca-pub-8997870404482178"
            data-ad-format="auto"
            data-ad-slot="2979854461"
            data-adtest="on"
            data-full-width-responsive="true"
            style={{display: 'block'}}
        />
    );
}
