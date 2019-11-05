// @flow

import React, {type Node} from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import spinnerStyle from './spinner.style.scss';

type PropsType = {|
    +isShow?: boolean,
|};

export function Spinner(props: PropsType): Node {
    const {isShow} = props;

    if (isShow === false) {
        return null;
    }

    return (
        <div className={spinnerStyle.spinner_wrapper}>
            <CircularProgress color="primary" size={42}/>
        </div>
    );
}
