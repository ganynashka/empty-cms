// @flow

/* global document */

import {Component, type Node} from 'react';

import type {LocationType} from '../../../type/react-router-dom-v5-type-extract';
import {isCMS} from '../../../lib/url';
import {isDevelopment} from '../../../../../webpack/config';
import {googleAdsenseId} from '../../../const';

type PropsType = {
    +location: LocationType,
};

type StateType = null;

export class Adsense extends Component<PropsType, StateType> {
    componentDidMount() {
        const {props} = this;
        const {location} = props;

        if (isCMS(location) || isDevelopment) {
            return;
        }

        this.loadScript();
    }

    loadScript() {
        if (typeof document === 'undefined') {
            return;
        }

        const {head} = document;

        if (!head) {
            return;
        }

        // <script data-ad-client="ca-pub-8997870404482178" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
        const script = document.createElement('script');

        script.dataset.adClient = googleAdsenseId;
        script.setAttribute('async', 'async');
        script.setAttribute('src', 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js');

        head.append(script);
    }

    render(): Node {
        return null;
    }
}
