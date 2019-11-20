// @flow

import type {Node} from 'react';

import type {SnackbarPortalContextType} from '../snackbar/snackbar-portal/c-snackbar-portal';
import type {PopupPortalContextType} from '../popup/popup-portal/c-popup-portal';

export type PrimitiveInputValueType = string | number | boolean | null | File;

export type InputValueType = PrimitiveInputValueType | Array<PrimitiveInputValueType>;

export type FormGeneratorFormDataType = {[key: string]: InputValueType};

export type InputComponentOnChangeType = (value: InputValueType) => mixed;

export type ValidateType = (name: string, value: InputValueType, formData: FormGeneratorFormDataType) => Array<Error>;

export type InputComponentPropsType = {|
    +name: string,
    +onChange: InputComponentOnChangeType,
    +onBlur: InputComponentOnChangeType,
    +errorList: Array<Error>,
    +defaultValue: InputValueType,
    +placeholder: Node,
    +labelText: Node,
    +content?: Node,
    +accept?: string,
    +isMultiple?: boolean,
    +imagePathPrefix?: string,
    +snackbarPortalContext: SnackbarPortalContextType,
    +popupPortalContext: PopupPortalContextType,
|};

export type FieldDataType = {|
    +name: string,
    // eslint-disable-next-line id-match
    +fieldComponent: React$ComponentType<InputComponentPropsType>,
    +validate: ValidateType,
    +defaultValue: InputValueType,
    +placeholder: Node,
    +labelText: Node,
    +content?: Node,
    +isHidden?: boolean,
    +accept?: string,
    +isMultiple?: boolean,
    +imagePathPrefix?: string,
|};

export type FieldSetWrapperDataType = {
    +children: Node,
    +legend: Node,
};

export type FieldSetDataType = {|
    +name: string,
    +fieldList: Array<FieldDataType>,
    +fieldSetWrapper: {|
        // eslint-disable-next-line id-match
        +component: React$ComponentType<FieldSetWrapperDataType>,
        +legend: Node,
    |},
|};

export type FormGeneratorConfigType = {|
    +fieldSetList: Array<FieldSetDataType>,
|};
