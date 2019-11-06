// @flow

import {type Node} from 'react';

export type SnackbarPropsType = {|
    +isShow?: boolean,
    +children: Node,
    +variant: 'error' | 'info' | 'success' | 'warning',

    +onEnter?: () => void,
    +onEntering?: () => void,
    +onEntered?: () => void,
    +onExit?: () => void,
    +onExiting?: () => void,
    +onExited?: () => void,
|};
