// @flow

import React, {type Node} from 'react';

import {isString} from '../../../lib/is';

type PropsType = {|
    +width: number,
    +height: number,
    +className?: string,
|};

type StateType = null;

export function ImagePlaceholder(props: PropsType): Node {
    const {width, height, className} = props;

    const additionalClassName = isString(className) ? className : null;

    return (
        <svg className={additionalClassName} height={height} width={width}>
            <rect fill="#777" height={height} width={width}/>
            <text
                alignmentBaseline="central"
                fill="#fff"
                fontFamily="'Lucida Console', Monaco, monospace"
                fontSize="16"
                textAnchor="middle"
                x="50%"
                y="50%"
            >
                {width} x {height}
            </text>
        </svg>
    );
}
