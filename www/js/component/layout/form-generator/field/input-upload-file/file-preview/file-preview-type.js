// @flow

import {type Node} from 'react';

import type {SnackbarContextType} from '../../../../../../provider/snackbar/snackbar-context-type';

export type PreviewFileTypePropsType = {|
    +src: string,
    +snackbarContext: SnackbarContextType,
    +children?: Node,
|};
