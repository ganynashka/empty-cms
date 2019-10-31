// @flow

import React, {Component, type Node} from 'react';

import {FormGenerator} from '../../component/layout/form-generator/form-generator';
import type {FormGeneratorConfigType} from '../../component/layout/form-generator/type';
import {FieldSet} from '../../component/layout/form-generator/field/field-set/field-set';
import {InputText} from '../../component/layout/form-generator/field/input-text/c-input-text';
import {getIsRequired} from '../../component/layout/form-generator/validate/validate';
import {ButtonListWrapper} from '../../component/layout/button-list-wrapper/c-button-list-wrapper';
import {FormButton} from '../../component/layout/form-button/c-form-button';

type PropsType = {};
type StateType = null;

const formConfig: FormGeneratorConfigType = {
    fieldSetList: [
        {
            name: 'document create/edit',
            fieldList: [
                {
                    name: 'slug',
                    fieldComponent: InputText,
                    validate: getIsRequired,
                    defaultValue: '',
                    placeholder: 'Slug/ID of document',
                    labelText: 'Slug',
                    content: null,
                },
            ],
            fieldSetWrapper: {
                component: FieldSet,
                legend: null,
            },
        },
    ],
};

export class DocumentCreate extends Component<PropsType, StateType> {
    handleFormSubmit = (formData: {}) => {
        console.log(formData);
    };

    renderFormFooter(): Node {
        return (
            <ButtonListWrapper direction="right">
                <FormButton type="submit">Create</FormButton>
            </ButtonListWrapper>
        );
    }

    handleFormError = (errorList: Array<Error>) => {
        console.log('handleFormError', errorList);
    };

    render(): Node {
        return (
            <FormGenerator
                config={formConfig}
                footer={this.renderFormFooter()}
                onError={this.handleFormError}
                onSubmit={this.handleFormSubmit}
            />
        );
    }
}
