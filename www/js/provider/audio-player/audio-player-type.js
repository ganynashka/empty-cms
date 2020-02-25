// @flow

export type AudioPlayerItemIdType = string | number;

export type AudioPlayerListItemType = {|
    +id: AudioPlayerItemIdType,
    +src: string,
    +title?: string,
    +artist?: string,
    +album?: string,
|};

export type PlayerPlayingStateType = 'playing' | 'paused' | 'stopped';

export type AudioPlayerContextType = {|
    +addItemToPlayList: (item: AudioPlayerListItemType) => mixed,
    +addItemListToPlayList: (itemList: Array<AudioPlayerListItemType>) => mixed,
    +removeItemFromPlayList: (itemId: AudioPlayerItemIdType) => mixed,
    +removeItemListFromPlayList: (itemIdList: Array<AudioPlayerItemIdType>) => mixed,
    +cleanPlayList: () => mixed,
    +playList: Array<AudioPlayerListItemType>,
    +playingState: PlayerPlayingStateType,
    +activeItemId: AudioPlayerItemIdType | null,
    +setActiveItemId: (activeItemId: AudioPlayerItemIdType) => mixed,
    +play: () => mixed,
    +pause: () => mixed,
    +stop: () => mixed,
    +next: () => mixed,
    +prev: () => mixed,
    +isRepeatOn: boolean, // repeat from first item if play list is end, default false
    +setRepeatIsEnable: (isShuffleEnable: boolean) => mixed,
    +isShuffleOn: boolean, // play item from random order, default false
    +setShuffleIsEnable: (isShuffleEnable: boolean) => mixed,
    +isAutoPlayOn: boolean, // auto play item if item (items) has been added into empty playlist, default true
    +setAutoPlayIsEnable: (isAutoPlayEnable: boolean) => mixed,
|};
