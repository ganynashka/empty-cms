// @flow

import React, {Component, type Node} from 'react';

import type {AudioPlayerContextType} from '../../audio-player-type';
import {AudioPlayerContextConsumer} from '../../c-audio-player-context';

type PropsType = {};

type StateType = null;

export class AudioPlayerControl extends Component<PropsType, StateType> {
    renderContent(audioPlayerContextData: AudioPlayerContextType): Node {
        const handlePrev = audioPlayerContextData.prev;
        const handlePlay = audioPlayerContextData.play;
        const handlePause = audioPlayerContextData.pause;
        const handleStop = audioPlayerContextData.stop;
        const handleNext = audioPlayerContextData.next;

        return (
            <>
                <pre>
                    <code>{JSON.stringify(audioPlayerContextData, null, 4)}</code>
                </pre>
                <button onClick={handlePrev} type="button">
                    prev
                </button>
                <button onClick={handlePlay} type="button">
                    play
                </button>
                <button onClick={handlePause} type="button">
                    pause
                </button>
                <button onClick={handleStop} type="button">
                    stop
                </button>
                <button onClick={handleNext} type="button">
                    next
                </button>
            </>
        );
    }

    render(): Node {
        return (
            <AudioPlayerContextConsumer>
                {(audioPlayerContext: AudioPlayerContextType): Node => this.renderContent(audioPlayerContext)}
            </AudioPlayerContextConsumer>
        );
    }
}
