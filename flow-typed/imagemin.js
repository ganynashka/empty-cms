// @flow

type ImageminConfigResultType = {};

declare module 'imagemin' {
    declare type ImageminConfigType = {
        +destination: string,
        +plugins: Array<ImageminConfigResultType>,
    };

    declare export default function imagemin(
        maskToFileList: Array<string>,
        imageminConfig: ImageminConfigType,
    ): Promise<Error | mixed>;
}

declare module 'imagemin-jpegtran' {
    declare export default function imageminJpegtran(): ImageminConfigResultType;
}

declare module 'imagemin-pngquant' {
    declare type ImageminJpegtranConfigType = {
        +quality: [number, number],
    };

    declare export default function imageminPngquant(
        imageminJpegtranConfig: ImageminJpegtranConfigType,
    ): ImageminConfigResultType;
}
