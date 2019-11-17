// @flow

/* global window */

import React, {Component, type Node} from 'react';

import {isError} from '../../lib/is';

import type {UserContextConsumerType} from './type-user-context';
import {getCurrentUser} from './api-user-context';
import {defaultUserFrontState} from './const-user-context';

const defaultContextData = {
    user: defaultUserFrontState,
};

const userContext = React.createContext<UserContextConsumerType>(defaultContextData);

const UserContextProvider = userContext.Provider;

export const UserContextConsumer = userContext.Consumer;

type PropsType = {|
    +children: Node,
|};

type StateType = {|
    +providedData: UserContextConsumerType,
|};

export class UserProvider extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            providedData: defaultContextData,
        };
    }

    async componentDidMount() {
        this.fetchCurrentUser();
    }

    async fetchCurrentUser() {
        const user = await getCurrentUser();
        const {state} = this;
        const {providedData} = state;

        if (isError(user)) {
            console.error('Can not get user');
            return;
        }

        if (user.login === '') {
            console.error('You are not login.');
            return;
        }

        this.setState({providedData: {...providedData, user}});
    }

    getProviderValue(): UserContextConsumerType {
        const {state} = this;

        return {
            ...state.providedData,
        };
    }

    render(): Node {
        const {props} = this;
        const {children} = props;

        return <UserContextProvider value={this.getProviderValue()}>{children}</UserContextProvider>;
    }
}
