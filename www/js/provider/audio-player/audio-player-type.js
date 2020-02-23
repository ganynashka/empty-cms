// @flow

export type AudioPlayerListItemType = {|
    +id: string,
    +src: string,
    +title?: string,
    +artist?: string,
    +album?: string,
|};

export type PlayerPlayingStateType = 'playing' | 'paused' | 'stopped';

export type AudioPlayerContextType = {|
    +addItemToPlayList: (item: AudioPlayerListItemType) => mixed,
    +addItemListToPlayList: (itemList: Array<AudioPlayerListItemType>) => mixed,
    +removeItemFromPlayList: (itemId: string) => mixed,
    +removeItemListFromPlayList: (itemIdList: Array<string>) => mixed,
    +cleanPlayList: () => mixed,
    +playList: Array<AudioPlayerListItemType>,
    +playingState: PlayerPlayingStateType,
    +activeItem: AudioPlayerListItemType | null,
    +setActiveItem: (itemId: string) => mixed,
    +play: () => mixed,
    +pause: () => mixed,
    +stop: () => mixed,
    +next: () => mixed,
    +prev: () => mixed,
    +isRepeatOn: boolean,
    +setRepeatIsEnable: (isShuffleEnable: boolean) => mixed,
    +isShuffleOn: boolean,
    +setShuffleIsEnable: (isShuffleEnable: boolean) => mixed,
    +isAutoPlayOn: boolean,
    +setAutoPlayIsEnable: (isAutoPlayEnable: boolean) => mixed,
|};
