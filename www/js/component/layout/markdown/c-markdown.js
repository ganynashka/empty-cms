// @flow

import React, {type Node} from 'react';
import MarkdownIt, {type MarkdownItConfigType} from 'markdown-it';
import classNames from 'classnames';

import markdownStyle from './markdown.style.scss';

type PropsType = {|
    +config?: MarkdownItConfigType,
    +text: string,
    +additionalClassName?: string,
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
    const {config, text, additionalClassName} = props;
    const markdown = new MarkdownIt({...defaultConfig, ...config});
    const html = markdown.render(text);

    return (
        <div
            className={classNames(markdownStyle.markdown_wrapper, additionalClassName || '')}
            // eslint-disable-next-line react/no-danger, id-match
            dangerouslySetInnerHTML={{__html: html}}
        />
    );
}
