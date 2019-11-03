// @flow

/* global localStorage */

import {isNumber, isString} from '../../../../lib/is';

import type {EnhancedTablePropsType} from './c-enhanced-table';
import type {TableHeaderCellType} from './type';

export const direction = {
    asc: 'asc',
    desc: 'desc',
};
export type SortDirectionType = 'asc' | 'desc';

// export const rowListModeName = {
//     drag: 'drag',
//     'static': 'static',
// };
export type RowListModeNameType = 'static' | 'drag';

export type EnhancedTableSavedStateType = {|
    +order: SortDirectionType,
    +orderBy: string,
    +rowsPerPage: number,
|};

// function stableSort(array, cmp) {
//     const stabilizedThis = array.map((item, index) => [item, index]);
//
//     stabilizedThis.sort((itemA, itemB) => {
//         const order = cmp(itemA[0], itemB[0]);
//
//         if (order === 0) {
//             return itemA[1] - itemB[1];
//         }
//
//         return order;
//     });
//
//     return stabilizedThis.map(item => item[0]);
// }

// function desc(itemA, itemB, orderBy) {
//     const itemAValue = itemA[orderBy];
//     const itemBValue = itemB[orderBy];
//
//     if (itemBValue < itemAValue) {
//         return -1;
//     }
//
//     if (itemBValue > itemAValue) {
//         return 1;
//     }
//
//     return 0;
// }

// function getSorting(order, orderBy) {
//     return order === 'desc' ?
//         (itemA, itemB) => desc(itemA, itemB, orderBy) :
//         (itemA, itemB) => -desc(itemA, itemB, orderBy);
// }

// export function sortListBy(list, order, orderBy) {
//     return stableSort(list, getSorting(order, orderBy));
// }

export function getDefaultState(props: EnhancedTablePropsType): EnhancedTableSavedStateType {
    return {
        order: props.order === direction.desc ? direction.desc : direction.asc,
        orderBy: props.orderBy || props.header.rowList[0].id,
        rowsPerPage: props.rowsPerPage || 10,
    };
}

function getTableKey(props: EnhancedTablePropsType): string {
    const header = props.header.header;
    const columns = props.header.rowList.map((column: TableHeaderCellType): string => column.id).join(' | ');

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

// export function getRowSortableIndex(table, row) {
//     return table.state.listSortable.indexOf(row);
// }
