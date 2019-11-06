// @flow

import {type Node} from 'react';

export type PopupPropsType = {|
    +isShow: boolean,
    +isFullScreen?: boolean,
    +children: Node,

    +onEnter?: () => void,
    +onEntering?: () => void,
    +onEntered?: () => void,
    +onExit?: () => void,
    +onExiting?: () => void,
    +onExited?: () => void,
|};
