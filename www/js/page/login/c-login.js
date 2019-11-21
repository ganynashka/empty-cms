// @flow

/* global window */

import React, {Component, type Node} from 'react';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography/Typography';

import mainWrapperStyle from '../../component/main-wrapper/main-wrapper.scss';
import {FormGenerator} from '../../component/layout/form-generator/form-generator';
import type {FormGeneratorFormDataType} from '../../component/layout/form-generator/type';
import {isError} from '../../lib/is';
import {ButtonListWrapper} from '../../component/layout/button-list-wrapper/c-button-list-wrapper';
import {FormButton} from '../../component/layout/form-button/c-form-button';
import type {UserContextConsumerType} from '../../provider/user/user-context-type';
import type {SnackbarPortalContextType} from '../../component/layout/snackbar/snackbar-portal/c-snackbar-portal';
import {loginPasswordFormConfig} from '../register/c-register';
import {routePathMap} from '../../component/app/routes-path-map';

type PropsType = {
    +userContextData: UserContextConsumerType,
    +snackbarPortalContext: SnackbarPortalContextType,
};

type StateType = {};

// eslint-disable-next-line react/prefer-stateless-function
export class Login extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {};
    }

    handleFormSubmit = async (formData: FormGeneratorFormDataType) => {
        const {props} = this;
        const {login, password} = formData;
        const {snackbarPortalContext, userContextData} = props;
        const snackBarId = 'login-snack-bar-id-' + String(Date.now());
        const {showSnackbar} = snackbarPortalContext;

        const loginResult = await userContextData.login(String(login), String(password));

        if (isError(loginResult)) {
            await showSnackbar({children: loginResult.message, variant: 'error'}, snackBarId);
            return;
        }

        await showSnackbar({children: 'You login successfully!', variant: 'success'}, snackBarId);

        window.location.href = routePathMap.home.path;
    };

    renderFormFooter(): Node {
        return (
            <ButtonListWrapper direction="right">
                <FormButton type="submit">Login</FormButton>
            </ButtonListWrapper>
        );
    }

    handleFormError = async (errorList: Array<Error>, formData: FormGeneratorFormDataType) => {
        const {props} = this;
        const {snackbarPortalContext} = props;
        const snackBarId = 'login-snack-bar-id-' + String(Date.now());
        const {showSnackbar} = snackbarPortalContext;

        console.log('handleFormError', errorList);
        await showSnackbar({children: 'Fill all required fields properly!', variant: 'error'}, snackBarId);
    };

    render(): Node {
        return (
            <Paper className={mainWrapperStyle.paper_wrapper}>
                <Toolbar>
                    <Typography variant="h5">Login</Typography>
                </Toolbar>
                <FormGenerator
                    config={loginPasswordFormConfig}
                    footer={this.renderFormFooter()}
                    onError={this.handleFormError}
                    onSubmit={this.handleFormSubmit}
                />
            </Paper>
        );
    }
}
