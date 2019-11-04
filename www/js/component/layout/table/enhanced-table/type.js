// @flow

import type {SortDirectionType} from './helper';

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
    +[key: string]: string | number | boolean,
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
) => Promise<EnhancedTableGetDataResultType>;
