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
        json: () => () => string,
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

declare module 'express-fileupload' {
    declare export type ExpressFileUploadOptionType = {
        createParentPath: boolean, // recommended -> true
    };

    declare export type ExpressFormDataFileMvCallBackType = (error: Error | mixed) => mixed;

    declare export type ExpressFormDataFileMvType = (
        pathToFile: string,
        writeCallBack: ExpressFormDataFileMvCallBackType,
    ) => mixed;

    declare export type ExpressFormDataFileType = {
        name: string,
        data: Buffer,
        size: number,
        encoding: string,
        tempFilePath: string,
        truncated: boolean,
        mimetype: string,
        md5: string,
        mv: ExpressFormDataFileMvType,
    };

    declare export default function fileUpload(option: ExpressFileUploadOptionType): string;
}
