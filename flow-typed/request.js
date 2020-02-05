// @flow

declare module 'request' {
    declare type RequestConfigType = {
        +uri: string,
        +timeout?: number,
    };

    declare type RequestCallbackType = (error?: Error, response: Response, body?: string) => mixed;

    declare export default (config: RequestConfigType, callback: RequestCallbackType) => mixed;
}
