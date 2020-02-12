// @flow

/* global document */

import React, {Component, type Node} from 'react';

import type {LocationType} from '../../../type/react-router-dom-v5-type-extract';
import {isCMS} from '../../../lib/url';
import {isDevelopment} from '../../../../../webpack/config';
import type {ScreenContextType} from '../../../provider/screen/screen-context-type';
import {hostingDomainName} from '../../../../../server/src/config';

type PropsType = {
    +location: LocationType,
    +screenContextData: ScreenContextType,
};

type StateType = null;

export class FacebookShareButton extends Component<PropsType, StateType> {
    componentDidUpdate(prevProps: PropsType, prevState: StateType) {
        const {props} = this;
        const {location, screenContextData} = props;

        if (isCMS(location) || isDevelopment) {
            return;
        }

        if (
            screenContextData.isWindowLoaded !== prevProps.screenContextData.isWindowLoaded
            || screenContextData.isWindowLoaded
        ) {
            this.loadScript();
        }
    }

    loadScript() {
        if (typeof document === 'undefined') {
            return;
        }

        /* eslint-disable max-params, func-names, flowtype/require-parameter-type, id-length, no-param-reassign, no-unused-expressions, babel/no-unused-expressions, no-sequences, unicorn/prefer-query-selector */
        (function (d, s, id) {
            const fjs = d.getElementsByTagName(s)[0];

            if (d.getElementById(id)) {
                return;
            }

            const js = d.createElement(s);

            js.id = id;
            js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0';
            // $FlowFixMe
            fjs.parentNode.insertBefore(js, fjs);
        })(document, 'script', 'facebook-jssdk');
        /* eslint-enable max-params, func-names, flowtype/require-parameter-type, id-length, no-param-reassign, no-unused-expressions, babel/no-unused-expressions, no-sequences, unicorn/prefer-query-selector */
    }

    renderRootNode(): Node {
        return <div id="fb-root" key="fb-root"/>;
    }

    render(): Node {
        const {props} = this;
        const {location, screenContextData} = props;

        if (!screenContextData.isWindowLoaded) {
            return this.renderRootNode();
        }

        return (
            <>
                {this.renderRootNode()}
                <div
                    className="fb-share-button"
                    data-href={'https://' + hostingDomainName + location.pathname}
                    data-layout="button_count"
                />
            </>
        );
    }
}
