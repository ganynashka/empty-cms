// @flow

import React, {type Node} from 'react';
import classNames from 'classnames';

import {CMSHeaderWrapper} from '../cms/header/c-cms-header-wrapper';
import {Footer} from '../client/footer/c-footer';
import type {LocationType} from '../../type/react-router-dom-v5-type-extract';

import pageWrapperStyle from './page-wrapper.scss';

type PropsType = {
    +children: Node,
    +additionalClassName?: string,
    +location: LocationType,
};

export function PageWrapper(props: PropsType): Node {
    const {children, location, additionalClassName} = props;

    const className = classNames(pageWrapperStyle.page_wrapper, {
        [String(additionalClassName)]: Boolean(additionalClassName),
    });

    return (
        <div className={className}>
            <CMSHeaderWrapper location={location}/>
            <main className={pageWrapperStyle.main_content}>{children}</main>
            <Footer location={location}/>
        </div>
    );
}
