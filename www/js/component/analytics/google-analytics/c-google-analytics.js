// @flow

// REF: https://developers.google.com/analytics/devguides/collection/analyticsjs/#the_google_analytics_tag
// REF: https://developers.google.com/analytics/devguides/collection/analyticsjs/single-page-applications

/* global window, document */

import type {Node} from 'react';
import React, {Component} from 'react';

import {googleAnalyticsId} from '../../../const';
import type {LocationType} from '../../../type/react-router-dom-v5-type-extract';

type PropsType = {
    +location: LocationType,
};

type StateType = null;

export class GoogleAnalytics extends Component<PropsType, StateType> {
    componentDidMount() {
        this.loadScript();
    }

    componentDidUpdate(prevProps: PropsType, prevState: StateType) {
        const {props} = this;
        const currentPathName = props.location.pathname;

        if (currentPathName !== prevProps.location.pathname) {
            window.ga('set', 'page', currentPathName);
            window.ga('send', 'pageview');
        }
    }

    loadScript() {
        /* eslint-disable max-params, func-names, flowtype/require-parameter-type, id-length, no-param-reassign, no-unused-expressions, babel/no-unused-expressions, no-sequences, unicorn/prefer-query-selector */
        (function (i, s, o, g, r, a, m) {
            i.GoogleAnalyticsObject = r;
            i[r]
                = i[r]
                || function () {
                    (i[r].q = i[r].q || []).push(arguments);
                },
            i[r].l = Number(new Date());
            a = s.createElement(o), m = s.getElementsByTagName(o)[0];
            a.async = true;
            a.src = g;
            m.parentNode && m.parentNode.insertBefore(a, m);
        })(window, window.document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
        /* eslint-enable max-params, func-names, flowtype/require-parameter-type, id-length, no-param-reassign, no-unused-expressions, babel/no-unused-expressions, no-sequences, unicorn/prefer-query-selector */

        window.ga('create', googleAnalyticsId, 'auto');
        window.ga('send', 'pageview');
    }

    /*
    bindEventListener() {
        const {props} = this;
        const {history} = props;

        history.listen((location: {pathname: string}, action: string) => {
            console.log('GA: route change:', location);

            window.ga('set', 'page', location.pathname);
            window.ga('send', 'pageview');

            // just example for custom events
            if (location.pathname.includes('give-the-badge')) {
                console.log(
                    '---> GA: custom event:',
                    '[',
                    'send',
                    'event',
                    'Event Category Name',
                    'Event Action Name',
                    'Event Label Name',
                    ']'
                );
                // window.ga('send', 'event', 'Event Category Name', 'Event Action Name', 'Event Label Name');
                // window.ga('send', 'event', 'Badge List Load', fetchNewsKListResult.last === true ? 'Finish' : 'Part');
            }
        });
    }
*/

    render(): Node {
        return null;
    }
}
