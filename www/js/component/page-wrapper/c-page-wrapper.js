// @flow

import React, {type Node} from 'react';
import classNames from 'classnames';

import {type LocationType} from '../../type/react-router-dom-v5-type-extract';
import {isCMS} from '../../lib/url';

import pageWrapperStyle from './page-wrapper.scss';

type PropsType = {
    +children: Node,
    +location: LocationType,
};

export function PageWrapper(props: PropsType): Node {
    const {children, location} = props;

    const className = classNames(pageWrapperStyle.page_wrapper, {
        [pageWrapperStyle.page_wrapper__cms]: isCMS(location),
    });

    return <main className={className}>{children}</main>;
}
