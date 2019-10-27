// @flow

export type MongoUserRoleType = 'user' | 'admin';

export type MongoUserType = {|
    +_id?: mixed,
    +id: string,
    +role: MongoUserRoleType,
    +login: string,
    +password: string,
    +register: {|
        +date: number,
    |},
    +rating: number,
|};

export type MongoDocumentTypeType = 'article' | 'container';

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
|};
