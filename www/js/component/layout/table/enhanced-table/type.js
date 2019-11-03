// @flow

import type {RowListModeNameType, SortDirectionType} from './helper';

export type TableCellAlignType = 'inherit' | 'left' | 'center' | 'right' | 'justify';

/*
export const headerRowPropTypes = shape({
    id: string.isRequired,
    label: string.isRequired,
    align: oneOf(['inherit', 'left', 'center', 'right', 'justify']).isRequired,
    hasSort: bool,
});
*/
export type TableHeaderCellType = {|
    +id: string,
    +label: string,
    +align: TableCellAlignType,
    +hasSort: boolean,
|};

/*
export const headerPropTypes = shape({
    header: string.isRequired,
    rowList: arrayOf(headerRowPropTypes).isRequired,
}).isRequired;
*/
export type TableHeaderType = {|
    +header: string,
    +rowList: Array<TableHeaderCellType>,
|};

export type TableBodyCellType = {
    +[key: string]: Node,
    // +align: TableCellAlignType,
    // +id: string,
};

// export const bodyPropTypes = shape({
//     rowList: arrayOf(shape({})).isRequired,
//     rowMode: oneOf([rowListModeName.drag, rowListModeName.static]).isRequired,
// }).isRequired;
export type TableBodyType = {|
    +rowList: Array<TableBodyCellType>,
    +rowMode: RowListModeNameType,
|};

export type OnRequestSortCallBackType = (event: SyntheticEvent<HTMLElement>, rowId: string) => mixed;

export type EnhancedTableGetDataResultType = {|
    +list: Array<TableBodyCellType>,
    +allElementsNumber: number,
|};

export type EnhancedTableGetDataType = (
    currentPage: number,
    rowsPerPage: number,
    orderBy: string,
    order: SortDirectionType,
) => EnhancedTableGetDataResultType;
