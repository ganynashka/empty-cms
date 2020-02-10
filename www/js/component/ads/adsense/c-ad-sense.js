// @flow

/* global document */

import {Component, type Node} from 'react';

import type {LocationType} from '../../../type/react-router-dom-v5-type-extract';
import {isCMS} from '../../../lib/url';
import {isDevelopment} from '../../../../../webpack/config';
import {googleAdSenseId} from '../../../const';
import type {ScreenContextType} from '../../../provider/screen/screen-context-type';
import {waitForTime} from '../../../../../server/src/util/time';
import {promiseCatch} from '../../../lib/promise';

type PropsType = {
    +location: LocationType,
    +screenContextData: ScreenContextType,
};

type StateType = null;

export class AdSense extends Component<PropsType, StateType> {
    componentDidUpdate(prevProps: PropsType, prevState: StateType) {
        const {props} = this;
        const {location, screenContextData} = props;

        if (isCMS(location) || isDevelopment) {
            return;
        }

        if (screenContextData.isWindowLoaded !== prevProps.screenContextData.isWindowLoaded) {
            waitForTime(3e3)
                .then(this.loadScript)
                .catch(promiseCatch);
        }
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

        script.dataset.adClient = googleAdSenseId;
        script.setAttribute('async', 'async');
        script.setAttribute('src', 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js');

        head.append(script);
    }

    render(): Node {
        return null;
    }
}
