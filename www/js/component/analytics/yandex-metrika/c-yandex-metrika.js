// @flow

/* global window */

import React, {Component, type Node} from 'react';

import {isDevelopment} from '../../../../../webpack/config';
import {yandexMetrikaId} from '../../../const';
import type {LocationType} from '../../../type/react-router-dom-v5-type-extract';
import {isCMS} from '../../../lib/url';
import type {ScreenContextType} from '../../../provider/screen/screen-context-type';

type PropsType = {
    +location: LocationType,
    +screenContextData: ScreenContextType,
};

type StateType = null;

export class YandexMetrika extends Component<PropsType, StateType> {
    componentDidUpdate(prevProps: PropsType, prevState: StateType) {
        const {props} = this;
        const {location, screenContextData} = props;

        if (isCMS(location) || isDevelopment) {
            return;
        }

        if (screenContextData.isWindowLoaded !== prevProps.screenContextData.isWindowLoaded) {
            this.loadScript();
        }
    }

    loadScript() {
        /* eslint-disable max-params, func-names, flowtype/require-parameter-type, id-length, no-param-reassign, no-unused-expressions, babel/no-unused-expressions, no-sequences, unicorn/prefer-query-selector, unicorn/prevent-abbreviations */
        (function (m, e, t, r, i, k, a) {
            m[i]
                = m[i]
                || function () {
                    (m[i].a = m[i].a || []).push(arguments);
                };
            m[i].l = Number(new Date());
            k = e.createElement(t),
            a = e.getElementsByTagName(t)[0],
            k.async = 1,
            k.src = r,
            a.parentNode.insertBefore(k, a);
        })(window, window.document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
        /* eslint-enable max-params, func-names, flowtype/require-parameter-type, id-length, no-param-reassign, no-unused-expressions, babel/no-unused-expressions, no-sequences, unicorn/prefer-query-selector, unicorn/prevent-abbreviations */

        window.ym(yandexMetrikaId, 'init', {clickmap: true, trackLinks: true, accurateTrackBounce: true});
    }

    render(): Node {
        return null;
    }
}
