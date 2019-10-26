// @flow

import React, {type Node} from 'react';

// eslint-disable-next-line id-match
export function renderWrapperList(wrapperList: Array<React$ComponentType<*>>, children: Node): Node {
    if (wrapperList.length === 0) {
        return children;
    }

    const [FirstComponent, ...restComponentList] = wrapperList;

    return <FirstComponent>{renderWrapperList(restComponentList, children)}</FirstComponent>;
}
