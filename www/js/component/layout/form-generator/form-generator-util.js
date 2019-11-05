// @flow

import {hasProperty} from '../../../lib/is';

import type {FieldDataType} from './type';

type FormGeneratorImportedFieldDataType = {[key: string]: $Shape<FieldDataType>};

export function extendFieldList(
    fieldList: Array<FieldDataType>,
    importedFieldData: FormGeneratorImportedFieldDataType
): Array<FieldDataType> {
    return fieldList.map((fieldItem: FieldDataType): FieldDataType => {
        const {name} = fieldItem;
        const importedItem = hasProperty(importedFieldData, name) ? importedFieldData[name] : null;

        if (importedItem === null) {
            return {...fieldItem};
        }

        return {...fieldItem, ...importedItem};
    });
}
