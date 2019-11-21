// @flow

/* global window */

import React, {Component, type Node} from 'react';

import {isError} from '../../lib/is';
import type {MainServerApiResponseType} from '../../type/response';
import type {MongoUserFrontType} from '../../../../server/src/database/database-type';

import type {UserContextConsumerType} from './user-context-type';
import {getCurrentUser, login, register} from './user-context-api';
import {defaultUserContextData} from './user-context-const';

const userContext = React.createContext<UserContextConsumerType>(defaultUserContextData);
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
            providedData: defaultUserContextData,
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
        const {state} = this;
        const {providedData} = state;
        const loginResult = await login(userLogin, userPassword);

        if (isError(loginResult)) {
            return loginResult;
        }

        this.setState({providedData: {...providedData, user: loginResult}});

        return loginResult;
    };

    register = async (userLogin: string, userPassword: string): Promise<MainServerApiResponseType | Error> => {
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
