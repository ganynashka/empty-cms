// @flow

import React, {type Node} from 'react';
import MarkdownIt, {type MarkdownItConfigType} from 'markdown-it';

import markdownStyle from './markdown.style.scss';

type PropsType = {|
    +config?: MarkdownItConfigType,
    +text: string,
|};

const defaultConfig: MarkdownItConfigType = {
    html: false,
    xhtmlOut: false,
    breaks: false,
    langPrefix: 'markdown-lang-prefix',
    linkify: false,
    typographer: false,
    quotes: '“”‘’',
    highlight: (): string => '',
};

export function Markdown(props: PropsType): Node {
    const {config, text} = props;
    const markdown = new MarkdownIt({...defaultConfig, ...config});
    const html = markdown.render(text);

    // eslint-disable-next-line react/no-danger, id-match
    return <div className={markdownStyle.markdown_wrapper} dangerouslySetInnerHTML={{__html: html}}/>;
}
