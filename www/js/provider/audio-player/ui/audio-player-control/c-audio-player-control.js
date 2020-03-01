// @flow

import React, {Component, type Node} from 'react';
import classNames from 'classnames';

import type {AudioPlayerContextType, PlayerPlayingStateType} from '../../audio-player-type';
import {
    defaultAudioPlayerContextData,
    playerPlayingStateTypeMap,
    playerRepeatingStateTypeList,
    playerRepeatingStateTypeMap,
} from '../../audio-player-const';

import imageButtonNextTrack from './image/button-next-track.png';
import imageButtonPause from './image/button-pause.png';
import imageButtonPlay from './image/button-play.png';
import imageButtonPlayList from './image/button-play-list.png';
import imageButtonPrevTrack from './image/button-prev-track.png';
import imageButtonRepeat from './image/button-repeat.png';
import imageButtonRepeatOne from './image/button-repeat-one.png';
import imageButtonShuffle from './image/button-shuffle.png';
import imageButtonSoundOff from './image/button-sound-off.png';
import imageButtonSoundOn from './image/button-sound-on.png';
import imageButtonStop from './image/button-stop.png';

import audioPlayerControlStyle from './audio-player-control.scss';
import {AudioPlayerControlButton} from './c-audio-player-control-button';

type PropsType = {|
    +audioPlayerContext: AudioPlayerContextType,
|};

type StateType = {|
    +trackCurrentTime: number,
    +trackFullTime: number,
    +trackVolume: number,
    +isMuted: boolean,
    +refAudio: {current: HTMLAudioElement | null},
    +isProgressBarActive: boolean,
|};

const volumeMultiplier = 100;

export class AudioPlayerControl extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            trackCurrentTime: 0,
            trackFullTime: 0,
            trackVolume: 0.5,
            isMuted: false,
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
        const handleToggleRepeat = audioPlayerContext.toggleRepeatingState;
        const handleNext = audioPlayerContext.next;
        const handleToggleShuffle = audioPlayerContext.toggleShuffleIsEnable;
        const handleTogglePlayListIsOpen = audioPlayerContext.togglePlayListIsOpen;
        const {isShuffleOn, playingState, repeatingState, isPlayListOpen} = audioPlayerContext;
        const {one: repeatOne, all: repeatAll} = playerRepeatingStateTypeMap;
        const {playing: playingStatePlaying} = playerPlayingStateTypeMap;

        return (
            <div className={audioPlayerControlStyle.audio_player_control__button__list}>
                <AudioPlayerControlButton
                    alt="shuffle"
                    imageSrc={imageButtonShuffle}
                    isActive={isShuffleOn}
                    onClick={handleToggleShuffle}
                />

                <AudioPlayerControlButton
                    alt="repeat"
                    imageSrc={repeatingState === repeatOne ? imageButtonRepeatOne : imageButtonRepeat}
                    isActive={[repeatOne, repeatAll].includes(repeatingState)}
                    onClick={handleToggleRepeat}
                />

                <AudioPlayerControlButton alt="prev" imageSrc={imageButtonPrevTrack} onClick={handlePrev}/>

                {playingState !== playingStatePlaying
                    ? <AudioPlayerControlButton alt="play" imageSrc={imageButtonPlay} onClick={handlePlay}/>
                    : <AudioPlayerControlButton alt="pause" imageSrc={imageButtonPause} onClick={handlePause}/>}

                <AudioPlayerControlButton alt="next" imageSrc={imageButtonNextTrack} onClick={handleNext}/>
                <AudioPlayerControlButton
                    alt="playlist"
                    imageSrc={imageButtonPlayList}
                    isActive={isPlayListOpen}
                    onClick={handleTogglePlayListIsOpen}
                />
            </div>
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
        const {trackVolume} = state;
        const audioNode = evt.currentTarget;

        audioNode.volume = trackVolume;

        if (playingState !== playerPlayingStateTypeMap.playing) {
            return null;
        }

        audioNode.play();

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
        const volume = parseInt(currentTarget.value, 10) / volumeMultiplier;

        const {refAudio} = state;
        const audioNode = refAudio.current;

        this.setState({trackVolume: volume});

        if (!audioNode) {
            console.error('handleChangeVolumeBar: audioNode is null');
            return;
        }

        audioNode.volume = volume;
    };

    handleToggleMute = () => {
        const {state} = this;
        const {isMuted, refAudio, trackVolume} = state;
        const audioNode = refAudio.current;
        const newIsMutedState = !isMuted;

        this.setState({isMuted: newIsMutedState});

        if (!audioNode) {
            console.error('handleToggleMute: audioNode is null');
            return;
        }

        audioNode.volume = newIsMutedState ? 0 : trackVolume;
    };

    renderVolumeBar(): Node {
        const {state} = this;
        const {trackVolume, isMuted} = state;

        return (
            <>
                <button onClick={this.handleToggleMute} type="button">
                    mute [isMuted: {isMuted ? 'yes' : 'no'}]
                </button>
                <input
                    defaultValue={trackVolume * volumeMultiplier}
                    key="volume"
                    max={volumeMultiplier}
                    // eslint-disable-next-line react/jsx-handler-names
                    min="0"
                    onChange={this.handleChangeVolumeBar}
                    type="range"
                />
            </>
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
        const {refAudio} = state;
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
                ref={refAudio}
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
                <hr/>
                {this.renderProgressBar()}
                <hr/>
                {this.renderVolumeBar()}
                <hr/>
                <code>current time: {state.trackCurrentTime}</code>
                <br/>
                <code>full time: {state.trackFullTime}</code>
                <br/>
                {/*
                {this.renderRepeatButton()}
                <br/>
                {this.renderShuffleButton()}
*/}

                {this.renderAudioTag()}

                <br/>
                <br/>
                <br/>
                <br/>
                <br/>

                <div className={audioPlayerControlStyle.audio_player_control__wrapper}>
                    {this.renderMainButtonList()}
                </div>
            </>
        );
    }
}
