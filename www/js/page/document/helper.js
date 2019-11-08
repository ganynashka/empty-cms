// @flow

import React from 'react';

import type {FormGeneratorConfigType} from '../../component/layout/form-generator/type';
import {InputText} from '../../component/layout/form-generator/field/input-text/c-input-text';
import {getIsRequired, noValidate} from '../../component/layout/form-generator/validate/validate';
import {InputSelect} from '../../component/layout/form-generator/field/input-select/c-input-select';
import {InputTextArea} from '../../component/layout/form-generator/field/input-text-area/c-input-text-area';
import {InputIntNumber} from '../../component/layout/form-generator/field/input-int-number/c-input-int-number';
import {FieldSet} from '../../component/layout/form-generator/field/field-set/field-set';
import {typeConverter} from '../../lib/type';
import type {MongoDocumentType, MongoDocumentTypeType} from '../../../../server/src/db/type';
import {mongoDocumentTypeMap} from '../../../../server/src/db/type';
import {getSlug, stringToUniqArray} from '../../component/layout/form-generator/field/input-text/input-text-helper';

export type FormDataMongoDocumentType = {
    +slug: string,
    +type: MongoDocumentTypeType,
    +title: string,
    +content: string,
    // +createdDate: number,
    // +updatedDate: number,
    +subDocumentList: string, // list of slug
    +tagList: string,
    +rating: number,
    +isActive: boolean,
};

export function formDataToMongoDocument(formData: {}): MongoDocumentType {
    const documentFormData: FormDataMongoDocumentType = typeConverter<FormDataMongoDocumentType>(formData);

    const subDocumentList = stringToUniqArray(documentFormData.subDocumentList, ',');
    const slug = getSlug(documentFormData.slug);

    if (subDocumentList.includes(slug)) {
        subDocumentList.splice(subDocumentList.indexOf(slug), 1);
    }

    return {
        slug,
        type: documentFormData.type,
        title: documentFormData.title,
        content: documentFormData.content,
        createdDate: 0,
        updatedDate: 0,
        rating: documentFormData.rating,
        tagList: stringToUniqArray(documentFormData.tagList, ','),
        subDocumentList,
        isActive: documentFormData.isActive,
    };
}

export function getDocumentFormConfig(): FormGeneratorConfigType {
    return {
        fieldSetList: [
            {
                name: 'document create/edit',
                fieldList: [
                    {
                        name: 'slug',
                        fieldComponent: InputText,
                        validate: getIsRequired,
                        defaultValue: '',
                        placeholder: 'the-slug-or-id-of-document',
                        labelText: 'Slug',
                        content: null,
                    },
                    {
                        name: 'type',
                        fieldComponent: InputSelect,
                        validate: getIsRequired,
                        defaultValue: mongoDocumentTypeMap.article,
                        placeholder: 'Type: article or container',
                        labelText: 'Type',
                        content: [
                            <option key={mongoDocumentTypeMap.article} value={mongoDocumentTypeMap.article}>
                                {mongoDocumentTypeMap.article}
                            </option>,
                            <option key={mongoDocumentTypeMap.container} value={mongoDocumentTypeMap.container}>
                                {mongoDocumentTypeMap.container}
                            </option>,
                        ],
                    },
                    {
                        name: 'title',
                        fieldComponent: InputText,
                        validate: getIsRequired,
                        defaultValue: '',
                        placeholder: 'Title',
                        labelText: 'Title',
                        content: null,
                    },
                    {
                        name: 'content',
                        fieldComponent: InputTextArea,
                        validate: getIsRequired,
                        defaultValue: '',
                        placeholder: 'Content',
                        labelText: 'Content',
                        content: null,
                    },
                    {
                        name: 'createdDate',
                        fieldComponent: InputIntNumber,
                        validate: noValidate,
                        defaultValue: 0,
                        placeholder: 'Created Date',
                        labelText: 'Created Date',
                        content: null,
                        isHidden: true,
                    },
                    {
                        name: 'updatedDate',
                        fieldComponent: InputIntNumber,
                        validate: noValidate,
                        defaultValue: 0,
                        placeholder: 'Updated Date',
                        labelText: 'Updated Date',
                        content: null,
                        isHidden: true,
                    },
                    {
                        name: 'tagList',
                        fieldComponent: InputText,
                        validate: noValidate,
                        defaultValue: '',
                        placeholder: 'art, picture, color',
                        labelText: 'Tag list',
                        content: null,
                    },
                    {
                        name: 'subDocumentList',
                        fieldComponent: InputText,
                        validate: noValidate,
                        defaultValue: '',
                        placeholder: 'doc-1, doc-2, the-article',
                        labelText: 'Sub-document list',
                        content: null,
                    },
                    {
                        name: 'rating',
                        fieldComponent: InputIntNumber,
                        validate: noValidate,
                        defaultValue: 0,
                        placeholder: 'rating',
                        labelText: 'Rating',
                        content: null,
                        isHidden: true,
                    },
                ],
                fieldSetWrapper: {
                    component: FieldSet,
                    legend: null,
                },
            },
        ],
    };
}
