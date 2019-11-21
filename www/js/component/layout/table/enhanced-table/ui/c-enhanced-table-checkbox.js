// @flow

import React, {type Node} from 'react';

import style from '../enhanced-table.scss';

type PropsType = {|
    +isChecked: boolean,
|};

export function EnhancedTableCheckbox(props: PropsType): Node {
    const {isChecked} = props;

    return <div className={isChecked ? style.table_checkbox__checked : style.table_checkbox}/>;
}
