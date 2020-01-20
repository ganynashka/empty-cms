// @flow

import React, {Component, type Node} from 'react';
import {Link} from 'react-router-dom';
import classNames from 'classnames';

import noImageImage from './image/no-image.svg';
import imagePreviewStyle from './image-preview.scss';

type PropsType = {|
    +additionalClassName?: string,
    +image: {|
        +src: string,
        +title: string,
    |},
    +link: {|
        +to: string,
    |},
|};

export function ImagePreview(props: PropsType): Node {
    const {additionalClassName, image, link} = props;
    const {src, title} = image;

    if (!src.trim()) {
        return (
            <Link
                className={classNames(imagePreviewStyle.image_preview__wrapper__no_image, additionalClassName || '')}
                to={link.to}
            >
                <img alt={title} className={imagePreviewStyle.image_preview__no_image} src={noImageImage}/>
                <span className={imagePreviewStyle.article__list_image_item__link_text}>{title}</span>
            </Link>
        );
    }

    return (
        <Link
            className={classNames(imagePreviewStyle.image_preview__wrapper, additionalClassName || '')}
            style={{backgroundImage: 'url(' + src + ')'}}
            to={link.to}
        >
            <img alt={title} className={imagePreviewStyle.image_preview__image} src={src}/>
            <span className={imagePreviewStyle.article__list_image_item__link_text}>{title}</span>
        </Link>
    );
}
