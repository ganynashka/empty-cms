// @flow

import React, {type Node} from 'react';

import {UserContextConsumer} from '../../provider/user/c-user-context';
import type {UserContextConsumerType} from '../../provider/user/user-context-type';

import {Header} from './c-header';

export function HeaderWrapper(): Node {
    return (
        <UserContextConsumer>
            {(userContextData: UserContextConsumerType): Node => <Header userContextData={userContextData}/>}
        </UserContextConsumer>
    );
}
