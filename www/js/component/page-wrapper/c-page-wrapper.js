// @flow

import React, {type Node} from 'react';
import classNames from 'classnames';

import {CMSHeaderWrapper} from '../cms/header/c-cms-header-wrapper';
import {Footer} from '../client/footer/c-footer';
import type {LocationType} from '../../type/react-router-dom-v5-type-extract';

import pageWrapperStyle from './page-wrapper.scss';

type PropsType = {|
    +children: Node,
    +location: LocationType,
|};

export type PageWrapperPropsType = PropsType;

export function PageWrapper(props: PropsType): Array<Node> {
    const {children, location} = props;

    return [
        <CMSHeaderWrapper key="cms-header-wrapper" location={location}/>,
        <main className={pageWrapperStyle.main_content} key="main">
            {children}
        </main>,
        <Footer key="footer" location={location}/>,
    ];
}
