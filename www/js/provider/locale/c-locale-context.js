// @flow

/* global localStorage */

import React, {Component, type Node} from 'react';

import type {LocaleNameType, LocaleContextValueMapType, LocaleContextType} from './locale-context-type';
import {getDefaultLocaleContextData, getLocalizedString, setLocaleName} from './locale-context-helper';
import type {LangKeyType} from './translation/type';

const defaultLocaleContextData = getDefaultLocaleContextData();

const LocaleContext = React.createContext<LocaleContextType>(defaultLocaleContextData);
const LocaleContextProvider = LocaleContext.Provider;

export const LocaleContextConsumer = LocaleContext.Consumer;

type PropsType = {|
    +children: Node,
|};

type StateType = {|
    +providedData: LocaleContextType,
|};

export class LocaleProvider extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {providedData: defaultLocaleContextData};
    }

    setName = (localeName: LocaleNameType) => {
        const {state} = this;
        const {providedData} = state;

        setLocaleName(localeName);

        this.setState({providedData: {...providedData, name: localeName}});
    };

    getLocalizedString = (stringKey: LangKeyType, valueMap?: LocaleContextValueMapType): string => {
        const {state} = this;
        const {providedData} = state;
        const {name} = providedData;

        return getLocalizedString(stringKey, name, valueMap);
    };

    getProviderValue(): LocaleContextType {
        const {state} = this;
        const {providedData} = state;
        const {name} = providedData;

        return {
            name,
            setName: this.setName,
            getLocalizedString: this.getLocalizedString,
        };
    }

    render(): Node {
        const {props} = this;
        const {children} = props;

        return <LocaleContextProvider value={this.getProviderValue()}>{children}</LocaleContextProvider>;
    }
}
