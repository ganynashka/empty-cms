// @flow

import React, {Component, type Node} from 'react';
import {Link} from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';

import {routeItemMap} from '../../app/routes';
import type {UserContextConsumerType} from '../../../provider/user/user-context-type';

import headerStyle from './header.scss';

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
                    You: {user.role}
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
                <Button component={Link} size="large" to={routeItemMap.cmsEnter.path} variant="contained">
                    Home
                </Button>
                &nbsp;|&nbsp;
                <Button component={Link} size="large" to={routeItemMap.userList.path} variant="contained">
                    User: list
                </Button>
                &nbsp;|&nbsp;
                <Button component={Link} size="large" to={routeItemMap.documentList.path} variant="contained">
                    Doc: list
                </Button>
                &nbsp;|&nbsp;
                <Button component={Link} size="large" to={routeItemMap.documentTree.path} variant="contained">
                    Doc: tree
                </Button>
                &nbsp;|&nbsp;
                <Button component={Link} size="large" to={routeItemMap.documentCreate.path} variant="contained">
                    Doc: create
                </Button>
                &nbsp;|&nbsp;
                <Button component={Link} size="large" to={routeItemMap.fileList.path} variant="contained">
                    File: List
                </Button>
                &nbsp;|&nbsp;
                <Button component={Link} size="large" to={routeItemMap.fileUpload.path} variant="contained">
                    File: Upload
                </Button>
            </>
        );
    }

    render(): Node {
        return (
            <AppBar className={headerStyle.header}>
                <link
                    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                    rel="stylesheet"
                />
                <Toolbar>
                    {this.renderLinkList()}
                    {this.renderLoginButton()}
                </Toolbar>
            </AppBar>
        );
    }
}
