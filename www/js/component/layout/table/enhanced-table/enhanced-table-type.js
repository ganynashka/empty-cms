// @flow

import {type Node} from 'react';

export type SortDirectionType = 'asc' | 'desc';

export type EnhancedTableSavedStateType = {|
    +order: SortDirectionType,
    +orderBy: string,
    +rowsPerPage: number,
|};

export type EnhancedTableCellAlignType = 'inherit' | 'left' | 'center' | 'right' | 'justify';

export type EnhancedTableHeaderCellType = {|
    +id: string,
    +label: string,
    +align: EnhancedTableCellAlignType,
    +hasSort: boolean,
|};

export type EnhancedTableHeaderType = {|
    +header: string,
    +rowList: Array<EnhancedTableHeaderCellType>,
|};

export type EnhancedTableBodyCellType = {
    +[key: string]: string | number | boolean | Node,
};

export type EnhancedTableBodyType = {|
    +rowList: Array<EnhancedTableBodyCellType>,
|};

export type OnRequestSortCallBackType = (event: SyntheticEvent<HTMLElement>, rowId: string) => mixed;

export type EnhancedTableGetDataResultType = {|
    +list: Array<EnhancedTableBodyCellType>,
    +allElementsNumber: number,
|};

export type EnhancedTableGetDataType = (
    pageIndex: number,
    rowsPerPage: number,
    orderBy: string,
    order: SortDirectionType,
    refreshTable: () => Promise<mixed>,
) => Promise<EnhancedTableGetDataResultType>;

export type EnhancedTablePropsType = {
    +getData: EnhancedTableGetDataType,
    +header: EnhancedTableHeaderType,
};
