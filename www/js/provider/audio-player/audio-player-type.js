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
export type PlayerRepeatingStateType = 'none' | 'all' | 'one';

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
    +repeatingState: PlayerRepeatingStateType, // repeat from first item if play list is end, default none
    +setRepeatingState: (playerRepeatingState: PlayerRepeatingStateType) => mixed,
    +isShuffleOn: boolean, // play item from random order, default false
    +setShuffleIsEnable: (isShuffleEnable: boolean) => mixed,
    +isAutoPlayOn: boolean, // TODO: remove this setting
    +setAutoPlayIsEnable: (isAutoPlayEnable: boolean) => mixed,
|};
