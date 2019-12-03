// @flow

import React, {type Node} from 'react';

import {UserContextConsumer} from '../../../provider/user/c-user-context';
import type {UserContextConsumerType} from '../../../provider/user/user-context-type';
import {LoadComponent} from '../../../lib/c-load-component';
import {canNotLoadComponent} from '../../../lib/can-not-load-component';
import type {LocationType} from '../../../type/react-router-dom-v5-type-extract';
import {isCMS} from '../../../lib/url';

type PropsType = {
    +location: LocationType,
};

export function CMSHeaderWrapper(props: PropsType): Node {
    const {location} = props;

    if (!isCMS(location)) {
        return null;
    }

    function loadHeader(): Promise<Node> {
        return (
            import(/* webpackChunkName: 'async-load-header' */ './c-header')
                // eslint-disable-next-line id-match
                .then((data: {Header: React$ComponentType<*>}): Node => {
                    const {Header} = data;

                    return (
                        <UserContextConsumer>
                            {(userContextData: UserContextConsumerType): Node =>
                                <Header userContextData={userContextData}/>}
                        </UserContextConsumer>
                    );
                })
                .catch(canNotLoadComponent)
        );
    }

    return <LoadComponent load={loadHeader}/>;
}
