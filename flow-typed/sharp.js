// @flow

declare module 'sharp' {
    declare export type SharpFitResizeNameType = 'contain' | 'cover' | 'fill' | 'inside' | 'outside';

    declare type SharpFitResizeNameMapType = {
        contain: 'contain',
        cover: 'cover',
        fill: 'fill',
        inside: 'inside',
        outside: 'outside',
    };

    declare export var fit: SharpFitResizeNameMapType;

    declare export type SharpKernelResizeNameType = 'nearest' | 'cubic' | 'mitchell' | 'lanczos2' | 'lanczos3';

    declare type SharpKernelResizeNameMapType = {
        nearest: 'nearest',
        cubic: 'cubic',
        mitchell: 'mitchell',
        lanczos2: 'lanczos2',
        lanczos3: 'lanczos3',
    };

    declare export var kernel: SharpKernelResizeNameMapType;

    declare export type SharpResizeConfigType = {
        width: number,
        height: number,
        fit: SharpFitResizeNameType,
        kernel?: SharpKernelResizeNameType,
        withoutEnlargement?: boolean,
    };

    declare class Sharp {
        constructor(pathToFile: string): Sharp,
        resize(config: SharpResizeConfigType): Sharp,
        toFile(pathToNewFile: string): Promise<void>,
    }

    declare export default function sharp(pathToFile: string): Sharp;
}
