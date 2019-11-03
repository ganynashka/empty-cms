// @flow

import React, {type Node} from 'react';

import style from '../enhanced-table.style.scss';

type PropsType = {|
    +isChecked: boolean,
|};

export function TableCheckbox(props: PropsType): Node {
    const {isChecked} = props;

    return (
        <div
            className={isChecked ? style.table_checkbox__checked : style.table_checkbox}
            // data-at-checkbox-value={isChecked}
        />
    );
}

/*
TableCheckbox.propTypes = {
    isChecked: PropTypes.bool.isRequired,
};
*/
