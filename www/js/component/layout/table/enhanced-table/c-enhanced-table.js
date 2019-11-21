// @flow

import React, {Component, type Node} from 'react';
import Table from '@material-ui/core/Table';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';

import {EmptyTableBody} from '../empty-table-body/c-empty-table-body';
import {typeConverter} from '../../../../lib/type';
import {Spinner} from '../../spinner/c-spinner';

import {EnhancedTableHead} from './c-enhanced-table-head';
import {EnhancedTableToolbar} from './c-enhanced-table-toolbar';
import {EnhancedTableBody} from './c-enhanced-table-body';
import {direction, getDefaultState, getSavedState, saveState} from './helper';
import type {EnhancedTableBodyCellType, EnhancedTablePropsType, SortDirectionType} from './type';
import style from './enhanced-table.style.scss';

type PropsType = EnhancedTablePropsType;

type StateType = {|
    +order: SortDirectionType,
    +orderBy: string,
    +rowsPerPage: number,
    +pageIndex: number,
    +list: Array<EnhancedTableBodyCellType>,
    +allElementsNumber: number,
    +isInProgress: boolean,
|};

export class EnhancedTable extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            ...getDefaultState(props),
            ...getSavedState(props),
            pageIndex: 0,
            list: [],
            allElementsNumber: 0,
            isInProgress: false,
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = async () => {
        this.setState({isInProgress: true});

        const {state, props} = this;
        const {pageIndex, rowsPerPage, orderBy, order} = state;

        const {list, allElementsNumber} = await props.getData(pageIndex, rowsPerPage, orderBy, order);

        this.setState({list, allElementsNumber, isInProgress: false});

        saveState({order, orderBy, rowsPerPage}, props);
    };

    handleRequestSort = (event: SyntheticEvent<HTMLElement>, orderBy: string) => {
        const {orderBy: oldOrderBy, order: oldOrder} = this.state;
        const order = oldOrderBy === orderBy && oldOrder === direction.desc ? direction.asc : direction.desc;

        this.setState({order, orderBy}, this.fetchData);
    };

    handleChangePage = (event: SyntheticEvent<HTMLElement> | null, pageIndex: number) => {
        this.setState({pageIndex}, this.fetchData);
    };

    handleChangeRowsPerPage = (event: SyntheticEvent<HTMLElement> | null) => {
        if (event === null) {
            return;
        }

        const {value}: {value?: mixed} = typeConverter<{value?: mixed}>(event.target);

        this.setState({rowsPerPage: parseInt(value, 10) || 0}, this.fetchData);
    };

    renderNoData(): Node {
        const {props, state} = this;
        const {header} = props;
        const {order, orderBy} = state;

        return (
            <Table key="table">
                <EnhancedTableHead
                    onRequestSort={this.handleRequestSort}
                    order={order}
                    orderBy={orderBy}
                    rowList={header.rowList}
                />

                <EmptyTableBody colSpan={header.rowList.length}/>
            </Table>
        );
    }

    renderData(): Node {
        const {props, state} = this;
        const {header} = props;
        const {order, orderBy, rowsPerPage, pageIndex, list, allElementsNumber} = state;

        return [
            <Table key="table">
                <EnhancedTableHead
                    onRequestSort={this.handleRequestSort}
                    order={order}
                    orderBy={orderBy}
                    rowList={header.rowList}
                />
                <EnhancedTableBody header={header} table={{rowList: list}}/>
            </Table>,
            <TablePagination
                backIconButtonProps={{
                    'aria-label': 'Previous Page',
                }}
                component="div"
                count={allElementsNumber}
                key="table-pagination"
                nextIconButtonProps={{
                    'aria-label': 'Next Page',
                }}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                page={pageIndex}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50, 100, 1e3, 5e3, 10e3]}
            />,
        ];
    }

    renderContent(): Node {
        const {state} = this;
        const {list, isInProgress} = state;

        if (isInProgress) {
            return <Spinner/>;
        }

        return list.length === 0 ? this.renderNoData() : this.renderData();
    }

    render(): Node {
        const {props} = this;
        const {header} = props;
        const headerText = header.header;

        return (
            <Paper className={style.table_wrapper}>
                <EnhancedTableToolbar header={headerText}/>
                {this.renderContent()}
            </Paper>
        );
    }
}
