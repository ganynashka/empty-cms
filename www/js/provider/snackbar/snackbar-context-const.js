// @flow

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';

import type {SnackbarContextType, SnackbarPropsType} from './snackbar-context-type';
import snackbarStyle from './snackbar.scss';

export const defaultSnackbarContextData: SnackbarContextType = {
    showSnackbar: (snackbarProps: SnackbarPropsType, id: string): Promise<mixed> => Promise.resolve(null),
    hideSnackbarById: (id: string, value: mixed): null => null,
};

export const snackbarVariantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};

export const snackbarContentVariantCssClass = {
    success: snackbarStyle.snackbar__color__success,
    warning: snackbarStyle.snackbar__color__warning,
    error: snackbarStyle.snackbar__color__error,
    info: snackbarStyle.snackbar__color__info,
};
