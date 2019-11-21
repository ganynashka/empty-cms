// @flow

/* global window */

import React, {Component, type Node} from 'react';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography/Typography';

import mainWrapperStyle from '../../component/main-wrapper/main-wrapper.scss';
import {FormGenerator} from '../../component/layout/form-generator/form-generator';
import type {FormGeneratorConfigType, FormGeneratorFormDataType} from '../../component/layout/form-generator/type';
import {isError} from '../../lib/is';
import {ButtonListWrapper} from '../../component/layout/button-list-wrapper/c-button-list-wrapper';
import {FormButton} from '../../component/layout/form-button/c-form-button';
import type {UserContextConsumerType} from '../../provider/user/user-context-type';
import type {SnackbarContextType} from '../../provider/snackbar/snackbar-context-type';
import {getIsRequired} from '../../component/layout/form-generator/validate/validate';
import {FieldSet} from '../../component/layout/form-generator/field/field-set/field-set';
import {InputText} from '../../component/layout/form-generator/field/input-text/c-input-text';
import {InputPassword} from '../../component/layout/form-generator/field/input-password/c-input-text';
import {routePathMap} from '../../component/app/routes-path-map';

export const loginPasswordFormConfig: FormGeneratorConfigType = {
    fieldSetList: [
        {
            name: 'login / password',
            fieldList: [
                {
                    name: 'login',
                    fieldComponent: InputText,
                    validate: getIsRequired,
                    defaultValue: '',
                    placeholder: 'Your nick name...',
                    labelText: 'Login',
                    isHidden: false,
                },
                {
                    name: 'password',
                    fieldComponent: InputPassword,
                    validate: getIsRequired,
                    defaultValue: '',
                    placeholder: 'Your password...',
                    labelText: 'Password',
                    isHidden: false,
                },
            ],
            fieldSetWrapper: {
                component: FieldSet,
                legend: null,
            },
        },
    ],
};

type PropsType = {
    +userContextData: UserContextConsumerType,
    +snackbarPortalContext: SnackbarContextType,
};

type StateType = {};

// eslint-disable-next-line react/prefer-stateless-function
export class Register extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {};
    }

    handleFormSubmit = async (formData: FormGeneratorFormDataType) => {
        const {props} = this;
        const {login, password} = formData;
        const {snackbarPortalContext, userContextData} = props;
        const snackBarId = 'register-snack-bar-id-' + String(Date.now());
        const {showSnackbar} = snackbarPortalContext;

        const registerResult = await userContextData.register(String(login), String(password));

        if (isError(registerResult)) {
            await showSnackbar({children: registerResult.message, variant: 'error'}, snackBarId);
            return;
        }

        if (registerResult.isSuccessful !== true) {
            await showSnackbar({children: registerResult.errorList.join(','), variant: 'error'}, snackBarId);
            return;
        }

        const loginResult = await userContextData.login(String(login), String(password));

        if (isError(loginResult)) {
            await showSnackbar({children: loginResult.message, variant: 'error'}, snackBarId);
            return;
        }

        await showSnackbar({children: 'You register successfully!', variant: 'success'}, snackBarId);

        window.location.href = routePathMap.home.path;
    };

    renderFormFooter(): Node {
        return (
            <ButtonListWrapper direction="right">
                <FormButton type="submit">Register</FormButton>
            </ButtonListWrapper>
        );
    }

    handleFormError = async (errorList: Array<Error>, formData: FormGeneratorFormDataType) => {
        const {props} = this;
        const {snackbarPortalContext} = props;
        const snackBarId = 'register-snack-bar-id-' + String(Date.now());
        const {showSnackbar} = snackbarPortalContext;

        console.log('handleFormError', errorList);
        await showSnackbar({children: 'Fill all required fields properly!', variant: 'error'}, snackBarId);
    };

    render(): Node {
        return (
            <Paper className={mainWrapperStyle.paper_wrapper}>
                <Toolbar>
                    <Typography variant="h5">Register</Typography>
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
