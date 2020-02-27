// @flow

/* global document */

import React, {Component, type Node} from 'react';

import type {AudioPlayerContextType, PlayerPlayingStateType} from '../../audio-player-type';
import {defaultAudioPlayerContextData, playerPlayingStateTypeMap} from '../../audio-player-const';

type PropsType = {|
    +audioPlayerContext: AudioPlayerContextType,
|};

type StateType = {|
    +trackCurrentTime: number,
    +trackFullTime: number,
    +trackVolume: number,
    +refAudio: {current: HTMLAudioElement | null},
    +isProgressBarActive: boolean,
|};

export class AudioPlayerControl extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            trackCurrentTime: 0,
            trackFullTime: 0,
            trackVolume: 0.5,
            refAudio: React.createRef<HTMLAudioElement>(),
            isProgressBarActive: false,
        };
    }

    componentDidUpdate(prevProps: PropsType, prevState: StateType) {
        const {props} = this;
        const {audioPlayerContext} = props;

        if (prevProps.audioPlayerContext.playingState !== audioPlayerContext.playingState) {
            this.updatePlayingState();
        }
    }

    // eslint-disable-next-line complexity, max-statements
    updatePlayingState() {
        const {props, state} = this;
        const {audioPlayerContext} = props;
        const {refAudio} = state;
        const audioNode = refAudio.current;

        if (audioPlayerContext.activeIndex === defaultAudioPlayerContextData.activeIndex) {
            console.log('player is not play default active index');
            return;
        }

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

    renderMainButtonList(): Node {
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
                <span>&nbsp;|&nbsp;</span>
                <button onClick={handlePlay} type="button">
                    play
                </button>
                <span>&nbsp;|&nbsp;</span>
                <button onClick={handlePause} type="button">
                    pause
                </button>
                <span>&nbsp;|&nbsp;</span>
                <button onClick={handleStop} type="button">
                    stop
                </button>
                <span>&nbsp;|&nbsp;</span>
                <button onClick={handleNext} type="button">
                    next
                </button>
            </div>
        );
    }

    renderRepeatButton(): Node {
        const {props} = this;
        const {audioPlayerContext} = props;

        const handleToggleRepeat = audioPlayerContext.toggleRepeatingState;

        return (
            <button onClick={handleToggleRepeat} type="button">
                repeat, current is [{audioPlayerContext.repeatingState}]
            </button>
        );
    }

    renderShuffleButton(): Node {
        const {props} = this;
        const {audioPlayerContext} = props;

        const handleToggleShuffle = audioPlayerContext.toggleShuffleIsEnable;

        return (
            <button onClick={handleToggleShuffle} type="button">
                shuffle, current is [{audioPlayerContext.isShuffleOn ? 'on' : 'off'}]
            </button>
        );
    }

    handleOnTimeUpdate = (evt: SyntheticEvent<HTMLAudioElement>) => {
        const {state} = this;

        if (state.isProgressBarActive) {
            return;
        }

        this.setState({trackCurrentTime: evt.currentTarget.currentTime});
    };

    handleOnLoadedMetadata = (evt: SyntheticEvent<HTMLAudioElement>) => {
        this.setState({
            trackCurrentTime: 0,
            trackFullTime: evt.currentTarget.duration,
        });
    };

    handleOnCanPlay = (evt: SyntheticEvent<HTMLAudioElement>): null => {
        const {props, state} = this;
        const {audioPlayerContext} = props;
        const {playingState} = audioPlayerContext;
        const {refAudio, trackVolume} = state;
        const audioNode = refAudio.current;

        if (!audioNode) {
            console.error('handleOnCanPlay: audioNode is null');
            return null;
        }

        audioNode.volume = trackVolume;

        if (playingState !== playerPlayingStateTypeMap.playing) {
            return null;
        }

        evt.currentTarget.play();

        return null;
    };

    handleProgressBarActive = () => {
        this.setState({isProgressBarActive: true});
    };

    handleProgressBarInactive = (evt: SyntheticEvent<HTMLInputElement>) => {
        this.setState({isProgressBarActive: false});
    };

    handleProgressBarChange = (evt: SyntheticEvent<HTMLInputElement>) => {
        const {state} = this;
        const {refAudio} = state;
        const audioNode = refAudio.current;
        const {currentTarget} = evt;
        const value = parseFloat(currentTarget.value) || 0;

        if (!audioNode) {
            console.error('handleProgressBarChange: audioNode is null');
            return;
        }

        audioNode.currentTime = value;

        this.setState({
            trackCurrentTime: value,
        });
    };

    handleChangeVolumeBar = (evt: SyntheticEvent<HTMLInputElement>) => {
        const {state} = this;
        const {currentTarget} = evt;
        const volume = parseInt(currentTarget.value, 10) / 100;

        const {refAudio} = state;
        const audioNode = refAudio.current;

        if (!audioNode) {
            console.error('handleChangeVolumeBar: audioNode is null');
            return;
        }

        this.setState({trackVolume: volume});

        audioNode.volume = volume;
    };

    renderVolumeBar(): Node {
        const {state} = this;
        const {trackVolume} = state;

        return (
            <input
                defaultValue={trackVolume * 100}
                key="volume"
                max="100"
                // eslint-disable-next-line react/jsx-handler-names
                min="0"
                onChange={this.handleChangeVolumeBar}
                type="range"
            />
        );
    }

    renderProgressBar(): Node {
        const {props, state} = this;
        const {audioPlayerContext} = props;
        const {trackCurrentTime, trackFullTime} = state;

        return (
            <>
                <input
                    disabled={trackFullTime === 0}
                    key={audioPlayerContext.activeIndex + '-display'}
                    max={trackFullTime}
                    min="0"
                    // eslint-disable-next-line react/jsx-handler-names
                    onChange={parseFloat}
                    type="range"
                    value={trackCurrentTime}
                />
                <input
                    defaultValue="0"
                    disabled={trackFullTime === 0}
                    key={audioPlayerContext.activeIndex}
                    max={trackFullTime}
                    min="0"
                    onChange={this.handleProgressBarChange}
                    onMouseDown={this.handleProgressBarActive}
                    onMouseUp={this.handleProgressBarInactive}
                    type="range"
                />
            </>
        );
    }

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
                <pre>{/* <code>{JSON.stringify(audioPlayerContext, null, 4)}</code>*/}</pre>

                <hr/>
                {this.renderProgressBar()}
                <hr/>

                {this.renderVolumeBar()}
                <hr/>

                {/* <code>current time: {state.trackCurrentTime}</code>*/}
                <br/>
                <code>full time: {state.trackFullTime}</code>
                <br/>
                {this.renderRepeatButton()}
                <br/>
                {this.renderShuffleButton()}

                {this.renderMainButtonList()}
                {this.renderAudioTag()}
            </>
        );
    }
}
