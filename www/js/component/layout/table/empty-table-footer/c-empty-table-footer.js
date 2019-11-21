// @flow

import React, {type Node} from 'react';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';

const defaultEmptyText = '[ Empty ]';

type PropsType = {|
    +colSpan: number,
|};

export function EmptyTableFooter(props: PropsType): Node {
    const {colSpan} = props;

    return (
        <TableFooter>
            <TableRow>
                <TableCell colSpan={colSpan}>
                    <Typography align="center" variant="h6">
                        {defaultEmptyText}
                    </Typography>
                </TableCell>
            </TableRow>
        </TableFooter>
    );
}
