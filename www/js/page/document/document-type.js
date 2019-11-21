// @flow

import type {MongoDocumentTypeType} from '../../../../server/src/db/type';

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
