// @flow

import {type $Request} from 'express';
import {type SortDirectionType} from 'mongodb';

import {getSortDirection} from '../db/util';

export const streamOptionsArray = {transform: (item: {}): string => JSON.stringify(item) + ','};

export type GetListParameterType = {|
    +pageIndex: number,
    +pageSize: number,
    +sortParameter: string,
    +sortDirection: SortDirectionType,
|};

export function getListParameters(request: $Request): GetListParameterType {
    const pageIndex = parseInt(request.query['page-index'], 10) || 0;
    const pageSize = parseInt(request.query['page-size'], 10) || 10;
    const sortParameter = String(request.query['sort-parameter']).trim() || ' ';
    const sortDirection = getSortDirection(request.query['sort-direction']);

    return {
        pageIndex,
        pageSize,
        sortParameter,
        sortDirection,
    };
}
