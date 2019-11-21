// @flow

/* global localStorage */

import {isNumber, isString} from '../../../../lib/is';

import {defaultRowPerPage, enhancedTableDirection} from './enhanced-table-const';

import type {
    EnhancedTableHeaderCellType,
    EnhancedTablePropsType,
    EnhancedTableSavedStateType,
} from './enhanced-table-type';

export function getDefaultState(props: EnhancedTablePropsType): EnhancedTableSavedStateType {
    return {
        order: enhancedTableDirection.asc,
        orderBy: props.header.rowList[0].id,
        rowsPerPage: defaultRowPerPage,
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
        order: order === enhancedTableDirection.desc ? enhancedTableDirection.desc : enhancedTableDirection.asc,
        orderBy: isString(orderBy) ? orderBy : props.header.rowList[0].id,
        rowsPerPage: isNumber(rowsPerPage) ? rowsPerPage : defaultRowPerPage,
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
