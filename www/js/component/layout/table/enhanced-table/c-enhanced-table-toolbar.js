// @flow

import React, {type Node} from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography/Typography';

type PropsType = {|
    +header: string,
|};

export function EnhancedTableToolbar(props: PropsType): Node {
    const {header} = props;

    return (
        <Toolbar>
            <Typography variant="h5">{header}</Typography>
        </Toolbar>
    );
}
