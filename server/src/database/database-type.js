// @flow

export type MongoUserRoleType = 'user' | 'admin';

export type MongoUserType = {|
    +_id?: mixed,
    +id: string,
    +role: MongoUserRoleType,
    +login: string,
    +passwordSha256: string,
    +registerDate: number,
    +rating: number,
|};

export type MongoUserFrontType = {|
    +role: MongoUserRoleType,
    +login: string,
    +registerDate: number,
    +rating: number,
|};

export type MongoDocumentTypeType = 'article' | 'container' | 'downloadable-image-list';

export const mongoDocumentTypeMap = {
    article: 'article',
    container: 'container',
    downloadableImageList: 'downloadable-image-list',
};

export type MongoSubDocumentsViewType = 'image-header' | 'audio-header' | 'header' | 'auto';

export const mongoSubDocumentsViewTypeMap = {
    imageHeader: 'image-header',
    audioHeader: 'audio-header',
    header: 'header',
    auto: 'auto',
};

export type MongoDocumentType = {|
    +_id?: mixed,
    +id: string,
    +slug: string,
    +header: string,
    +titleImage: string,
    +type: MongoDocumentTypeType,
    +subDocumentListViewType: MongoSubDocumentsViewType,
    +author: string,
    +illustrator: string,
    +artist: string,
    +publicationDate: number,
    +title: string,
    +meta: string,
    +metaDescription: string,
    +shortDescription: string,
    +tagList: Array<string>,
    +isActive: boolean,
    +isInSiteMap: boolean,
    +subDocumentIdList: Array<string>,
    // +subDocumentSlugList?: Array<string>,
    +rating: number,
    +fileList: Array<string>,
    +content: string,
    +createdDate: number,
    +updatedDate: number,
|};

export type MongoDocumentTreeNodeType = {|
    +id: string,
    +slug: string,
    +titleImage: string,
    +type: MongoDocumentTypeType,
    +subDocumentListViewType: MongoSubDocumentsViewType,
    +title: string,
    +header: string,
    +author: string,
    +illustrator: string,
    +artist: string,
    +meta: string,
    +shortDescription: string,
    +content: string,
    +subNodeList: Array<MongoDocumentTreeNodeType>,
    // +subDocumentSlugList?: Array<string>,
    +subDocumentIdList: Array<string>,
    +isActive: boolean,
    +fileList: Array<string>,
|};

export type MongoDocumentShortDataType = {|
    +id: string,
    +slug: string,
    +type: MongoDocumentTypeType,
    +header: string,
    +titleImage: string,
    // +subDocumentSlugList?: Array<string>,
    +subDocumentIdList: Array<string>,
    +fileList: Array<string>,
    +isActive: boolean,
    +contentLength: number,
|};

/*
export type MongoDocumentShortDataType = {|
    +type: MongoDocumentTypeType,
    +slug: string,
    +header: string,
|};
*/

export type OpenGraphDataType = {|
    +title: string,
    +type: string, // "article"
    +image: string,
    +description: string,
    +locale: string,
    +url: string,
|};

/*
export type MongoDocumentTreeType = {|
    +_id?: mixed,
    +slug: string,
    +titleImage: string,
    +type: MongoDocumentTypeType,
    +title: string,
    +description: string,
    +content: string,
    +createdDate: number,
    +updatedDate: number,
    +subDocumentSlugList: Array<MongoDocumentType>,
    +tagList: Array<string>,
    +rating: number,
    +isActive: boolean,
    +fileList: Array<string>,
|}
*/
