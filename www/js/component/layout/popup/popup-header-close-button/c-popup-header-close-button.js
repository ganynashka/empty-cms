// @flow

import React, {type Node} from 'react';

import popupHeaderCloseButtonStyle from './popup-header-close-button.style.scss';

type PassedPropsType = {|
    +onClick: () => mixed,
|};

export type CloseButtonPropsType = PassedPropsType;

export function PopupHeaderCloseButton(props: PassedPropsType): Node {
    const {onClick} = props;

    return (
        <button
            accessKey="q"
            className={popupHeaderCloseButtonStyle.popup_header_close_button}
            onClick={onClick}
            type="button"
        >
            <span className={popupHeaderCloseButtonStyle.popup_header_close_button__cross_line_1}/>
            <span className={popupHeaderCloseButtonStyle.popup_header_close_button__cross_line_2}/>
        </button>
    );
}
