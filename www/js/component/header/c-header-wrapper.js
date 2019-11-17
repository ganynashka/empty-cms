// @flow

import React, {Component, type Node} from 'react';

import {UserContextConsumer} from '../user/c-user-context';
import type {UserContextConsumerType} from '../user/type-user-context';

import {Header} from './c-header';

export function HeaderWrapper(): Node {
    return (
        <UserContextConsumer>
            {(userContextData: UserContextConsumerType): Node => <Header userContextData={userContextData}/>}
        </UserContextConsumer>
    );
}
