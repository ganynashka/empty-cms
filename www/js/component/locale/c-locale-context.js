// @flow

/* global localStorage */

import React, {Component, type Node} from 'react';

import type {LocaleNameType} from './const';
import type {ValueMapType} from './locale-helper';
import {getLocaleName, getLocalizedString, setLocaleName} from './locale-helper';
import type {LangKeyType} from './translation/type';

export type LocaleContextType = {|
    +name: LocaleNameType,
    +setName: (localeName: LocaleNameType) => mixed,
    +getLocalizedString: (stringKey: LangKeyType, valueMap?: ValueMapType) => string,
|};

const defaultContextData = {
    name: getLocaleName(),
    setName: (localeName: LocaleNameType): null => null,
    getLocalizedString: (stringKey: LangKeyType, valueMap?: ValueMapType): string => stringKey,
};

const LocaleContext = React.createContext<LocaleContextType>(defaultContextData);
const LocaleContextProvider = LocaleContext.Provider;

export const {Consumer: LocaleContextConsumer} = LocaleContext;

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

        this.setState({providedData: {...providedData, name: localeName}});
    };

    getLocalizedString = (stringKey: LangKeyType, valueMap?: ValueMapType): string => {
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
