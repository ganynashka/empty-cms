// @flow

import type {AudioPlayerContextType, AudioPlayerItemIdType, AudioPlayerListItemType} from './audio-player-type';

export const playerPlayingStateTypeMap = {
    playing: 'playing',
    paused: 'paused',
    stopped: 'stopped',
};

export const defaultAudioPlayerContextData: AudioPlayerContextType = {
    addItemToPlayList(item: AudioPlayerListItemType): null {
        return null;
    },
    addItemListToPlayList(itemList: Array<AudioPlayerListItemType>): null {
        return null;
    },
    removeItemFromPlayList(itemId: AudioPlayerItemIdType): null {
        return null;
    },
    removeItemListFromPlayList(itemIdList: Array<AudioPlayerItemIdType>): null {
        return null;
    },
    cleanPlayList(): null {
        return null;
    },
    playList: [],
    playingState: playerPlayingStateTypeMap.stopped,
    activeItemId: null,
    setActiveItemId(activeItemId: AudioPlayerItemIdType): null {
        return null;
    },
    play(): null {
        return null;
    },
    pause(): null {
        return null;
    },
    stop(): null {
        return null;
    },
    next(): null {
        return null;
    },
    prev(): null {
        return null;
    },
    isRepeatOn: false,
    setRepeatIsEnable(isShuffleEnable: boolean): null {
        return null;
    },
    isShuffleOn: false,
    setShuffleIsEnable(isShuffleEnable: boolean): null {
        return null;
    },
    isAutoPlayOn: true,
    setAutoPlayIsEnable(isAutoPlayEnable: boolean): null {
        return null;
    },
};
