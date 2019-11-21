// @flow

import React, {type Node} from 'react';

import popupContentStyle from './popup-content.scss';

type PropsType = {|
    +children: Node,
|};

export type PassedPopupContentPropsType = PropsType;

export function PopupContent(props: PropsType): Node {
    const {children} = props;

    return <div className={popupContentStyle.popup_content}>{children}</div>;
}
