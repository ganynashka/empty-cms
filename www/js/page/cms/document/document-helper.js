// @flow

import React from 'react';

// eslint-disable-next-line max-len
import {InputUploadFileList} from '../../../component/layout/form-generator/field/input-upload-file-list/c-input-upload-file-list';
import type {
    FormGeneratorConfigType,
    FormGeneratorFormDataType,
    FromGeneratorInputValueType,
} from '../../../component/layout/form-generator/form-generator-type';
import {InputText} from '../../../component/layout/form-generator/field/input-text/c-input-text';
import {getIsRequired, isValidHTml, noValidate} from '../../../component/layout/form-generator/validate/validate';
import {InputSelect} from '../../../component/layout/form-generator/field/input-select/c-input-select';
import {InputMarkdown} from '../../../component/layout/form-generator/field/input-markdown/c-input-markdown';
import {InputIntNumber} from '../../../component/layout/form-generator/field/input-int-number/c-input-int-number';
import {InputCheckbox} from '../../../component/layout/form-generator/field/input-checkbox/c-input-checkbox';
import {FieldSet} from '../../../component/layout/form-generator/field/field-set/field-set';
import {typeConverter} from '../../../lib/type';
import type {MongoDocumentType} from '../../../../../server/src/database/database-type';
import {mongoDocumentTypeMap} from '../../../../../server/src/database/database-type';
import {extractUniqueArrayString, getSlug, stringToUniqArray} from '../../../lib/string';
import {InputUploadFile} from '../../../component/layout/form-generator/field/input-upload-file/c-input-upload-file';
import {isError, isFile, isNull, isString} from '../../../lib/is';
import {uploadFile, uploadFileList} from '../file/file-api';
import {promiseCatch} from '../../../lib/promise';
import {fileApiConst} from '../../../../../server/src/api/part/file-api-const';
import {InputCode} from '../../../component/layout/form-generator/field/input-code/c-input-code';
import {InputTextArea} from '../../../component/layout/form-generator/field/input-text-area/c-input-text-area';

import type {FormDataMongoDocumentType} from './document-type';

function extractImage(inputValue: FromGeneratorInputValueType): Promise<Error | string> {
    if (isString(inputValue)) {
        return Promise.resolve(inputValue);
    }

    if (isNull(inputValue)) {
        return Promise.resolve('');
    }

    if (!isFile(inputValue)) {
        return Promise.resolve(new Error('invalid input data, should be: String | File | Null'));
    }

    return uploadFileList([inputValue])
        .then((uploadResult: Error | Array<string>): Error | string => {
            if (isError(uploadResult)) {
                return uploadResult;
            }

            if (uploadResult.length === 0) {
                return new Error('Can not upload image!');
            }

            return uploadResult[0];
        })
        .catch(promiseCatch);
}

export async function formDataToMongoDocument(formData: FormGeneratorFormDataType): Promise<Error | MongoDocumentType> {
    const documentFormData: FormDataMongoDocumentType = typeConverter<FormDataMongoDocumentType>(formData);

    const titleImage = await extractImage(documentFormData.titleImage);

    if (isError(titleImage)) {
        console.error('can not get title image');
        return titleImage;
    }

    const subDocumentSlugList = stringToUniqArray(documentFormData.subDocumentSlugList, ',');
    const slug = getSlug(documentFormData.title);

    if (subDocumentSlugList.includes(slug)) {
        subDocumentSlugList.splice(subDocumentSlugList.indexOf(slug), 1);
    }

    return {
        slug,
        titleImage: String(documentFormData.titleImage || ''),
        type: documentFormData.type,
        title: documentFormData.title,
        meta: documentFormData.meta,
        // description: documentFormData.description,
        shortDescription: documentFormData.shortDescription,
        content: documentFormData.content,
        createdDate: 0,
        updatedDate: 0,
        rating: documentFormData.rating,
        tagList: stringToUniqArray(documentFormData.tagList, ','),
        subDocumentSlugList,
        isActive: documentFormData.isActive,
        imageList: extractUniqueArrayString(documentFormData.imageList),
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
                        fieldComponent: InputUploadFile,
                        validate: noValidate,
                        defaultValue: null,
                        placeholder: 'title-image',
                        labelText: 'Title image',
                        accept: 'image/png, image/jpg, image/jpeg',
                        uploadFile,
                        filePathPrefix: fileApiConst.pathToUploadFiles,
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
                        name: 'meta',
                        fieldComponent: InputCode,
                        validate: isValidHTml,
                        defaultValue: '',
                        placeholder: 'Some meta tags',
                        labelText: 'Meta (SEO)',
                    },
                    {
                        name: 'shortDescription',
                        fieldComponent: InputMarkdown,
                        validate: noValidate,
                        defaultValue: '',
                        placeholder: 'Short description...',
                        labelText: 'Short description',
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
                        name: 'subDocumentSlugList',
                        fieldComponent: InputText,
                        validate: noValidate,
                        defaultValue: '',
                        placeholder: 'doc-1, doc-2, the-article',
                        labelText: 'Sub-document slug list',
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
                        name: 'imageList',
                        fieldComponent: InputUploadFileList,
                        validate: noValidate,
                        defaultValue: new Array<string>(0),
                        placeholder: 'File List',
                        labelText: 'File List',
                        accept: '*',
                        uploadFile,
                        filePathPrefix: fileApiConst.pathToUploadFiles,
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
