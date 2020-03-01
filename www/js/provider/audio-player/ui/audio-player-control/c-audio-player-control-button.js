// @flow

import React, {Component, type Node} from 'react';
import classNames from 'classnames';

import audioPlayerControlStyle from './audio-player-control.scss';

type PropsType = {|
    +onClick: () => mixed,
    +imageSrc: string,
    +alt: string,
    +isActive?: boolean,
|};

export function AudioPlayerControlButton(props: PropsType): Node {
    const {onClick, imageSrc, alt, isActive} = props;
    const cssButton = audioPlayerControlStyle.audio_player_control__button;
    const cssActive = audioPlayerControlStyle.audio_player_control__button__active;
    const cssImage = audioPlayerControlStyle.audio_player_control__button__image;
    const className = classNames(cssButton, {[cssActive]: isActive});

    return (
        <button className={className} onClick={onClick} type="button">
            <img alt={alt} className={cssImage} src={imageSrc}/>
        </button>
    );
}
