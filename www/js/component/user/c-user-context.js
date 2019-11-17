// @flow

/* global window */

import React, {Component, type Node} from 'react';

import {isError} from '../../lib/is';
import type {MongoUserFrontType} from '../../../../server/src/db/type';

import type {UserContextConsumerType} from './type-user-context';
import {getCurrentUser, login, register} from './api-user-context';
import {defaultUserFrontState} from './const-user-context';

const defaultContextData = {
    user: defaultUserFrontState,
    login: (userLogin: string, userPassword: string): Promise<MongoUserFrontType | Error> =>
        Promise.resolve(defaultUserFrontState),
    register: (userLogin: string, userPassword: string): Promise<MongoUserFrontType | Error> =>
        Promise.resolve(defaultUserFrontState),
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

    login = async (userLogin: string, userPassword: string): Promise<MongoUserFrontType | Error> => {
        const result = await login(userLogin, userPassword);

        if (isError(result)) {
            return result;
        }

        console.log(result);

        return result;
    };

    register = async (userLogin: string, userPassword: string): Promise<MongoUserFrontType | Error> => {
        const result = await register(userLogin, userPassword);

        if (isError(result)) {
            return result;
        }

        console.log(result);

        return result;
    };

    getProviderValue(): UserContextConsumerType {
        const {state} = this;
        const {providedData} = state;
        const {user} = providedData;

        return {
            user,
            login: this.login,
            register: this.register,
        };
    }

    render(): Node {
        const {props} = this;
        const {children} = props;

        return <UserContextProvider value={this.getProviderValue()}>{children}</UserContextProvider>;
    }
}
