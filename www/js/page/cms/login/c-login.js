// @flow

/* global window */

import React, {Component, type Node} from 'react';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography/Typography';

import mainWrapperStyle from '../../../component/main-wrapper/main-wrapper.scss';
import {FormGenerator} from '../../../component/layout/form-generator/form-generator';
import type {FormGeneratorFormDataType} from '../../../component/layout/form-generator/form-generator-type';
import {isError} from '../../../lib/is';
import {ButtonListWrapper} from '../../../component/layout/button-list-wrapper/c-button-list-wrapper';
import {FormButton} from '../../../component/layout/form-button/c-form-button';
import type {UserContextType} from '../../../provider/user/user-context-type';
import type {SnackbarContextType} from '../../../provider/snackbar/snackbar-context-type';
import {loginPasswordFormConfig} from '../register/c-register';
import {routePathMap} from '../../../component/app/routes-path-map';
import type {RouterHistoryType} from '../../../type/react-router-dom-v5-type-extract';
import {setMeta} from '../../../lib/meta';

type PropsType = {
    +history: RouterHistoryType,
    +userContextData: UserContextType,
    +snackbarContext: SnackbarContextType,
};

type StateType = {};

// eslint-disable-next-line react/prefer-stateless-function
export class Login extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        setMeta({
            title: '',
            // description: '',
        });
        console.log('---> Component Login did mount');
    }

    handleFormSubmit = async (formData: FormGeneratorFormDataType) => {
        const {props} = this;
        const {snackbarContext, userContextData, history} = props;
        const {login, password} = formData;
        const snackBarId = 'login-snack-bar-id-' + String(Date.now());
        const {showSnackbar} = snackbarContext;

        const loginResult = await userContextData.login(String(login), String(password));

        if (isError(loginResult)) {
            await showSnackbar({children: loginResult.message, variant: 'error'}, snackBarId);
            return;
        }

        history.push(routePathMap.cmsEnter.path);

        await showSnackbar({children: 'You login successfully!', variant: 'success'}, snackBarId);
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
        const {snackbarContext} = props;
        const snackBarId = 'login-snack-bar-id-' + String(Date.now());
        const {showSnackbar} = snackbarContext;

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
