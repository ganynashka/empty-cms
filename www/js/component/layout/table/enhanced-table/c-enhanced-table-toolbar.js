// @flow

import React, {type Node} from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography/Typography';

import style from './enhanced-table.style.scss';

type PropsType = {|
    +header: string,
|};

export function EnhancedTableToolbar(props: PropsType): Node {
    const {header} = props;

    return (
        <Toolbar className={style.table_toolbar}>
            <Typography variant="h6">{header}</Typography>
        </Toolbar>
    );
}

// EnhancedTableToolbar.propTypes = {
//     header: PropTypes.string.isRequired,
// };
