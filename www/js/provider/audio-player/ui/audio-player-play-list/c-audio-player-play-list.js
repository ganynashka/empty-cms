// @flow

import React, {Component, type Node} from 'react';
import classNames from 'classnames';

import type {AudioPlayerContextType, AudioPlayerListItemType, PlayerPlayingStateType} from '../../audio-player-type';
import {playerPlayingStateTypeMap} from '../../audio-player-const';

import audioPlayerPlayListStyle from './audio-player-play-list.scss';
import imageButtonPlay from './image/button-play.svg';
import imageButtonSoundOn from './image/button-sound-on.svg';

type PropsType = {|
    +audioPlayerContext: AudioPlayerContextType,
|};

type StateType = null;

export class AudioPlayerPlayList extends Component<PropsType, StateType> {
    renderMainButtonImage(item: AudioPlayerListItemType, index: number): Node {
        const {props} = this;
        const {audioPlayerContext} = props;
        const {activeIndex, playingState} = audioPlayerContext;

        if (activeIndex === index && playingState === playerPlayingStateTypeMap.playing) {
            return (
                <img
                    alt="pause"
                    className={
                        audioPlayerPlayListStyle.audio_player_play_list___list_item__play_pause_button__image__active
                    }
                    src={imageButtonSoundOn}
                />
            );
        }

        return (
            <img
                alt="play"
                className={audioPlayerPlayListStyle.audio_player_play_list___list_item__play_pause_button__image}
                src={imageButtonPlay}
            />
        );
    }

    makeMainButtonClickHandler(item: AudioPlayerListItemType, index: number): () => mixed {
        const {props} = this;
        const {audioPlayerContext} = props;
        const {activeIndex, playingState} = audioPlayerContext;

        if (index === activeIndex) {
            return () => {
                if (playingState !== playerPlayingStateTypeMap.playing) {
                    audioPlayerContext.play();
                    return;
                }

                audioPlayerContext.pause();
            };
        }

        return () => {
            audioPlayerContext.play();
            audioPlayerContext.setActiveIndex(index);
        };
    }

    renderMainButton(item: AudioPlayerListItemType, index: number): Node {
        const handleClick = this.makeMainButtonClickHandler(item, index);

        return (
            <button
                className={audioPlayerPlayListStyle.audio_player_play_list___list_item__play_pause_button}
                onClick={handleClick}
                type="button"
            >
                {this.renderMainButtonImage(item, index)}
            </button>
        );
    }

    renderPlayListItem = (item: AudioPlayerListItemType, index: number): Node => {
        const {title, src} = item;
        const {props} = this;
        const {audioPlayerContext} = props;
        const {activeIndex, playingState} = audioPlayerContext;

        return (
            <li
                className={classNames(audioPlayerPlayListStyle.audio_player_play_list___list_item, {
                    [audioPlayerPlayListStyle.audio_player_play_list___list_item__active]: index === activeIndex,
                })}
                key={src}
            >
                {this.renderMainButton(item, index)}
                <div className={audioPlayerPlayListStyle.audio_player_play_list__info}>
                    <h4 className={audioPlayerPlayListStyle.audio_player_play_list__title}>{title}</h4>
                </div>
            </li>
        );
    };

    render(): Node {
        const {props} = this;
        const {audioPlayerContext} = props;
        const {isPlayListOpen, playList} = audioPlayerContext;

        if (!isPlayListOpen) {
            return null;
        }

        return (
            <div className={audioPlayerPlayListStyle.audio_player_play_list__wrapper}>
                <ol className={audioPlayerPlayListStyle.audio_player_play_list__list}>
                    {playList.map(this.renderPlayListItem)}
                </ol>
            </div>
        );
    }
}
