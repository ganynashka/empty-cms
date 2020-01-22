// @flow

import React, {Component, type Node} from 'react';
import {Link} from 'react-router-dom';
import classNames from 'classnames';

import noImageImage from './image/no-image.svg';
import imagePreviewStyle from './image-preview.scss';

type StateType = {|
    +isLoaded: boolean,
|};

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

export class ImagePreview extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            isLoaded: false,
        };
    }

    renderNoImage(): Node {
        const {props} = this;
        const {additionalClassName, image, link} = props;
        const {title} = image;

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

    handleImageLoad = () => {
        this.setState({isLoaded: true});
    };

    renderPreview(): Node {
        const {props, state} = this;
        const {additionalClassName, image, link} = props;
        const {src, title} = image;

        return (
            <Link
                className={classNames(imagePreviewStyle.image_preview__wrapper, additionalClassName || '')}
                style={{backgroundImage: state.isLoaded ? 'url(' + src + ')' : 'none'}}
                to={link.to}
            >
                <img
                    alt={title}
                    className={imagePreviewStyle.image_preview__image}
                    loading="lazy"
                    onLoad={this.handleImageLoad}
                    src={src}
                />
                <span className={imagePreviewStyle.article__list_image_item__link_text}>{title}</span>
            </Link>
        );
    }

    render(): Node {
        const {props} = this;
        const {image} = props;
        const {src} = image;

        return src.trim() ? this.renderPreview() : this.renderNoImage();
    }
}
