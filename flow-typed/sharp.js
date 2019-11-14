// @flow

declare module 'sharp' {
    declare type SharpFitResizeNameType = 'contain' | 'cover' | 'fill' | 'inside' | 'outside';

    declare type SharpFitResizeNameMapType = {
        contain: 'contain',
        cover: 'cover',
        fill: 'fill',
        inside: 'inside',
        outside: 'outside',
    };

    declare export var fit: SharpFitResizeNameMapType;

    declare export type SharpResizeConfigType = {
        width: number,
        height: number,
        fit: SharpFitResizeNameType,
    };

    declare class Sharp {
        constructor(pathToFile: string): Sharp,
        resize(config: SharpResizeConfigType): Sharp,
        toFile(pathToNewFile: string): Promise<void>,
    }

    declare export default function sharp(pathToFile: string): Sharp;
}
