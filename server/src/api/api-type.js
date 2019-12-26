// @flow

import {type MongoSortDirectionType} from 'mongodb';

export type GetListParameterType = {|
    +pageIndex: number,
    +pageSize: number,
    +sortParameter: string,
    +sortDirection: MongoSortDirectionType,
|};

export type GetSearchExactParameterType = {|
    +key: string,
    +value: string,
|};

export type GetSearchParameterType = {
    title?: RegExp,
    content?: RegExp,
};

export type GetDocumentTreeParameterType = {|
    +slug: string,
    +deep: number,
|};
