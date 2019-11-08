// @flow

import React, {type Node} from 'react';

import type {FieldSetWrapperDataType} from '../../type';

type PropsType = FieldSetWrapperDataType;

export function FieldSet(props: PropsType): Node {
    const {children, legend} = props;

    return (
        <fieldset>
            {legend}
            {children}
        </fieldset>
    );
}
