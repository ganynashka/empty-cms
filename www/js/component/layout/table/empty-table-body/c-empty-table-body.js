// @flow

import React, {type Node} from 'react';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';

import {isString} from '../../../../lib/is';

const defaultEmptyTest = '[ Empty ]';

type PropsType = {|
    +colSpan: number,
    +text?: string,
|};

export function EmptyTableBody(props: PropsType): Node {
    const {colSpan, text} = props;

    return (
        <TableBody>
            <TableRow>
                <TableCell colSpan={colSpan}>
                    <Typography align="center" variant="h6">
                        {isString(text) ? text : defaultEmptyTest}
                    </Typography>
                </TableCell>
            </TableRow>
        </TableBody>
    );
}

/*
EmptyTableBody.propTypes = {
    colSpan: PropTypes.number.isRequired,
    text: PropTypes.string,
};
*/
