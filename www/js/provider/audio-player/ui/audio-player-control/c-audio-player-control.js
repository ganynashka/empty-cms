// @flow

/* global document */

import React, {Component, type Node} from 'react';

import type {AudioPlayerContextType, AudioPlayerListItemType} from '../../audio-player-type';
import {playerPlayingStateTypeMap} from '../../audio-player-const';

type PropsType = {|
    +audioPlayerContext: AudioPlayerContextType,
|};

type StateType = {|
    +trackCurrentTime: number,
    +trackFullTime: number,
    +refAudio: {current: HTMLAudioElement | null},
|};

export class AudioPlayerControl extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            trackCurrentTime: 0,
            trackFullTime: 0,
            refAudio: React.createRef<HTMLAudioElement>(),
        };
    }

    componentDidUpdate(prevProps: PropsType, prevState: StateType) {
        const {props} = this;
        const {audioPlayerContext} = props;

        if (prevProps.audioPlayerContext.playingState !== audioPlayerContext.playingState) {
            this.updatePlayingState();
        }
    }

    updatePlayingState() {
        const {props, state} = this;
        const {audioPlayerContext} = props;
        const {refAudio} = state;
        const audioNode = refAudio.current;

        if (!audioNode) {
            return;
        }

        if (audioPlayerContext.playingState === playerPlayingStateTypeMap.playing) {
            audioNode.play();
            return;
        }

        if (audioPlayerContext.playingState === playerPlayingStateTypeMap.paused) {
            audioNode.pause();
            return;
        }

        if (audioPlayerContext.playingState === playerPlayingStateTypeMap.stopped) {
            audioNode.pause();
            audioNode.currentTime = 0; // state.trackCurrentTime updated by this.handleOnTimeUpdate
            return;
        }

        console.error('Can not detect this playingState:', audioPlayerContext.playingState);
    }

    renderButtonList(): Node {
        const {props} = this;
        const {audioPlayerContext} = props;

        const handlePrev = audioPlayerContext.prev;
        const handlePlay = audioPlayerContext.play;
        const handlePause = audioPlayerContext.pause;
        const handleStop = audioPlayerContext.stop;
        const handleNext = audioPlayerContext.next;

        return (
            <div>
                <button onClick={handlePrev} type="button">
                    prev
                </button>
                <button onClick={handlePlay} type="button">
                    play
                </button>
                <button onClick={handlePause} type="button">
                    pause
                </button>
                <button onClick={handleStop} type="button">
                    stop
                </button>
                <button onClick={handleNext} type="button">
                    next
                </button>
            </div>
        );
    }

    handleOnCanPlay = (evt: SyntheticEvent<HTMLAudioElement>) => {
        const {props} = this;
        const {audioPlayerContext} = props;
        const {playingState} = audioPlayerContext;

        if (playingState !== playerPlayingStateTypeMap.playing) {
            return;
        }

        evt.currentTarget.play();
    };

    handleOnTimeUpdate = (evt: SyntheticEvent<HTMLAudioElement>) => {
        this.setState({trackCurrentTime: evt.currentTarget.currentTime});
    };

    handleOnLoadedMetadata = (evt: SyntheticEvent<HTMLAudioElement>) => {
        this.setState({trackFullTime: evt.currentTarget.duration});
    };

    handleOnEnded = (evt: SyntheticEvent<HTMLAudioElement>) => {
        console.log('play next/random track here if needed');
    };

    renderAudioTag(): Node {
        const {props, state} = this;
        const {audioPlayerContext} = props;
        const {activeItemId, playList, playingState} = audioPlayerContext;
        const activeItem = playList.find((item: AudioPlayerListItemType): boolean => item.id === activeItemId);

        if (!activeItem) {
            return null;
        }

        return (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <audio
                controls
                key={activeItemId}
                onCanPlay={this.handleOnCanPlay}
                onEnded={this.handleOnEnded}
                onLoadedMetadata={this.handleOnLoadedMetadata}
                onTimeUpdate={this.handleOnTimeUpdate}
                preload="metadata"
                ref={state.refAudio}
                src={activeItem.src}
            />
        );
    }

    render(): Node {
        const {props, state} = this;
        const {audioPlayerContext} = props;
        const {activeItemId} = audioPlayerContext;

        return (
            <>
                <pre>
                    <code>{JSON.stringify(audioPlayerContext, null, 4)}</code>
                </pre>
                <code>current time: {state.trackCurrentTime}</code>
                <br/>
                <code>full time: {state.trackFullTime}</code>
                {this.renderButtonList()}
                {this.renderAudioTag()}
            </>
        );
    }
}
