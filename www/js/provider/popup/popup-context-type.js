// @flow

import {type Node} from 'react';

export type PopupPropsType = {|
    +isShow?: boolean,
    +isFullScreen?: boolean,
    +children: Node,

    +onEnter?: () => void,
    +onEntering?: () => void,
    +onEntered?: () => void,
    +onExit?: () => void,
    +onExiting?: () => void,
    +onExited?: () => void,
|};

export type PopupContextShowPopupType = (popupProps: PopupPropsType, id: string) => Promise<mixed>;
export type PopupContextHidePopupByIdType = (id: string, value: mixed) => mixed;

export type PopupContextType = {
    showPopup: PopupContextShowPopupType,
    hidePopupById: PopupContextHidePopupByIdType,
};

export type PopupDataType = {|
    +popupProps: PopupPropsType,
    +resolve: (value: mixed) => mixed,
    +id: string,
|};
