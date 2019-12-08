// @flow

import React, {Component, type Node} from 'react';

import type {InitialDataType, SetInitialDataArgumentType} from './intial-data-type';
import {defaultInitialData} from './intial-data-const';

const InitialDataContext = React.createContext<InitialDataType>(defaultInitialData);
const InitialDataContextProvider = InitialDataContext.Provider;

export const InitialDataContextConsumer = InitialDataContext.Consumer;

type PropsType = {|
    +children: Node,
    +defaultValue: InitialDataType,
|};

type StateType = {|
    +providedData: InitialDataType,
|};

export class InitialDataProvider extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {providedData: props.defaultValue};
    }

    setInitialData = (partInitialData: SetInitialDataArgumentType) => {
        const {state} = this;
        const providedData: InitialDataType = {...state.providedData, ...partInitialData};

        this.setState({providedData});
    };

    getProviderValue(): InitialDataType {
        const {state} = this;
        const {providedData} = state;

        return {
            ...providedData,
            setInitialData: this.setInitialData,
        };
    }

    render(): Node {
        const {props} = this;
        const {children} = props;

        return <InitialDataContextProvider value={this.getProviderValue()}>{children}</InitialDataContextProvider>;
    }
}
