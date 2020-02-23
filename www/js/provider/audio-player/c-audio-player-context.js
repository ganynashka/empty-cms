// @flow

import React, {Component, type Node} from 'react';

import type {AudioPlayerContextType, AudioPlayerListItemType} from './audio-player-type';
import {defaultAudioPlayerContextData} from './audio-player-const';

type PropsType = {|
    +children: Node,
|};

type StateType = {|
    +providedData: AudioPlayerContextType,
|};

const audioPlayerContext = React.createContext<AudioPlayerContextType>(defaultAudioPlayerContextData);
const AudioPlayerContextProvider = audioPlayerContext.Provider;

export const AudioPlayerContextConsumer = audioPlayerContext.Consumer;

export class AudioPlayerProvider extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            providedData: defaultAudioPlayerContextData,
        };
    }

    addItemToPlayList = (item: AudioPlayerListItemType): null => {
        return null;
    };

    addItemListToPlayList = (itemList: Array<AudioPlayerListItemType>): null => {
        return null;
    };

    removeItemFromPlayList = (itemId: string): null => {
        return null;
    };

    removeItemListFromPlayList = (itemIdList: Array<string>): null => {
        return null;
    };

    cleanPlayList = (): null => {
        return null;
    };

    setActiveItem = (itemId: string): null => {
        return null;
    };

    play = (): null => {
        return null;
    };

    pause = (): null => {
        return null;
    };

    stop = (): null => {
        return null;
    };

    next = (): null => {
        return null;
    };

    prev = (): null => {
        return null;
    };

    setRepeatIsEnable = (isShuffleEnable: boolean): null => {
        return null;
    };

    setShuffleIsEnable = (isShuffleEnable: boolean): null => {
        return null;
    };

    getProviderValue(): AudioPlayerContextType {
        const {state} = this;
        const {providedData} = state;

        return {
            ...providedData,
            addItemToPlayList: this.addItemToPlayList,
            addItemListToPlayList: this.addItemListToPlayList,
            removeItemFromPlayList: this.removeItemFromPlayList,
            removeItemListFromPlayList: this.removeItemListFromPlayList,
            cleanPlayList: this.cleanPlayList,
            setActiveItem: this.setActiveItem,
            play: this.play,
            pause: this.pause,
            stop: this.stop,
            next: this.next,
            prev: this.prev,
            setRepeatIsEnable: this.setRepeatIsEnable,
            setShuffleIsEnable: this.setShuffleIsEnable,
        };
    }

    render(): Node {
        const {props} = this;
        const {children} = props;

        const providedData = this.getProviderValue();

        return <AudioPlayerContextProvider value={providedData}>{children}</AudioPlayerContextProvider>;
    }
}
