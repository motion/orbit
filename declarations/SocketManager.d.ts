import { Server } from 'ws';
export declare class SocketManager {
    activeSockets: any[];
    onState: Function;
    actions: {
        getInitialState?: Function;
        onMessage: Function;
    };
    port: number;
    server: Server;
    masterSource: string;
    constructor({ port, actions, onState, masterSource }: {
        port: any;
        actions: any;
        onState: any;
        masterSource: any;
    });
    start(): Promise<void>;
    dispose(): void;
    readonly hasListeners: boolean;
    sendInitialState: (socket: any, initialState: Object) => void;
    sendState: (socket: any, state: Object, source: any) => void;
    sendMessage: (data: {
        to: string;
        message: string;
        value?: any;
    }) => void;
    sendAll: (source: string, state: Object, { skipUID }?: {
        skipUID?: number;
    }) => void;
    removeSocket: (uid: any) => void;
    identities: {};
    decorateSocket: (uid: any, socket: any) => void;
    setupSocket(): void;
}
//# sourceMappingURL=SocketManager.d.ts.map