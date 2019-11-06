// @flow

import {type Node} from 'react';

export type SnackbarPropsType = {|
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
