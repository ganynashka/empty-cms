// @flow

import type {MongoDocumentTypeType, MongoSubDocumentsViewType} from '../../../../../server/src/database/database-type';

export type FormDataMongoDocumentType = {
    +id: string,
    +slug: string,
    +titleImage: string | null,
    +type: MongoDocumentTypeType,
    +subDocumentListViewType: MongoSubDocumentsViewType,
    +title: string,
    +header: string,
    +author: string,
    +illustrator: string,
    +artist: string,
    +publicationDate: number,
    +meta: string,
    +shortDescription: string,
    +content: string,
    // +subDocumentSlugList: Array<string>,
    +subDocumentIdList: Array<string>,
    +tagList: string,
    +rating: number,
    +isActive: boolean,
    +isInSiteMap: boolean,
    +fileList: Array<string>,
    // +createdDate: number,
    // +updatedDate: number,
};
