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
    // progressive: true, arithmetic: true
    declare type ImageminJpegtranConfigType = {
        +progressive?: boolean,
        +arithmetic?: boolean,
    };

    declare export default function imageminJpegtran(
        jpegtranConfig?: ImageminJpegtranConfigType,
    ): ImageminConfigResultType;
}

declare module 'imagemin-pngquant' {
    declare type ImageminPngquantConfigType = {
        +quality: [number, number],
    };

    declare export default function imageminPngquant(
        pngquantConfig: ImageminPngquantConfigType,
    ): ImageminConfigResultType;
}
