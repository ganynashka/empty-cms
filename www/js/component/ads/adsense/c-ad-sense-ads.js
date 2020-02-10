// @flow

/* global window */

import React, {Component, type Node} from 'react';
import classNames from 'classnames';

import {googleAdSenseId} from '../../../const';
import {waitForCallback} from '../../../../../server/src/util/time';

type PropsType = {|
    +adSlotId: number,
    +additionalClass?: string,
|};

type StateType = null;

export class AdSenseAds extends Component<PropsType, StateType> {
    async componentDidMount() {
        const {props} = this;
        const {adSlotId} = props;

        await waitForCallback((): boolean => Boolean(window.adsbygoogle));

        window.adsbygoogle.push({
            // eslint-disable-next-line camelcase, id-match
            google_ad_client: googleAdSenseId,
            // eslint-disable-next-line camelcase, id-match
            google_ad_slot: adSlotId,
        });
    }

    render(): Node {
        const {props} = this;
        const {adSlotId, additionalClass} = props;

        if (typeof window === 'undefined') {
            return null;
        }

        const className = classNames('adsbygoogle', {[String(additionalClass)]: Boolean(additionalClass)});

        return (
            <ins
                className={className}
                data-ad-client={googleAdSenseId}
                data-ad-format="auto"
                data-ad-slot={adSlotId}
                data-full-width-responsive="true"
                style={{display: 'block'}}
            />
        );
    }
}
