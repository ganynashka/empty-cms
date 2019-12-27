// @flow

/* global window */

import React, {Component, type Node} from 'react';

import type {ScreenContextType} from './screen-context-type';
import {getScreenState} from './screen-context-helper';

const defaultScreenContextData = getScreenState();

const screenContext = React.createContext<ScreenContextType>(defaultScreenContextData);
const ScreenContextProvider = screenContext.Provider;

export const ScreenContextConsumer = screenContext.Consumer;

type PropsType = {|
    +children: Node,
|};

type StateType = {|
    +providedData: ScreenContextType,
|};

export class ScreenProvider extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            providedData: defaultScreenContextData,
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize, false);
    }

    handleResize = () => {
        const {state} = this;
        const {providedData} = state;
        const {width, height} = providedData;
        const screenState = getScreenState();

        if (screenState.width !== width || screenState.height !== height) {
            this.setState({
                providedData: screenState,
            });
        }
    };

    getProviderValue(): ScreenContextType {
        const {state} = this;

        return {
            ...state.providedData,
        };
    }

    render(): Node {
        const {props} = this;
        const {children} = props;

        return <ScreenContextProvider value={this.getProviderValue()}>{children}</ScreenContextProvider>;
    }
}
