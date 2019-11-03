// @flow

import React, {Component, type Node} from 'react';

import style from '../enhanced-table.style.scss';

type PropsType = {|
    +alt?: string,
    +src: string,
|};

export class TableImageLink extends Component<PropsType, null> {
    // static propTypes = {
    //     alt: PropTypes.string,
    //     src: PropTypes.string.isRequired,
    // };

    // handleShowFullImage = () => {
    //     showPopup(this.renderImage());
    // };

    renderImage(): Node {
        const {props} = this;
        const {src, alt = ''} = props;

        return <img alt={alt} className={style.image} src={src}/>;
    }

    render(): Node {
        return <div className={style.image_wrapper}>{this.renderImage()}</div>;
    }
}
