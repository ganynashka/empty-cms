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

export type ShowSnackbarType = (snackbarProps: SnackbarPropsType, id: string) => Promise<mixed>;
export type HideSnackbarByIdType = (id: string, value: mixed) => mixed;

export type SnackbarContextType = {
    showSnackbar: ShowSnackbarType,
    hideSnackbarById: HideSnackbarByIdType,
};

export type SnackbarDataType = {|
    +snackbarProps: SnackbarPropsType,
    +resolve: (value: mixed) => mixed,
    +id: string,
|};
