// @flow

import React, {type Node} from 'react';

import popupContentStyle from './popup-content.scss';

type PassedPropsType = {|
    +children: Node,
|};

export type PassedPopupContentPropsType = PassedPropsType;

export function PopupContent(props: PassedPropsType): Node {
    const {children} = props;

    return <div className={popupContentStyle.popup_content}>{children}</div>;
}
