// @flow

import React, {Component, type Node} from 'react';

import {getDefaultThemeContextData, setThemeName} from './theme-context-helper';
import type {ThemeContextType, ThemeNameType} from './theme-context-type';

const defaultThemeContextData = getDefaultThemeContextData();

const ThemeContext = React.createContext<ThemeContextType>(defaultThemeContextData);
const ThemeContextProvider = ThemeContext.Provider;

export const ThemeContextConsumer = ThemeContext.Consumer;

type PropsType = {|
    +children: Node,
|};

type StateType = {|
    +providedData: ThemeContextType,
|};

export class ThemeProvider extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {providedData: defaultThemeContextData};
    }

    setName = (themeName: ThemeNameType) => {
        const {state} = this;
        const {providedData} = state;

        setThemeName(themeName);

        this.setState({providedData: {...providedData, name: themeName}});
    };

    getProviderValue(): ThemeContextType {
        const {state} = this;
        const {providedData} = state;
        const {name} = providedData;

        return {
            name,
            setName: this.setName,
        };
    }

    render(): Node {
        const {props} = this;
        const {children} = props;

        return <ThemeContextProvider value={this.getProviderValue()}>{children}</ThemeContextProvider>;
    }
}
