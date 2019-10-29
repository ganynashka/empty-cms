// @flow

/* eslint consistent-this: ["error", "view"] */

import React, {Component, type Node} from 'react';
import {Link} from 'react-router-dom';

import {routeItemMap} from '../app/routes';

type PropsType = {};
type StateType = null;

export function Header(props: PropsType): Node {
    return (
        <nav>
            <Link to={routeItemMap.userList.path}>Users</Link>
            <br/>
            <Link to={routeItemMap.documentList.path}>Documents</Link>
        </nav>
    );
}
