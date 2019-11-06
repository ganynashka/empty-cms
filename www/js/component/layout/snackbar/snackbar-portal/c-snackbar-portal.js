// @flow

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';

import type {SnackbarPropsType} from '../type';
import {Snackbar} from '../c-snackbar';
import {isFunction} from '../../../../lib/is';

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
    +providedData: SnackbarPortalContextType,
|};

export {SnackbarPortalContextConsumer};

export class SnackbarPortalProvider extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        const view = this;

        view.state = {
            snackbarDataList: [],
            providedData: defaultContextData,
        };
    }

    getSnackbarById(id: string): SnackbarDataType | null {
        const view = this;

        const {state} = view;
        const {snackbarDataList} = state;

        return (
            snackbarDataList.find((snackbarDataInList: SnackbarDataType): boolean => snackbarDataInList.id === id)
            || null
        );
    }

    showSnackbarById(id: string): Error | null {
        const view = this;

        const {state} = view;
        const {snackbarDataList} = state;

        const snackbarData = view.getSnackbarById(id);

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

        view.setState({snackbarDataList: [...snackbarDataList]});

        return null;
    }

    hideSnackbarById = (id: string, data: mixed): Error | null => {
        const view = this;

        const {state} = view;
        const {snackbarDataList} = state;

        const snackbarData = view.getSnackbarById(id);

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

        view.setState({snackbarDataList: [...snackbarDataList]});

        snackbarData.resolve(data);

        return null;
    };

    showSnackbar = (snackbarProps: SnackbarPropsType, id: string): Promise<mixed> => {
        return new Promise((resolve: (value: mixed) => mixed) => {
            const view = this;

            const {state} = view;
            const {snackbarDataList} = state;

            const newSnackbarDataList = [
                ...snackbarDataList,
                {
                    snackbarProps: {...snackbarProps, isShow: snackbarProps.isShow},
                    resolve,
                    id,
                },
            ];

            view.setState({snackbarDataList: newSnackbarDataList}, (): mixed => view.showSnackbarById(id));
        });
    };

    getProviderValue(): SnackbarPortalContextType {
        const view = this;

        return {
            showSnackbar: view.showSnackbar,
            hideSnackbarById: view.hideSnackbarById,
        };
    }

    createOnExitedHandler(id: string): () => void {
        return () => {
            const view = this;

            const snackbarData = view.getSnackbarById(id);

            if (!snackbarData) {
                console.error('createOnExitedHandler: Can not find snackbar with id: ' + id);
                return;
            }

            const {state} = view;
            const {snackbarDataList} = state;

            snackbarDataList.splice(snackbarDataList.indexOf(snackbarData), 1);

            view.setState({snackbarDataList: [...snackbarDataList]}, () => {
                const {onExited} = snackbarData.snackbarProps;

                if (isFunction(onExited)) {
                    onExited();
                }
            });
        };
    }

    renderSnackbar = (snackbarData: SnackbarDataType): Node => {
        const view = this;
        const {snackbarProps, id} = snackbarData;
        const {isFullScreen, isShow, children} = snackbarProps;

        return (
            <Snackbar isFullScreen={isFullScreen} isShow={isShow} key={id} onExited={view.createOnExitedHandler(id)}>
                {children}
            </Snackbar>
        );
    };

    renderSnackbarList(): Array<Node> {
        const view = this;
        const {state} = view;
        const {snackbarDataList} = state;

        return snackbarDataList.map(view.renderSnackbar);
    }

    render(): Node {
        const view = this;
        const {props} = view;
        const {children} = props;

        return (
            <SnackbarPortalContextProvider value={view.getProviderValue()}>
                {children}
                {view.renderSnackbarList()}
            </SnackbarPortalContextProvider>
        );
    }
}
