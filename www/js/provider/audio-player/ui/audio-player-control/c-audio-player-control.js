// @flow

/* global document */

import React, {Component, type Node} from 'react';

import type {AudioPlayerContextType} from '../../audio-player-type';
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
            console.error('audioNode is null');
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

    handleOnTimeUpdate = (evt: SyntheticEvent<HTMLAudioElement>) => {
        this.setState({trackCurrentTime: evt.currentTarget.currentTime});
    };

    handleOnLoadedMetadata = (evt: SyntheticEvent<HTMLAudioElement>) => {
        this.setState({trackFullTime: evt.currentTarget.duration});
    };

    handleOnCanPlay = (evt: SyntheticEvent<HTMLAudioElement>): null => {
        const {props} = this;
        const {audioPlayerContext} = props;
        const {playingState} = audioPlayerContext;

        if (playingState !== playerPlayingStateTypeMap.playing) {
            return null;
        }

        evt.currentTarget.play();

        return null;
    };

    renderAudioTag(): Node {
        const {props, state} = this;
        const {audioPlayerContext} = props;
        const {activeIndex, playList} = audioPlayerContext;
        const activeItem = playList[activeIndex];

        if (!activeItem) {
            return null;
        }

        const {src} = activeItem;

        return (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <audio
                controls
                key={activeIndex + '-' + src}
                onCanPlay={this.handleOnCanPlay}
                onEnded={audioPlayerContext.handleOnTrackEnded}
                onError={audioPlayerContext.handleOnTrackError}
                onLoadedMetadata={this.handleOnLoadedMetadata}
                onTimeUpdate={this.handleOnTimeUpdate}
                preload="metadata"
                ref={state.refAudio}
                src={src}
            />
        );
    }

    render(): Node {
        const {props, state} = this;
        const {audioPlayerContext} = props;

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
