// @flow

/* global localStorage */

import type {Node} from 'react';
import React, {Component} from 'react';

import type {LocaleNameType} from './const';
import {getLocaleName, setLocaleName} from './locale-helper';

export type LocaleContextType = {|
    +name: LocaleNameType,
    +setName: (localeName: LocaleNameType) => mixed,
|};

const defaultContextData = {
    name: getLocaleName(),
    setName: (localeName: LocaleNameType): null => null,
};

const CLocaleContext = React.createContext<LocaleContextType>(defaultContextData);
const LocaleContextProvider = CLocaleContext.Provider;

export const LocaleContextConsumer = CLocaleContext.Consumer;

type PropsType = {|
    +children: Node,
|};

type StateType = {|
    +providedData: LocaleContextType,
|};

export class LocaleProvider extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {providedData: defaultContextData};
    }

    setName = (localeName: LocaleNameType) => {
        const {state} = this;
        const {providedData} = state;

        setLocaleName(localeName);

        // eslint-disable-next-line react/no-set-state
        this.setState({providedData: {...providedData, name: localeName}});
    };

    getProviderValue(): LocaleContextType {
        const {state} = this;

        return {
            ...state.providedData,
            setName: this.setName,
        };
    }

    render(): Node {
        const {props} = this;
        const {children} = props;

        return <LocaleContextProvider value={this.getProviderValue()}>{children}</LocaleContextProvider>;
    }
}
