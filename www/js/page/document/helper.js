// @flow

import React from 'react';

// eslint-disable-next-line max-len
import {InputUploadImageList} from '../../component/layout/form-generator/field/input-upload-image-list/c-input-upload-image-list';
import type {
    FormGeneratorConfigType,
    FormGeneratorFormDataType,
    FromGeneratorInputValueType,
} from '../../component/layout/form-generator/type';
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
import {isError, isFile, isNull, isString} from '../../lib/is';
import {uploadImage, uploadImageList} from '../image/image-api';
import {promiseCatch} from '../../lib/promise';
import {fileApiConst} from '../../../../server/src/api/file-const';

export type FormDataMongoDocumentType = {
    +slug: string,
    +titleImage: string | File | null,
    +type: MongoDocumentTypeType,
    +title: string,
    +content: string,
    // +createdDate: number,
    // +updatedDate: number,
    +subDocumentList: string, // list of slug
    +tagList: string,
    +rating: number,
    +isActive: boolean,
    +imageList: Array<string>,
};

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

    return uploadImageList([inputValue])
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

export function extractUniqueArrayString(inputValue: mixed): Array<string> {
    const arrayString: Array<string> = [];

    if (!Array.isArray(inputValue)) {
        return arrayString;
    }

    inputValue.forEach((value: mixed) => {
        if (isString(value) && !arrayString.includes(value)) {
            arrayString.push(value);
        }
    });

    return arrayString;
}

export async function formDataToMongoDocument(formData: FormGeneratorFormDataType): Promise<Error | MongoDocumentType> {
    const documentFormData: FormDataMongoDocumentType = typeConverter<FormDataMongoDocumentType>(formData);

    const titleImage = await extractImage(documentFormData.titleImage);

    if (isError(titleImage)) {
        console.error('can not get title image');
        return titleImage;
    }

    const subDocumentList = stringToUniqArray(documentFormData.subDocumentList, ',');
    const slug = getSlug(documentFormData.title);

    if (subDocumentList.includes(slug)) {
        subDocumentList.splice(subDocumentList.indexOf(slug), 1);
    }

    return {
        slug,
        titleImage: String(documentFormData.titleImage || ''),
        type: documentFormData.type,
        title: documentFormData.title,
        content: documentFormData.content,
        createdDate: 0,
        updatedDate: 0,
        rating: documentFormData.rating,
        tagList: stringToUniqArray(documentFormData.tagList, ','),
        subDocumentList,
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
                        fieldComponent: InputUploadImage,
                        validate: noValidate,
                        defaultValue: null,
                        placeholder: 'title-image',
                        labelText: 'Title image',
                        accept: 'image/png, image/jpg, image/jpeg',
                        uploadFile: uploadImage,
                        imagePathPrefix: fileApiConst.pathToUploadFiles,
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
                        name: 'imageList',
                        fieldComponent: InputUploadImageList,
                        validate: noValidate,
                        defaultValue: new Array<string>(0),
                        placeholder: 'Image List',
                        labelText: 'Image List',
                        accept: 'image/png, image/jpg, image/jpeg',
                        uploadFile: uploadImage,
                        imagePathPrefix: fileApiConst.pathToUploadFiles,
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
