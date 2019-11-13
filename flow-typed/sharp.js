// @flow

declare module 'sharp' {
    declare class Sharp {
        constructor(pathToFile: string): Sharp,
    }

    declare type SharpFitResizeNameType = 'contain' | 'cover' | 'fill' | 'inside' | 'outside';

    declare type SharpFitResizeNameMapType = {
        contain: 'contain',
        cover: 'cover',
        fill: 'fill',
        inside: 'inside',
        outside: 'outside'
    };

    declare export var fit: SharpFitResizeNameMapType;

    declare export default function sharp(pathToFile: string): Sharp;

}
