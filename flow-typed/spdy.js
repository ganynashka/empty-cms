// @flow

// copy from 'https' module

/* eslint-disable id-match, flowtype/no-weak-types */

declare module 'spdy' {
    declare class Server extends tls$Server {
        listen(port?: number, hostname?: string, backlog?: number, callback?: Function): Server,
        // The following signatures are added to allow omitting intermediate arguments
        listen(port?: number, backlog?: number, callback?: Function): Server,
        listen(port?: number, hostname?: string, callback?: Function): Server,
        listen(port?: number, callback?: Function): Server,
        listen(path: string, callback?: Function): Server,
        listen(handle: Object, callback?: Function): Server,
        close(callback?: (error: ?Error) => mixed): Server,
        keepAliveTimeout: number,
        setTimeout(msecs: number, callback: Function): Server,
        timeout: number,
    }

    declare class Agent extends http$Agent {
        createConnection(port: ?number, host: ?string, options: tls$connectOptions): tls$TLSSocket,
        createConnection(port: ?number, options: tls$connectOptions): tls$TLSSocket,
        createConnection(options: tls$connectOptions): tls$TLSSocket,
    }

    declare class ClientRequest extends http$ClientRequest {}

    declare class IncomingMessage extends http$IncomingMessage {}

    declare class ServerResponse extends http$ServerResponse {}

    declare function createServer(
        options: Object,
        requestListener?: (request: IncomingMessage, response: ServerResponse) => void,
    ): Server;

    declare function request(options: Object | string, callback?: (response: IncomingMessage) => void): ClientRequest;

    declare function get(options: Object | string, callback?: (response: IncomingMessage) => void): ClientRequest;

    declare var globalAgent: Agent;
}
