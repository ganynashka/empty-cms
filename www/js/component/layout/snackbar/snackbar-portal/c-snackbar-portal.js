// @flow

import type {Node} from 'react';
import React, {Component} from 'react';

import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';

import {isFunction} from '../../../../lib/is';
import type {SnackbarPropsType} from '../type';
import snackbarStyle from '../snackbar.style.scss';

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};

const snackbarContentVariantCssClass = {
    success: snackbarStyle.snackbar__color__success,
    warning: snackbarStyle.snackbar__color__warning,
    error: snackbarStyle.snackbar__color__error,
    info: snackbarStyle.snackbar__color__info,
};

export type ShowSnackbarType = (snackbarProps: SnackbarPropsType, id: string) => Promise<mixed>;
export type HideSnackbarByIdType = (id: string, value: mixed) => mixed;

export type SnackbarPortalContextType = {
    showSnackbar: ShowSnackbarType,
    hideSnackbarById: HideSnackbarByIdType,
};

export const defaultContextData: SnackbarPortalContextType = {
    showSnackbar: (snackbarProps: SnackbarPropsType, id: string): Promise<mixed> => Promise.resolve(null),
    hideSnackbarById: (id: string, value: mixed): null => null,
};

const snackbarPortalContext = React.createContext<SnackbarPortalContextType>(defaultContextData);
const {Provider: SnackbarPortalContextProvider, Consumer: SnackbarPortalContextConsumer} = snackbarPortalContext;

type SnackbarDataType = {|
    +snackbarProps: SnackbarPropsType,
    +resolve: (value: mixed) => mixed,
    +id: string,
|};

type PropsType = {|
    +children: Node,
|};

type StateType = {|
    +snackbarDataList: Array<SnackbarDataType>,
    // +providedData: SnackbarPortalContextType,
|};

export {SnackbarPortalContextConsumer};

export class SnackbarPortalProvider extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            snackbarDataList: [],
            // providedData: defaultContextData,
        };
    }

    getSnackbarById(id: string): SnackbarDataType | null {
        const {state} = this;
        const {snackbarDataList} = state;

        return (
            snackbarDataList.find((snackbarDataInList: SnackbarDataType): boolean => snackbarDataInList.id === id)
            || null
        );
    }

    showSnackbarById(id: string): Error | null {
        const {state} = this;
        const {snackbarDataList} = state;

        const snackbarData = this.getSnackbarById(id);

        if (!snackbarData) {
            console.error('Show snackbar by id: Can not find snackbar with id: ' + id);
            return new Error('Show snackbar by id: Can not find snackbar with id: ' + id);
        }

        snackbarDataList[snackbarDataList.indexOf(snackbarData)] = {
            ...snackbarData,
            snackbarProps: {
                ...snackbarData.snackbarProps,
                isShow: true,
            },
        };

        this.setState({snackbarDataList: [...snackbarDataList]});

        return null;
    }

    hideSnackbarById = (id: string, data: mixed): Error | null => {
        const {state} = this;
        const {snackbarDataList} = state;

        const snackbarData = this.getSnackbarById(id);

        if (!snackbarData) {
            console.error('Show snackbar: Can not find snackbar with id: ' + id);
            return new Error('Show snackbar: Can not find snackbar with id: ' + id);
        }

        snackbarDataList[snackbarDataList.indexOf(snackbarData)] = {
            ...snackbarData,
            snackbarProps: {
                ...snackbarData.snackbarProps,
                isShow: false,
            },
        };

        this.setState({snackbarDataList: [...snackbarDataList]});

        snackbarData.resolve(data);

        return null;
    };

    showSnackbar = (snackbarProps: SnackbarPropsType, id: string): Promise<mixed> => {
        return new Promise((resolve: (value: mixed) => mixed) => {
            const {state} = this;
            const {snackbarDataList} = state;

            const snackbarData = this.getSnackbarById(id);

            if (snackbarData) {
                snackbarDataList[snackbarDataList.indexOf(snackbarData)] = {
                    ...snackbarData,
                    resolve,
                    snackbarProps: {...snackbarData.snackbarProps, isShow: false},
                };

                this.setState({snackbarDataList: [...snackbarDataList]}, (): mixed => this.showSnackbarById(id));
                return;
            }

            const newSnackbarDataList = [
                ...snackbarDataList,
                {
                    snackbarProps: {...snackbarProps, isShow: false},
                    resolve,
                    id,
                },
            ];

            this.setState({snackbarDataList: newSnackbarDataList}, (): mixed => this.showSnackbarById(id));
        });
    };

    getProviderValue(): SnackbarPortalContextType {
        return {
            showSnackbar: this.showSnackbar,
            hideSnackbarById: this.hideSnackbarById,
        };
    }

    createOnExitedHandler(id: string): () => void {
        return () => {
            const snackbarData = this.getSnackbarById(id);

            if (!snackbarData) {
                console.error('createOnExitedHandler: Can not find snackbar with id: ' + id);
                return;
            }

            const {state} = this;
            const {snackbarDataList} = state;

            snackbarDataList[snackbarDataList.indexOf(snackbarData)] = {
                ...snackbarData,
                snackbarProps: {
                    ...snackbarData.snackbarProps,
                    isShow: false,
                },
            };

            this.setState({snackbarDataList: [...snackbarDataList]}, () => {
                const {onExited} = snackbarData.snackbarProps;

                if (isFunction(onExited)) {
                    onExited();
                }

                snackbarData.resolve();
            });
        };
    }

    renderSnackbar = (snackbarData: SnackbarDataType): Node => {
        const {snackbarProps, id} = snackbarData;
        const {isShow, children, variant} = snackbarProps;
        const Icon = variantIcon[variant];

        const handleClose = this.createOnExitedHandler(id);

        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                autoHideDuration={6e3}
                key={id}
                onClose={handleClose}
                open={Boolean(isShow)}
            >
                <SnackbarContent
                    action={[
                        <IconButton aria-label="close" color="inherit" key="close" onClick={handleClose}>
                            <CloseIcon className={snackbarStyle.snackbar__icon}/>
                        </IconButton>,
                    ]}
                    className={`${snackbarStyle.snackbar__content} ${snackbarContentVariantCssClass[variant]}`}
                    message={
                        <div className={snackbarStyle.snackbar__message}>
                            <Icon className={snackbarStyle.snackbar__icon_variant}/>
                            <div className={snackbarStyle.snackbar__message__content}>{children}</div>
                        </div>
                    }
                />
            </Snackbar>
        );
    };

    renderSnackbarList(): Array<Node> {
        const {state} = this;
        const {snackbarDataList} = state;

        return snackbarDataList.map(this.renderSnackbar);
    }

    render(): Node {
        const {props} = this;
        const {children} = props;

        return (
            <SnackbarPortalContextProvider value={this.getProviderValue()}>
                {children}
                {this.renderSnackbarList()}
            </SnackbarPortalContextProvider>
        );
    }
}
