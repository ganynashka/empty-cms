// @flow

import React, {Component, type Node} from 'react';

import type {
    AudioPlayerContextType,
    AudioPlayerItemIdType,
    AudioPlayerListItemType,
    PlayerPlayingStateType,
    PlayerRepeatingStateType,
} from './audio-player-type';
import {defaultAudioPlayerContextData, playerPlayingStateTypeMap} from './audio-player-const';

type PropsType = {|
    +children: Node,
|};

type StateType = {|
    +playList: Array<AudioPlayerListItemType>,
    +playingState: PlayerPlayingStateType,
    +activeItemId: AudioPlayerItemIdType | null,
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
            playList: defaultAudioPlayerContextData.playList,
            playingState: defaultAudioPlayerContextData.playingState,
            activeItemId: defaultAudioPlayerContextData.activeItemId,
            repeatingState: defaultAudioPlayerContextData.repeatingState,
            isShuffleOn: defaultAudioPlayerContextData.isShuffleOn,
            isAutoPlayOn: defaultAudioPlayerContextData.isAutoPlayOn,
        };
    }

    getPlayListIsEmpty(): boolean {
        const {state} = this;
        const {playList} = state;

        return playList.length === 0;
    }

    addItemToPlayList = (item: AudioPlayerListItemType): null => {
        return this.addItemListToPlayList([item]);
    };

    addItemListToPlayList = (itemList: Array<AudioPlayerListItemType>): null => {
        const {state} = this;
        const {playList, isAutoPlayOn} = state;
        const isPlayListEmpty = this.getPlayListIsEmpty();

        const newPlayList = [...playList, ...itemList];

        this.setState({playList: newPlayList});

        if (!isPlayListEmpty) {
            return null;
        }

        if (newPlayList.length > 0) {
            this.setActiveItemId(newPlayList[0].id);
        }

        if (isAutoPlayOn) {
            this.play();
        }

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

    setActiveItemId = (activeItemId: AudioPlayerItemIdType): null => {
        this.setState({activeItemId});

        return null;
    };

    play = (): null => {
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
        return null;
    };

    prev = (): null => {
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
            setActiveItemId: this.setActiveItemId,
            play: this.play,
            pause: this.pause,
            stop: this.stop,
            next: this.next,
            prev: this.prev,
            setRepeatingState: this.setRepeatingState,
            setShuffleIsEnable: this.setShuffleIsEnable,
            setAutoPlayIsEnable: this.setAutoPlayIsEnable,
        };
    }

    render(): Node {
        const {props} = this;
        const {children} = props;

        const providedData = this.getProviderValue();

        return <AudioPlayerContextProvider value={providedData}>{children}</AudioPlayerContextProvider>;
    }
}
