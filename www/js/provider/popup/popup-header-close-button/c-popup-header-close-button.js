// @flow

import React, {type Node} from 'react';

import popupHeaderCloseButtonStyle from './popup-header-close-button.scss';

type PropsType = {|
    +onClick: () => mixed,
|};

export type CloseButtonPropsType = PropsType;

export function PopupHeaderCloseButton(props: PropsType): Node {
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
