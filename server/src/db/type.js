// @flow

export type MongoUserRoleType = 'user' | 'admin';

export type MongoUserType = {|
    +_id?: mixed,
    +id: string,
    +role: MongoUserRoleType,
    +login: string,
    +password: string,
    +register: {|
        date: number,
    |},
    rating: number,
|};
