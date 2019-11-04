// @flow

import type {SortDirectionType} from './helper';

export type TableCellAlignType = 'inherit' | 'left' | 'center' | 'right' | 'justify';

export type TableHeaderCellType = {|
    +id: string,
    +label: string,
    +align: TableCellAlignType,
    +hasSort: boolean,
|};

export type TableHeaderType = {|
    +header: string,
    +rowList: Array<TableHeaderCellType>,
|};

export type TableBodyCellType = {
    +[key: string]: string | number | boolean,
};

export type TableBodyType = {|
    +rowList: Array<TableBodyCellType>,
|};

export type OnRequestSortCallBackType = (event: SyntheticEvent<HTMLElement>, rowId: string) => mixed;

export type EnhancedTableGetDataResultType = {|
    +list: Array<TableBodyCellType>,
    +allElementsNumber: number,
|};

export type EnhancedTableGetDataType = (
    pageIndex: number,
    rowsPerPage: number,
    orderBy: string,
    order: SortDirectionType,
) => Promise<EnhancedTableGetDataResultType>;
