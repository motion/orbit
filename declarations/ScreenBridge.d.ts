import { Server } from 'ws';
declare type Props = {
    port: number;
    getActions: () => Object;
    setState: Function;
    getState: Function;
};
export declare type SocketSender = (action: string, data?: Object) => void;
declare type BridgeHandlers = {
    socketSend: SocketSender;
};
export declare class ScreenBridge {
    props: Props;
    server: Server;
    port: number;
    awaitingSocket: any[];
    socket: any;
    constructor(props: Props);
    private getServer;
    start: (cb: (handlers: BridgeHandlers) => void) => Promise<void>;
    onConnected(): Promise<{}>;
    stop: () => Promise<void>;
    socketSend: (action: any, data?: any) => Promise<void>;
    private setupSocket;
}
export {};
//# sourceMappingURL=ScreenBridge.d.ts.map