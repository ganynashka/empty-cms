// @flow

import React, {Component, type Node} from 'react';

import type {ContextRouterType} from '../../../type/react-router-dom-v5-type-extract';
import {isCMS} from '../../../lib/url';

export function Header(props: ContextRouterType): Node {
    const {location} = props;

    if (isCMS(location)) {
        return null;
    }

    return <h1>Skazki header</h1>;
}
