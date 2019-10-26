// @flow

import type {Node} from 'react';
import React, {Component} from 'react';

import type {RouterStaticContextType} from '../../../../server/src/c-initial-data-context';

type PropsType = {
    +staticContext?: RouterStaticContextType,
};

type StateType = null;

// eslint-disable-next-line react/prefer-stateless-function
export class PageNotFound extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        Object.assign(props.staticContext || {}, {is404: true});
    }

    render(): Node {
        return <h1>Page Not Found, Sorry :(</h1>;
    }
}
