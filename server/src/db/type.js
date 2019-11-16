// @flow

export type MongoUserRoleType = 'user' | 'admin';

export const mongoUserRoleMap = {
    user: 'user',
    admin: 'admin',
};

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

export type MongoDocumentTypeType = 'article' | 'container';

export const mongoDocumentTypeMap: {+[key: MongoDocumentTypeType]: MongoDocumentTypeType} = {
    article: 'article',
    container: 'container',
};

export type MongoDocumentType = {|
    +_id?: mixed,
    +slug: string,
    +type: MongoDocumentTypeType,
    +title: string,
    +content: string,
    +createdDate: number,
    +updatedDate: number,
    +subDocumentList: Array<string>, // list of slug
    +tagList: Array<string>,
    +rating: number,
    +isActive: boolean,
|};
