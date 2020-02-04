// @flow

/* global HTMLAudioElement */

import React, {Component, type Node} from 'react';
import MarkdownIt, {type MarkdownItConfigType} from 'markdown-it';
import classNames from 'classnames';

import markdownStyle from './markdown.style.scss';

type PropsType = {|
    +config?: MarkdownItConfigType,
    +text: string,
    +additionalClassName?: string,
|};

type StateType = {|
    +wrapperRef: {current: HTMLElement | null},
|};

const defaultConfig: MarkdownItConfigType = {
    html: true,
    xhtmlOut: true,
    breaks: true,
    langPrefix: 'markdown-lang-prefix--',
    linkify: false,
    typographer: false,
    quotes: '“”‘’',
    highlight: (): string => '',
};

export class Markdown extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            wrapperRef: React.createRef<HTMLElement>(),
        };
    }

    componentDidMount() {
        this.setupAudioHelper();
    }

    pauseAllExcept(currentAudioNode: HTMLAudioElement) {
        const {state} = this;
        const {wrapperRef} = state;
        const wrapperNode = wrapperRef.current;

        if (!wrapperNode) {
            return;
        }

        const audioNodeList = wrapperNode.querySelectorAll('audio');

        audioNodeList.forEach((audioNode: HTMLElement) => {
            if (audioNode instanceof HTMLAudioElement && audioNode !== currentAudioNode) {
                audioNode.pause();
            }
        });
    }

    setupAudioHelper() {
        const {state} = this;
        const {wrapperRef} = state;
        const wrapperNode = wrapperRef.current;

        if (!wrapperNode) {
            return;
        }

        const audioNodeList = wrapperNode.querySelectorAll('audio');

        audioNodeList.forEach((audioNode: HTMLElement) => {
            if (audioNode instanceof HTMLAudioElement) {
                audioNode.addEventListener(
                    'play',
                    () => {
                        this.pauseAllExcept(audioNode);
                    },
                    false
                );
            }
        });
    }

    render(): Node {
        const {props, state} = this;
        const {config, text, additionalClassName} = props;
        const markdown = new MarkdownIt({...defaultConfig, ...config});
        const html = markdown.render(text);

        return (
            <div
                className={classNames(markdownStyle.markdown_wrapper, additionalClassName || '')}
                // eslint-disable-next-line react/no-danger, id-match
                dangerouslySetInnerHTML={{__html: html}}
                ref={state.wrapperRef}
            />
        );
    }
}
