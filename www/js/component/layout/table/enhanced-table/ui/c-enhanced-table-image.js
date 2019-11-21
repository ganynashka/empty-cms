// @flow

import React, {Component, type Node} from 'react';

import style from '../enhanced-table.scss';

type PropsType = {|
    +alt?: string,
    +src: string,
|};

export class EnhancedTableImage extends Component<PropsType, null> {
    renderImage(): Node {
        const {props} = this;
        const {src, alt = ''} = props;

        return <img alt={alt} className={style.image} src={src}/>;
    }

    render(): Node {
        return <div className={style.image_wrapper}>{this.renderImage()}</div>;
    }
}
