// @flow

import React, {type Node} from 'react';
import classNames from 'classnames';

import pageWrapperStyle from './page-wrapper.scss';

type PropsType = {
    +children: Node,
    +additionalClassName?: string,
};

export function PageWrapper(props: PropsType): Node {
    const {children, additionalClassName} = props;

    const className = classNames(pageWrapperStyle.page_wrapper, {
        [String(additionalClassName)]: Boolean(additionalClassName),
    });

    return <main className={className}>{children}</main>;
}
