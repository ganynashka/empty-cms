// @flow

import React, {type Node} from 'react';

import {isNumber, isString} from '../../../lib/is';

import cssSpinnerStyle from './css-spinner.scss';

type PropsType = {|
    +size?: number,
    +borderWidth?: number,
    +borderMainColor?: string,
    +borderSecondaryColor?: string,
|};

export function CssSpinner(props: PropsType): Node {
    const {size, borderWidth, borderMainColor, borderSecondaryColor} = props;

    const endSize = isNumber(size) ? size : null;

    const style = {
        width: endSize,
        height: endSize,
        borderWidth: isNumber(borderWidth) ? borderWidth : null,
        borderColor: isString(borderSecondaryColor) ? borderSecondaryColor : null,
        borderTopColor: isString(borderMainColor) ? borderMainColor : null,
    };

    return (
        <div className={cssSpinnerStyle.spinner_wrapper}>
            <div className={cssSpinnerStyle.spinner_image} style={style}/>
        </div>
    );
}
