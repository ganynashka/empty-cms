// @flow

/* global localStorage */

import {isNumber, isString} from '../../../../lib/is';

import type {EnhancedTableHeaderCellType, EnhancedTablePropsType, SortDirectionType} from './type';

export const direction = {
    asc: 'asc',
    desc: 'desc',
};

export type EnhancedTableSavedStateType = {|
    +order: SortDirectionType,
    +orderBy: string,
    +rowsPerPage: number,
|};

export function getDefaultState(props: EnhancedTablePropsType): EnhancedTableSavedStateType {
    return {
        order: direction.asc,
        orderBy: props.header.rowList[0].id,
        rowsPerPage: 100,
    };
}

function getTableKey(props: EnhancedTablePropsType): string {
    const header = props.header.header;
    const columns = props.header.rowList.map((column: EnhancedTableHeaderCellType): string => column.id).join(' | ');

    return `Table "${header}" - ${columns}`;
}

export function getSavedState(props: EnhancedTablePropsType): EnhancedTableSavedStateType {
    const tableKey = getTableKey(props);
    const {order, orderBy, rowsPerPage} = JSON.parse(localStorage.getItem(tableKey) || '{}');

    return {
        order: order === direction.desc ? direction.desc : direction.asc,
        orderBy: isString(orderBy) ? orderBy : props.header.rowList[0].id,
        rowsPerPage: isNumber(rowsPerPage) ? rowsPerPage : 10,
    };
}

export function saveState(
    state: EnhancedTableSavedStateType,
    props: EnhancedTablePropsType
): EnhancedTableSavedStateType {
    const newState: EnhancedTableSavedStateType = {
        order: state.order,
        orderBy: state.orderBy,
        rowsPerPage: state.rowsPerPage,
    };

    localStorage.setItem(getTableKey(props), JSON.stringify(newState));

    return newState;
}
