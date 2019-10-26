// @flow

declare module 'compression' {
    declare export default function compression(): string;
}

declare module 'cors' {
    declare export default function cors(): string;
}

declare module 'body-parser' {
    declare type BodyParser = {
        urlencoded: (setting: {extended: boolean}) => () => string,
    };

    declare export default BodyParser;
}

declare module 'express-session' {
    declare export type ExpressSessionOptionType = {
        +name: string,
        +secret: string,
        +resave: boolean,
        +saveUninitialized: boolean,
        +cookie?: {
            +secure?: boolean, // httpS required
        },
    };

    declare export default function session(option: ExpressSessionOptionType): string;
}
