// @flow

import React, {Component, type Node} from 'react';
import TableBody from '@material-ui/core/TableBody/TableBody';
import TableRow from '@material-ui/core/TableRow/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';

import type {TableBodyType, TableHeaderType, TableHeaderCellType, TableBodyCellType} from './type';

type PropsType = {
    +header: TableHeaderType,
    +table: TableBodyType,
};

type StateType = null;

export class EnhancedTableBody extends Component<PropsType, StateType> {
    getCellValue(headerCell: TableHeaderCellType, row: TableBodyCellType): string {
        const cellName = headerCell.id;

        /*
        // TODO: return this functional
        getCellValue(headerCell: TableHeaderCellType, row: TableBodyCellType) {
            const cellName = headerCell.id;

            const value = row[cellName];

            return value instanceof Function ? value(this, row, cellName) : value;
        }
        */

        return String(row[cellName]);
    }

    renderCell(headerCell: TableHeaderCellType, row: TableBodyCellType): Node {
        const cellName = headerCell.id;
        const cellValue = this.getCellValue(headerCell, row);
        // const isCellValueObject = cellValue instanceof Object;

        return (
            <TableCell
                align={headerCell.align}
                // data-at-table-cell-name={cellName}
                // data-at-table-cell-value={isCellValueObject ? null : cellValue}
                key={cellName}
            >
                {cellValue}
            </TableCell>
        );
    }

    /*
        handleSortEnd = ({oldIndex, newIndex}) => {
            const {state, props} = this;

            if (oldIndex === newIndex) {
                return;
            }

            const listSortable = arrayMove(state.listSortable, oldIndex, newIndex);

            this.setState({listSortable});
            props.onSortChange(listSortable);
        };
    */

    renderRow = (row: TableBodyCellType, index: number): Node => {
        const {props} = this;
        const {header} = props;
        const {rowList} = header;

        return (
            <TableRow hover key={index} tabIndex={-1}>
                {rowList.map((headerCell: TableHeaderCellType): Node => this.renderCell(headerCell, row))}
            </TableRow>
        );
    };

    /*
        renderSortableRow = (row, index) => {
            const {header} = this.props;
            const {rowList} = header;

            return (
                <TableRowSortable index={index} key={row.id}>
                    {rowList.map(headerCell => this.renderCell(headerCell, row))}
                </TableRowSortable>
            );
        };
    */

    render(): Node {
        const {props} = this;
        // const {state, props} = this;
        const {table} = props;
        const {rowList} = table;
        // const {listSortable} = state;

        /*
                if (rowMode === rowListModeName.drag) {
                    return (
                        <TableBodySortable
                            key="table-sortable"
                            lockAxis="y"
                            lockToContainerEdges
                            onSortEnd={this.handleSortEnd}
                            useDragHandle
                        >
                            {listSortable.map(this.renderSortableRow)}
                        </TableBodySortable>
                    );
                }
        */

        return <TableBody key="table">{rowList.map(this.renderRow)}</TableBody>;
    }
}
