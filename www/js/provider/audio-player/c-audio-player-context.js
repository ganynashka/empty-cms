// @flow

import React, {Component, type Node} from 'react';

import type {AudioPlayerContextType} from './audio-player-type';
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

    getProviderValue(): AudioPlayerContextType {
        const {state} = this;
        const {providedData} = state;

        return {...providedData};
    }

    render(): Node {
        const {props} = this;
        const {children} = props;

        const providedData = this.getProviderValue();

        return <AudioPlayerContextProvider value={providedData}>{children}</AudioPlayerContextProvider>;
    }
}
