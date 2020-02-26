// @flow

export type AudioPlayerItemIdType = string | number;

export type AudioPlayerListItemType = {|
    +id?: AudioPlayerItemIdType,
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
    +removeItemFromPlayList: (itemIndex: number) => mixed,
    +removeItemListFromPlayList: (itemIndexList: Array<number>) => mixed,
    +cleanPlayList: () => mixed,
    +playList: Array<AudioPlayerListItemType>,
    +playingState: PlayerPlayingStateType,
    +activeIndex: number,
    +setActiveIndex: (activeIndex: number) => mixed,
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
    +handleOnTrackEnded: () => mixed,
    +handleOnTrackError: () => mixed,
|};
