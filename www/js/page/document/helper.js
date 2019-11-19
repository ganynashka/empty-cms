// @flow

import React from 'react';

import type {FormGeneratorConfigType, FormGeneratorFormDataType} from '../../component/layout/form-generator/type';
import {InputText} from '../../component/layout/form-generator/field/input-text/c-input-text';
import {getIsRequired, noValidate} from '../../component/layout/form-generator/validate/validate';
import {InputSelect} from '../../component/layout/form-generator/field/input-select/c-input-select';
import {InputMarkdown} from '../../component/layout/form-generator/field/input-markdown/c-input-markdown';
import {InputIntNumber} from '../../component/layout/form-generator/field/input-int-number/c-input-int-number';
import {InputCheckbox} from '../../component/layout/form-generator/field/input-checkbox/c-input-checkbox';
import {FieldSet} from '../../component/layout/form-generator/field/field-set/field-set';
import {typeConverter} from '../../lib/type';
import type {MongoDocumentType, MongoDocumentTypeType} from '../../../../server/src/db/type';
import {mongoDocumentTypeMap} from '../../../../server/src/db/type';
import {getSlug, stringToUniqArray} from '../../lib/string';
import {InputUploadImage} from '../../component/layout/form-generator/field/input-upload-image/c-input-upload-image';

export type FormDataMongoDocumentType = {
    +slug: string,
    +titleImage: string | Array<File>,
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

export function formDataToMongoDocument(formData: FormGeneratorFormDataType): MongoDocumentType {
    const documentFormData: FormDataMongoDocumentType = typeConverter<FormDataMongoDocumentType>(formData);

    const subDocumentList = stringToUniqArray(documentFormData.subDocumentList, ',');
    const slug = getSlug(documentFormData.title);

    if (subDocumentList.includes(slug)) {
        subDocumentList.splice(subDocumentList.indexOf(slug), 1);
    }

    return {
        slug,
        titleImage: '',
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
                        validate: noValidate,
                        defaultValue: '',
                        placeholder: 'the-slug-or-id-of-document',
                        labelText: 'Slug',
                        isHidden: true,
                    },
                    {
                        name: 'titleImage',
                        fieldComponent: InputUploadImage,
                        validate: noValidate,
                        defaultValue: null,
                        placeholder: 'title-image',
                        labelText: 'Title image',
                        accept: 'image/png, image/jpg, image/jpeg',
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
                    },
                    {
                        name: 'createdDate',
                        fieldComponent: InputIntNumber,
                        validate: noValidate,
                        defaultValue: 0,
                        placeholder: 'Created Date',
                        labelText: 'Created Date',
                        isHidden: true,
                    },
                    {
                        name: 'updatedDate',
                        fieldComponent: InputIntNumber,
                        validate: noValidate,
                        defaultValue: 0,
                        placeholder: 'Updated Date',
                        labelText: 'Updated Date',
                        isHidden: true,
                    },
                    {
                        name: 'tagList',
                        fieldComponent: InputText,
                        validate: noValidate,
                        defaultValue: '',
                        placeholder: 'art, picture, color',
                        labelText: 'Tag list',
                    },
                    {
                        name: 'isActive',
                        fieldComponent: InputCheckbox,
                        validate: noValidate,
                        defaultValue: true,
                        placeholder: '',
                        labelText: 'Is active',
                    },
                    {
                        name: 'subDocumentList',
                        fieldComponent: InputText,
                        validate: noValidate,
                        defaultValue: '',
                        placeholder: 'doc-1, doc-2, the-article',
                        labelText: 'Sub-document list',
                    },
                    {
                        name: 'rating',
                        fieldComponent: InputIntNumber,
                        validate: noValidate,
                        defaultValue: 0,
                        placeholder: 'rating',
                        labelText: 'Rating',
                        isHidden: true,
                    },
                    {
                        name: 'content',
                        fieldComponent: InputMarkdown,
                        validate: noValidate,
                        defaultValue: '',
                        placeholder: 'Content',
                        labelText: 'Content',
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
