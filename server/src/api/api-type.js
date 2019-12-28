// @flow

import {type MongoSortDirectionType} from 'mongodb';

import type {SearchParametersType} from '../../../www/js/component/client/search/search-type';

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

export type GetSearchParameterListType = Array<{[$Keys<SearchParametersType>]: RegExp}>;

export type GetDocumentTreeParameterType = {|
    +slug: string,
    +deep: number,
|};
