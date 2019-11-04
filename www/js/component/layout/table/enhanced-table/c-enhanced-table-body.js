// @flow

import React, {Component, type Node} from 'react';
import TableBody from '@material-ui/core/TableBody/TableBody';
import TableRow from '@material-ui/core/TableRow/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';

import {isBoolean} from '../../../../lib/is';

import type {TableBodyType, TableHeaderType, TableHeaderCellType, TableBodyCellType} from './type';
import {EnhancedTableCheckbox} from './ui/c-enhanced-table-checkbox';

type PropsType = {
    +header: TableHeaderType,
    +table: TableBodyType,
};

type StateType = null;

export class EnhancedTableBody extends Component<PropsType, StateType> {
    getCellValue(headerCell: TableHeaderCellType, row: TableBodyCellType): Node {
        const cellName = headerCell.id;

        const cellValue = row[cellName];

        if (isBoolean(cellValue)) {
            return <EnhancedTableCheckbox isChecked={cellValue}/>;
        }

        return cellValue;
    }

    renderCell(headerCell: TableHeaderCellType, row: TableBodyCellType): Node {
        const cellName = headerCell.id;
        const cellValue = this.getCellValue(headerCell, row);

        return (
            <TableCell align={headerCell.align} key={cellName}>
                {cellValue}
            </TableCell>
        );
    }

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

    render(): Node {
        const {props} = this;
        const {table} = props;
        const {rowList} = table;

        return <TableBody key="table">{rowList.map(this.renderRow)}</TableBody>;
    }
}
