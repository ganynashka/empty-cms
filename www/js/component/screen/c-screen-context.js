// @flow

/* global window */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';

import type {ScreenContextType} from './screen-helper';
import {getScreenState} from './screen-helper';

const defaultContextData = getScreenState();

const screenContext = React.createContext<ScreenContextType>(defaultContextData);
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

        const view = this;

        view.state = {
            providedData: defaultContextData,
        };
    }

    componentDidMount() {
        const view = this;

        window.addEventListener('resize', view.handleResize, false);
    }

    handleResize = () => {
        const view = this;
        const {state} = view;
        const {providedData} = state;
        const {width, height} = providedData;
        const screenState = getScreenState();

        if (screenState.width !== width || screenState.height !== height) {
            view.setState({
                providedData: screenState,
            });
        }
    };

    getProviderValue(): ScreenContextType {
        const view = this;
        const {state} = view;

        return {
            ...state.providedData,
        };
    }

    render(): Node {
        const view = this;
        const {props} = view;
        const {children} = props;

        return <ScreenContextProvider value={view.getProviderValue()}>{children}</ScreenContextProvider>;
    }
}
