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

export type MongoSubDocumentsViewType = 'image-header' | 'header' | 'auto';

export const mongoSubDocumentsViewTypeMap = {
    imageHeader: 'image-header',
    header: 'header',
    auto: 'auto',
};

export type MongoDocumentType = {|
    +_id?: mixed,
    +slug: string,
    +titleImage: string,
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
    +createdDate: number,
    +updatedDate: number,
    +subDocumentSlugList: Array<string>,
    +tagList: Array<string>,
    +rating: number,
    +isActive: boolean,
    +isInSiteMap: boolean,
    +imageList: Array<string>,
|};

export type MongoDocumentTreeNodeType = {|
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
    +subDocumentSlugList: Array<string>,
    +isActive: boolean,
    +imageList: Array<string>,
|};

export type MongoDocumentSlugHeaderType = {|
    +slug: string,
    +header: string,
|};

export type MongoDocumentLinkType = {|
    +type: MongoDocumentTypeType,
    +slug: string,
    +header: string,
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
    +imageList: Array<string>,
|}
*/
