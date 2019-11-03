// @flow

import React, {Component, type Node} from 'react';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import {isFunction} from '../../../../lib/is';

import type {SortDirectionType} from './helper';
import type {TableHeaderCellType, OnRequestSortCallBackType} from './type';
import style from './enhanced-table.style.scss';

type PropsType = {|
    +onRequestSort?: OnRequestSortCallBackType,
    +order: SortDirectionType,
    +orderBy: string,
    +rowList: Array<TableHeaderCellType>,
|};

type StateType = null;

export class EnhancedTableHead extends Component<PropsType, StateType> {
    createSortHandler(rowId: string): (event: SyntheticEvent<HTMLElement>) => mixed {
        return (event: SyntheticEvent<HTMLElement>) => {
            const {props} = this;
            const {onRequestSort} = props;

            if (isFunction(onRequestSort)) {
                onRequestSort(event, rowId);
            }
        };
    }

    renderSortLabel(row: TableHeaderCellType): Node {
        const {props} = this;
        const {order, orderBy, onRequestSort} = props;
        const rowId = row.id;
        const content = row.label;

        if (isFunction(onRequestSort) && row.hasSort) {
            return <span className={style.sort_label__static}>{content}</span>;
        }

        const handleSort = this.createSortHandler(rowId);

        if (orderBy === rowId) {
            return (
                <TableSortLabel active className={style.sort_label} direction={order} onClick={handleSort}>
                    {content}
                </TableSortLabel>
            );
        }

        return (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
            <span className={style.sort_label} onClick={handleSort}>
                {content}
            </span>
        );
    }

    renderCell = (row: TableHeaderCellType): Node => {
        return (
            <TableCell align={row.align} key={row.id}>
                {this.renderSortLabel(row)}
            </TableCell>
        );
    };

    render(): Node {
        const {props} = this;
        const {rowList} = props;

        return (
            <TableHead>
                <TableRow>{rowList.map(this.renderCell)}</TableRow>
            </TableHead>
        );
    }
}
