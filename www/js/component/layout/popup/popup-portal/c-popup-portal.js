// @flow

import React, {Component, type Node} from 'react';

import type {PopupPropsType} from '../type';
import {Popup} from '../c-popup';
import {isFunction} from '../../../../lib/is';

export type ShowPopupType = (popupProps: PopupPropsType, id: string) => Promise<mixed>;
export type HidePopupByIdType = (id: string, value: mixed) => mixed;

export type PopupPortalContextType = {
    showPopup: ShowPopupType,
    hidePopupById: HidePopupByIdType,
};

export const defaultContextData: PopupPortalContextType = {
    showPopup: (popupProps: PopupPropsType, id: string): Promise<mixed> => Promise.resolve(null),
    hidePopupById: (id: string, value: mixed): null => null,
};

const popupPortalContext = React.createContext<PopupPortalContextType>(defaultContextData);
const {Provider: PopupPortalContextProvider, Consumer: PopupPortalContextConsumer} = popupPortalContext;

type PopupDataType = {|
    +popupProps: PopupPropsType,
    +resolve: (value: mixed) => mixed,
    +id: string,
|};

type PropsType = {|
    +children: Node,
|};

type StateType = {|
    +popupDataList: Array<PopupDataType>,
    // +providedData: PopupPortalContextType,
|};

export {PopupPortalContextConsumer};

export class PopupPortalProvider extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            popupDataList: [],
            // providedData: defaultContextData,
        };
    }

    getPopupById(id: string): PopupDataType | null {
        const {state} = this;
        const {popupDataList} = state;

        return popupDataList.find((popupDataInList: PopupDataType): boolean => popupDataInList.id === id) || null;
    }

    showPopupById(id: string): Error | null {
        const {state} = this;
        const {popupDataList} = state;

        const popupData = this.getPopupById(id);

        if (!popupData) {
            console.error('Show popup by id: Can not find popup with id: ' + id);
            return new Error('Show popup by id: Can not find popup with id: ' + id);
        }

        popupDataList[popupDataList.indexOf(popupData)] = {
            ...popupData,
            popupProps: {
                ...popupData.popupProps,
                isShow: true,
            },
        };

        this.setState({popupDataList: [...popupDataList]});

        return null;
    }

    hidePopupById = (id: string, data: mixed): Error | null => {
        const {state} = this;
        const {popupDataList} = state;

        const popupData = this.getPopupById(id);

        if (!popupData) {
            console.error('Show popup: Can not find popup with id: ' + id);
            return new Error('Show popup: Can not find popup with id: ' + id);
        }

        popupDataList[popupDataList.indexOf(popupData)] = {
            ...popupData,
            popupProps: {
                ...popupData.popupProps,
                isShow: false,
            },
        };

        this.setState({popupDataList: [...popupDataList]});

        popupData.resolve(data);

        return null;
    };

    showPopup = (popupProps: PopupPropsType, id: string): Promise<mixed> => {
        return new Promise((resolve: (value: mixed) => mixed) => {
            const {state} = this;
            const {popupDataList} = state;

            const newPopupDataList = [
                ...popupDataList,
                {
                    popupProps: {...popupProps, isShow: popupProps.isShow},
                    resolve,
                    id,
                },
            ];

            this.setState({popupDataList: newPopupDataList}, (): mixed => this.showPopupById(id));
        });
    };

    getProviderValue(): PopupPortalContextType {
        return {
            showPopup: this.showPopup,
            hidePopupById: this.hidePopupById,
        };
    }

    createOnExitedHandler(id: string): () => void {
        return () => {
            const popupData = this.getPopupById(id);

            if (!popupData) {
                console.error('createOnExitedHandler: Can not find popup with id: ' + id);
                return;
            }

            const {state} = this;
            const {popupDataList} = state;

            popupDataList.splice(popupDataList.indexOf(popupData), 1);

            this.setState({popupDataList: [...popupDataList]}, () => {
                const {onExited} = popupData.popupProps;

                if (isFunction(onExited)) {
                    onExited();
                }
            });
        };
    }

    renderPopup = (popupData: PopupDataType): Node => {
        const {popupProps, id} = popupData;
        const {isFullScreen, isShow, children} = popupProps;

        return (
            <Popup isFullScreen={isFullScreen} isShow={isShow} key={id} onExited={this.createOnExitedHandler(id)}>
                {children}
            </Popup>
        );
    };

    renderPopupList(): Array<Node> {
        const {state} = this;
        const {popupDataList} = state;

        return popupDataList.map(this.renderPopup);
    }

    render(): Node {
        const {props} = this;
        const {children} = props;

        return (
            <PopupPortalContextProvider value={this.getProviderValue()}>
                {children}
                {this.renderPopupList()}
            </PopupPortalContextProvider>
        );
    }
}
