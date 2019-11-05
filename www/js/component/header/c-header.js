// @flow

import React, {type Node} from 'react';
import {Link} from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';

import {routeItemMap} from '../app/routes';

import headerStyle from './header.style.scss';

type PropsType = {};

export function Header(props: PropsType): Node {
    return (
        <AppBar className={headerStyle.header}>
            <Toolbar>
                <Button component={Link} size="large" to={routeItemMap.home.path} variant="contained">
                    Home
                </Button>
                &nbsp;|&nbsp;
                <Button component={Link} size="large" to={routeItemMap.userList.path} variant="contained">
                    User: list
                </Button>
                &nbsp;|&nbsp;
                <Button component={Link} size="large" to={routeItemMap.documentList.path} variant="contained">
                    Document: list
                </Button>
                &nbsp;|&nbsp;
                <Button component={Link} size="large" to={routeItemMap.documentCreate.path} variant="contained">
                    Document: create
                </Button>
            </Toolbar>
        </AppBar>
    );
}
