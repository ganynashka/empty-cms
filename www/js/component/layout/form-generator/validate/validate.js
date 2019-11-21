// @flow

import type {FormGeneratorFormDataType, FromGeneratorInputValueType} from '../form-generator-type';
import {isBoolean, isNull, isNumber, isString} from '../../../../lib/is';

export function noValidate(
    name: string,
    value: FromGeneratorInputValueType,
    formData: FormGeneratorFormDataType
): Array<Error> {
    return [];
}

// eslint-disable-next-line complexity
export function getIsRequired(
    name: string,
    value: FromGeneratorInputValueType,
    formData: FormGeneratorFormDataType
): Array<Error> {
    const errorMessage = 'Required field!';
    const requiredErrorList = [new Error(errorMessage)];

    if (isString(value)) {
        return value === '' ? requiredErrorList : [];
    }

    if (isNumber(value)) {
        return value <= 0 || Number.isNaN(value) ? requiredErrorList : [];
    }

    if (isBoolean(value)) {
        return value === false ? requiredErrorList : [];
    }

    if (isNull(value)) {
        return requiredErrorList;
    }

    if (Array.isArray(value)) {
        return value.length === 0 ? requiredErrorList : [];
    }

    console.log(value);
    throw new Error('Type has no validation! Add validation here!');
}
