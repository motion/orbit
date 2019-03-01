import RWebSocket from 'reconnecting-websocket';
import { SocketManager } from './SocketManager';
export * from './proxySetters';
export declare const WebSocket: any;
export declare const ReconnectingWebSocket: typeof RWebSocket;
declare type Disposer = () => void;
declare type LastMessage = {
    message: string;
    at: number;
};
export declare type BridgeOptions = {
    master?: boolean;
    ignoreSelf?: boolean;
    waitForInitialState?: boolean;
    stores?: Object;
    actions?: {
        [key: string]: Function;
    };
};
export declare class BridgeManager {
    port: number;
    socketManager: SocketManager;
    started: boolean;
    stores: {};
    messageListeners: Set<any>;
    lastMessage: LastMessage;
    receivedInitialState: Object;
    private awaitingSocket;
    private store;
    private options;
    private isSocketOpen;
    private source;
    private initialState;
    private socket;
    private afterInitialState;
    private finishInitialState;
    readonly state: any;
    start: (store: any, initialState: any, options?: BridgeOptions) => Promise<void>;
    private setupMaster;
    setupClientSocket: () => void;
    getInitialState: () => void;
    onOpenSocket: () => Promise<{}>;
    setState: (newState: any, ignoreSend?: any) => any;
    private sendChangedState;
    queuedState: any[];
    private scheduleSendState;
    sendQueuedState: (queue: any) => void;
    updateStateWithDiff(stateObj: Object, newState: Object, { ignoreKeyCheck, onlyKeys }?: {
        ignoreKeyCheck?: boolean;
        onlyKeys?: any;
    }): any;
    handleMessage: ({ message, value }: {
        message: any;
        value: any;
    }) => void;
    onMessage: (a: any, b?: any) => Disposer;
    sendMessage: (Store: any, message: string, value?: string | Object) => Promise<void>;
    dispose: () => void;
}
export declare const Bridge: BridgeManager;
//# sourceMappingURL=Bridge.d.ts.map