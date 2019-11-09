// @flow

declare module 'markdown-it' {
    declare type MarkdownItConfig = {
        html: boolean,
        xhtmlOut: boolean,
        breaks: boolean,
        langPrefix: string,
        linkify: boolean,
        typographer: boolean,
        quotes: string,
        highlight?: () => string,
    };

    declare export default class MarkdownIt {
        constructor(config: MarkdownItConfig): MarkdownIt,
        renderInline(markdown: string): string,
    }
}
