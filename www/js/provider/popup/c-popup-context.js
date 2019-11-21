// @flow

import React, {Component, type Node} from 'react';

import {isFunction} from '../../lib/is';

import type {PopupPropsType, PopupContextType, PopupDataType} from './popup-context-type';
import {Popup} from './popup/c-popup';
import {defaultPopupContextData} from './popup-context-const';

const popupContext = React.createContext<PopupContextType>(defaultPopupContextData);
const PopupContextProvider = popupContext.Provider;

export const PopupContextConsumer = popupContext.Consumer;

type PropsType = {|
    +children: Node,
|};

type StateType = {|
    +popupDataList: Array<PopupDataType>,
|};

export class PopupProvider extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            popupDataList: [],
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

    getProviderValue(): PopupContextType {
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
            <PopupContextProvider value={this.getProviderValue()}>
                {children}
                {this.renderPopupList()}
            </PopupContextProvider>
        );
    }
}
