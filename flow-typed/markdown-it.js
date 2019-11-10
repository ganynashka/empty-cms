// @flow

declare module 'markdown-it' {
    declare export type MarkdownItConfigType = {|
        +html?: boolean,
        +xhtmlOut?: boolean,
        +breaks?: boolean,
        +langPrefix?: string,
        +linkify?: boolean,
        +typographer?: boolean,
        +quotes?: string,
        +highlight?: () => string,
    |};

    declare export default class MarkdownIt {
        constructor(config: MarkdownItConfigType): MarkdownIt,
        render(markdown: string): string,
    }
}
