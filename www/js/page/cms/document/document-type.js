// @flow

import type {MongoDocumentTypeType} from '../../../../../server/src/database/database-type';

export type FormDataMongoDocumentType = {
    +slug: string,
    +titleImage: string | File | null,
    +type: MongoDocumentTypeType,
    +title: string,
    +author: string,
    +illustrator: string,
    +artist: string,
    +publicationDate: number,
    +meta: string,
    +shortDescription: string,
    +content: string,
    // +createdDate: number,
    // +updatedDate: number,
    +subDocumentSlugList: Array<string>,
    +tagList: string,
    +rating: number,
    +isActive: boolean,
    +imageList: Array<string>,
};
