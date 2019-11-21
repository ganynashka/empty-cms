// @flow

import React, {Component, type Node} from 'react';

import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CloseIcon from '@material-ui/icons/Close';

import {isFunction} from '../../lib/is';

import type {SnackbarPropsType, SnackbarContextType, SnackbarDataType} from './snackbar-context-type';
import snackbarStyle from './snackbar.scss';
import {
    defaultSnackbarContextData,
    snackbarContentVariantCssClass,
    snackbarVariantIcon,
} from './snackbar-context-const';

const snackbarPortalContext = React.createContext<SnackbarContextType>(defaultSnackbarContextData);
const SnackbarContextProvider = snackbarPortalContext.Provider;

export const SnackbarContextConsumer = snackbarPortalContext.Consumer;

type PropsType = {|
    +children: Node,
|};

type StateType = {|
    +snackbarDataList: Array<SnackbarDataType>,
    // +providedData: SnackbarPortalContextType,
|};

export class SnackbarProvider extends Component<PropsType, StateType> {
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

    getProviderValue(): SnackbarContextType {
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
        const Icon = snackbarVariantIcon[variant];

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
            <SnackbarContextProvider value={this.getProviderValue()}>
                {children}
                {this.renderSnackbarList()}
            </SnackbarContextProvider>
        );
    }
}
