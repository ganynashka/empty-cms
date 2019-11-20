// @flow

/* eslint consistent-this: ["error", "view"] */

import React, {Component, type Node} from 'react';

import {hasProperty, isFunction} from '../../../lib/is';
import {SnackbarPortalContextConsumer} from '../snackbar/snackbar-portal/c-snackbar-portal';
import type {SnackbarPortalContextType} from '../snackbar/snackbar-portal/c-snackbar-portal';

import {PopupPortalContextConsumer} from '../popup/popup-portal/c-popup-portal';

import type {PopupPortalContextType} from '../popup/popup-portal/c-popup-portal';

import fieldStyle from './field/field.style.scss';

import type {
    FieldDataType,
    FieldSetDataType,
    FormGeneratorConfigType,
    FormGeneratorFormDataType,
    InputComponentOnChangeType,
    InputValueType,
} from './type';

type PropsType = {|
    +config: FormGeneratorConfigType,
    +onSubmit: (formData: FormGeneratorFormDataType) => mixed,
    +onError: (errorList: Array<Error>, formData: FormGeneratorFormDataType) => mixed,
    +footer: Node,
|};

type StateType = {|
    +formData: FormGeneratorFormDataType,
    +formValidation: {
        +[key: string]: Array<Error>,
    },
|};

export class FormGenerator extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        const view = this;

        view.state = {
            formData: view.getDefaultFormData(),
            formValidation: {},
        };
    }

    getDefaultFormData(): FormGeneratorFormDataType {
        const view = this;
        const {props} = view;
        const {config} = props;
        const {fieldSetList} = config;
        const defaultFormData = {};

        fieldSetList.forEach((fieldSetData: FieldSetDataType) => {
            const {fieldList} = fieldSetData;

            fieldList.forEach((fieldData: FieldDataType) => {
                const {name, defaultValue} = fieldData;

                defaultFormData[name] = defaultValue;
            });
        });

        return defaultFormData;
    }

    createOnChangeFieldHandler(fieldData: FieldDataType): InputComponentOnChangeType {
        const view = this;

        return (value: InputValueType) => {
            const {state} = view;
            const {name, validate} = fieldData;
            const formData = {...state.formData, [name]: value};
            const fieldErrorList = validate(name, value, formData);

            if (fieldErrorList.length === 0) {
                view.setState({
                    formData,
                    formValidation: {...state.formValidation, [name]: []},
                });
                return;
            }

            view.setState({formData});
        };
    }

    createOnBlurFieldHandler(fieldData: FieldDataType): InputComponentOnChangeType {
        const view = this;

        return (value: InputValueType) => {
            const {name, validate} = fieldData;
            const {state} = view;
            const formData = {...state.formData, [name]: value};
            const fieldErrorList = validate(name, value, formData);
            const formValidation = {...state.formValidation, [name]: fieldErrorList};

            view.setState({formData, formValidation});
        };
    }

    renderField = (fieldData: FieldDataType): Node => {
        const view = this;
        const {isHidden} = fieldData;

        return isHidden === true ? view.renderFieldHidden(fieldData) : view.renderFieldVisible(fieldData);
    };

    renderFieldHidden(fieldData: FieldDataType): Node {
        const view = this;

        return (
            <div className={fieldStyle.form_input__hidden} key={fieldData.name}>
                {view.renderFieldVisible(fieldData)}
            </div>
        );
    }

    renderFieldVisible(fieldData: FieldDataType): Node {
        const view = this;
        const {state} = view;
        const {formValidation} = state;
        const {
            name,
            fieldComponent: FieldComponent,
            defaultValue,
            placeholder,
            labelText,
            content,
            accept,
            isMultiple,
            imagePathPrefix,
            uploadFile,
        } = fieldData;

        const onChangeFieldHandler = view.createOnChangeFieldHandler(fieldData);
        const onBlurFieldHandler = view.createOnBlurFieldHandler(fieldData);
        const errorList = hasProperty(formValidation, name) ? formValidation[name] : [];

        return (
            <SnackbarPortalContextConsumer key={name}>
                {(snackbarPortalContextData: SnackbarPortalContextType): Node => {
                    return (
                        <PopupPortalContextConsumer>
                            {(popupPortalContextData: PopupPortalContextType): Node => {
                                return (
                                    <FieldComponent
                                        accept={accept}
                                        content={content}
                                        defaultValue={defaultValue}
                                        errorList={errorList}
                                        imagePathPrefix={imagePathPrefix}
                                        isMultiple={isMultiple}
                                        labelText={labelText}
                                        name={name}
                                        onBlur={onBlurFieldHandler}
                                        onChange={onChangeFieldHandler}
                                        placeholder={placeholder}
                                        popupPortalContext={popupPortalContextData}
                                        snackbarPortalContext={snackbarPortalContextData}
                                        uploadFile={uploadFile}
                                    />
                                );
                            }}
                        </PopupPortalContextConsumer>
                    );
                }}
            </SnackbarPortalContextConsumer>
        );
    }

    renderFieldSet = (fieldSetData: FieldSetDataType): Node => {
        const view = this;
        const {name, fieldList, fieldSetWrapper} = fieldSetData;
        const {component: FieldSetWrapper, legend} = fieldSetWrapper;

        return (
            <FieldSetWrapper key={name} legend={legend}>
                {fieldList.map(view.renderField)}
            </FieldSetWrapper>
        );
    };

    renderFieldSetList = (fieldSetDataList: Array<FieldSetDataType>): Array<Node> => {
        const view = this;

        return fieldSetDataList.map(view.renderFieldSet);
    };

    validateFieldSetList(): Array<Error> {
        const view = this;
        const {props, state} = view;
        const {formData} = state;
        const formValidation = {};
        const {config} = props;
        const {fieldSetList} = config;

        const errorList: Array<Error> = [];

        fieldSetList.forEach((fieldSetData: FieldSetDataType) => {
            const {fieldList} = fieldSetData;

            fieldList.forEach((fieldData: FieldDataType) => {
                const {name, validate} = fieldData;
                const fieldErrorList = validate(name, formData[name], formData);

                formValidation[name] = fieldErrorList;

                errorList.push(...fieldErrorList);
            });
        });

        view.setState({formValidation});

        console.log('---> formData');
        console.log(formData);

        return errorList;
    }

    handleFormSubmit = (evt: SyntheticEvent<HTMLFormElement>) => {
        evt.preventDefault();

        const view = this;
        const {props, state} = view;
        const {onError, onSubmit} = props;
        const {formData} = state;

        const errorList = view.validateFieldSetList();

        if (errorList.length === 0) {
            onSubmit(formData);
            return;
        }

        console.log('Form has the Errors!');
        console.log(errorList);

        if (isFunction(onError)) {
            onError(errorList, formData);
        }
    };

    render(): Node {
        const view = this;
        const {props} = view;
        const {config, footer} = props;
        const {fieldSetList} = config;

        return (
            <form action="#" className={fieldStyle.form__generator} method="post" onSubmit={view.handleFormSubmit}>
                {view.renderFieldSetList(fieldSetList)}
                {footer}
            </form>
        );
    }
}
