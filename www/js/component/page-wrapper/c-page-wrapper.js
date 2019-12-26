// @flow

import React, {type Node} from 'react';
import classNames from 'classnames';

import {Header as ClientHeader} from '../client/header/c-header';
import {CMSHeaderWrapper} from '../cms/header/c-cms-header-wrapper';
import {Footer} from '../client/footer/c-footer';
import type {LocationType} from '../../type/react-router-dom-v5-type-extract';
import type {InitialDataType} from '../../provider/intial-data/intial-data-type';
import type {ScreenContextType} from '../../provider/screen/screen-context-type';
import type {ThemeContextType} from '../../provider/theme/theme-context-type';

import pageWrapperStyle from './page-wrapper.scss';

type PropsType = {
    +children: Node,
    +additionalClassName?: string,
    +location: LocationType,
    +initialContextData: InitialDataType,
    +screenContextData: ScreenContextType,
    +themeContextData: ThemeContextType,
};

export function PageWrapper(props: PropsType): Node {
    const {children, initialContextData, location, additionalClassName, screenContextData, themeContextData} = props;

    const className = classNames(pageWrapperStyle.page_wrapper, {
        [String(additionalClassName)]: Boolean(additionalClassName),
    });

    return (
        <div className={className}>
            <ClientHeader
                initialContextData={initialContextData}
                location={location}
                screenContextData={screenContextData}
                themeContextData={themeContextData}
            />
            <CMSHeaderWrapper location={location}/>
            <main className={pageWrapperStyle.main_content}>{children}</main>
            <Footer location={location}/>
        </div>
    );
}
