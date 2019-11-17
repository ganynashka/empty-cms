// @flow

import React, {Component, type Node} from 'react';
import {Link} from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';

import {routeItemMap} from '../app/routes';
import type {UserContextConsumerType} from '../user/type-user-context';

import headerStyle from './header.style.scss';

type PropsType = {
    +userContextData: UserContextConsumerType,
};
type StateType = null;

export class Header extends Component<PropsType, StateType> {
    renderLoginButton(): Node {
        const {props} = this;
        const {userContextData} = props;
        const {user} = userContextData;

        if (user.login === '') {
            return (
                <>
                    You are NOT login -&gt;&nbsp;
                    <Button component={Link} size="large" to={routeItemMap.login.path} variant="contained">
                        Login
                    </Button>
                    &nbsp;OR&nbsp;
                    <Button component={Link} size="large" to={routeItemMap.register.path} variant="contained">
                        Register
                    </Button>
                </>
            );
        }

        return (
            <>
                &nbsp;|&nbsp;
                <Button size="large" variant="contained">
                    You are logged as: {user.role}
                </Button>
            </>
        );
    }

    renderLinkList(): Node {
        const {props} = this;
        const {userContextData} = props;
        const {user} = userContextData;

        if (user.login === '') {
            return null;
        }

        return (
            <>
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
                <Button component={Link} size="large" to={routeItemMap.documentTree.path} variant="contained">
                    Document: tree
                </Button>
                &nbsp;|&nbsp;
                <Button component={Link} size="large" to={routeItemMap.documentCreate.path} variant="contained">
                    Document: create
                </Button>
                &nbsp;|&nbsp;
                <Button component={Link} size="large" to={routeItemMap.imageList.path} variant="contained">
                    Image: List
                </Button>
                &nbsp;|&nbsp;
                <Button component={Link} size="large" to={routeItemMap.imageUpload.path} variant="contained">
                    Image: Upload
                </Button>
            </>
        );
    }

    render(): Node {
        return (
            <AppBar className={headerStyle.header}>
                <Toolbar>
                    {this.renderLinkList()}
                    {this.renderLoginButton()}
                </Toolbar>
            </AppBar>
        );
    }
}
