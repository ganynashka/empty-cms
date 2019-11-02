// @flow

/* eslint consistent-this: ["error", "view"] */

import React, {Component, type Node} from 'react';
import {Link} from 'react-router-dom';
import {AppBar, Toolbar, IconButton, Typography, Button} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import {routeItemMap} from '../app/routes';

type PropsType = {};
type StateType = null;

export function Header(props: PropsType): Node {
    return (
        <AppBar position="static">
            <Toolbar>
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
