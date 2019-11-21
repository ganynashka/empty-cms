// @flow

import React, {type Node} from 'react';

import pageWrapperStyle from './page-wrapper.scss';

type PropsType = {
    +children: Node,
};

export function PageWrapper(props: PropsType): Node {
    const {children} = props;

    return <main className={pageWrapperStyle.page_wrapper}>{children}</main>;
}
