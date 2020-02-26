// @flow

import React, {Component, type Node} from 'react';

import {getRandom} from '../../lib/number';

import type {
    AudioPlayerContextType,
    AudioPlayerItemIdType,
    AudioPlayerListItemType,
    PlayerPlayingStateType,
    PlayerRepeatingStateType,
} from './audio-player-type';
import {
    defaultAudioPlayerContextData,
    playerPlayingStateTypeMap,
    playerRepeatingStateTypeMap,
} from './audio-player-const';

type PropsType = {|
    +children: Node,
|};

type StateType = {|
    +playList: Array<AudioPlayerListItemType>,
    +playingState: PlayerPlayingStateType,
    +activeIndex: number,
    +repeatingState: PlayerRepeatingStateType,
    +isShuffleOn: boolean,
    +isAutoPlayOn: boolean,
|};

const audioPlayerContext = React.createContext<AudioPlayerContextType>(defaultAudioPlayerContextData);
const AudioPlayerContextProvider = audioPlayerContext.Provider;

export const AudioPlayerContextConsumer = audioPlayerContext.Consumer;

export class AudioPlayerProvider extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            playList: [],
            playingState: defaultAudioPlayerContextData.playingState,
            activeIndex: defaultAudioPlayerContextData.activeIndex,
            repeatingState: defaultAudioPlayerContextData.repeatingState,
            isShuffleOn: defaultAudioPlayerContextData.isShuffleOn,
            isAutoPlayOn: defaultAudioPlayerContextData.isAutoPlayOn,
        };
    }

    /*
    getPlayListIsEmpty(): boolean {
        const {state} = this;
        const {playList} = state;

        return playList.length === 0;
    }
*/

    addItemToPlayList = (item: AudioPlayerListItemType): null => {
        return this.addItemListToPlayList([item]);
    };

    addItemListToPlayList = (itemList: Array<AudioPlayerListItemType>): null => {
        const {state} = this;
        const {playList, isAutoPlayOn} = state;
        // const isPlayListEmpty = this.getPlayListIsEmpty();

        const newPlayList = [...playList, ...itemList];

        this.setState({playList: newPlayList});

        // if (!isPlayListEmpty) {
        //     return null;
        // }

        // if (newPlayList.length > 0) {
        //     this.setActiveIndex(0);
        // }

        // if (isAutoPlayOn) {
        //     this.play();
        // }

        return null;
    };

    removeItemFromPlayList = (itemId: AudioPlayerItemIdType): null => {
        return null;
    };

    removeItemListFromPlayList = (itemIdList: Array<AudioPlayerItemIdType>): null => {
        return null;
    };

    cleanPlayList = (): null => {
        return null;
    };

    setActiveIndex = (activeIndex: number): null => {
        this.setState({activeIndex});

        return null;
    };

    play = (): null => {
        const {state} = this;
        const {activeIndex, playList} = state;

        if (playList.length === 0) {
            return null;
        }

        if (activeIndex === defaultAudioPlayerContextData.activeIndex) {
            this.setActiveIndex(0);
        }

        this.setState({playingState: playerPlayingStateTypeMap.playing});

        return null;
    };

    pause = (): null => {
        this.setState({playingState: playerPlayingStateTypeMap.paused});

        return null;
    };

    stop = (): null => {
        this.setState({playingState: playerPlayingStateTypeMap.stopped});

        return null;
    };

    next = (): null => {
        const {state} = this;
        const {activeIndex} = state;

        this.handleChangeIndexButton(activeIndex + 1);

        return null;
    };

    prev = (): null => {
        const {state} = this;
        const {activeIndex} = state;

        this.handleChangeIndexButton(activeIndex - 1);

        return null;
    };

    tryToPlayIndex(index: number) {
        const {state} = this;
        const {playList} = state;

        const item = playList[index];

        if (!item) {
            this.setActiveIndex(defaultAudioPlayerContextData.activeIndex);
            this.stop();
            return;
        }

        this.setActiveIndex(index);
    }

    handleChangeIndexButton(nextIndex: number): null {
        const {state} = this;
        const {isShuffleOn, repeatingState, playList} = state;

        if (isShuffleOn) {
            this.tryToPlayIndex(getRandom(0, playList.length));
            return null;
        }

        if ([playerRepeatingStateTypeMap.none, playerRepeatingStateTypeMap.one].includes(repeatingState)) {
            this.tryToPlayIndex(nextIndex);
            return null;
        }

        if (repeatingState === playerRepeatingStateTypeMap.all) {
            this.tryToPlayIndex(nextIndex % playList.length);
            return null;
        }

        console.error('handleOnTrackEnded: Can not get what todo!!!');

        return null;
    }

    // eslint-disable-next-line complexity, max-statements
    handleOnTrackEnded = (): null => {
        const {state} = this;
        const {repeatingState, activeIndex, isShuffleOn, playList} = state;

        if (isShuffleOn) {
            this.tryToPlayIndex(getRandom(0, playList.length));
            return null;
        }

        const nextIndex = activeIndex + 1;

        if (repeatingState === playerRepeatingStateTypeMap.none) {
            this.tryToPlayIndex(nextIndex);
            return null;
        }

        if (repeatingState === playerRepeatingStateTypeMap.one) {
            this.tryToPlayIndex(activeIndex);
            return null;
        }

        if (repeatingState === playerRepeatingStateTypeMap.all) {
            this.tryToPlayIndex(nextIndex % playList.length);
            return null;
        }

        console.error('handleOnTrackEnded: Can not get what todo!!!');

        return null;
    };

    handleOnTrackError = (): null => {
        this.next();

        console.error('handleOnTrackError!!!');

        return null;
    };

    setRepeatingState = (playerRepeatingState: PlayerRepeatingStateType): null => {
        this.setState({repeatingState: playerRepeatingState});

        return null;
    };

    setShuffleIsEnable = (isShuffleEnable: boolean): null => {
        this.setState({isShuffleOn: isShuffleEnable});

        return null;
    };

    setAutoPlayIsEnable = (isAutoPlayEnable: boolean): null => {
        this.setState({isAutoPlayOn: isAutoPlayEnable});

        return null;
    };

    getProviderValue(): AudioPlayerContextType {
        const {state} = this;

        return {
            ...state,
            addItemToPlayList: this.addItemToPlayList,
            addItemListToPlayList: this.addItemListToPlayList,
            removeItemFromPlayList: this.removeItemFromPlayList,
            removeItemListFromPlayList: this.removeItemListFromPlayList,
            cleanPlayList: this.cleanPlayList,
            setActiveIndex: this.setActiveIndex,
            play: this.play,
            pause: this.pause,
            stop: this.stop,
            next: this.next,
            prev: this.prev,
            setRepeatingState: this.setRepeatingState,
            setShuffleIsEnable: this.setShuffleIsEnable,
            setAutoPlayIsEnable: this.setAutoPlayIsEnable,
            handleOnTrackEnded: this.handleOnTrackEnded,
            handleOnTrackError: this.handleOnTrackError,
        };
    }

    render(): Node {
        const {props} = this;
        const {children} = props;

        const providedData = this.getProviderValue();

        return <AudioPlayerContextProvider value={providedData}>{children}</AudioPlayerContextProvider>;
    }
}
