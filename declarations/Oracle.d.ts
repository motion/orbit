export declare type OracleOptions = {
    binPath?: string;
    port: number;
    onMessage: OracleMessageHandler;
};
interface Message {
    message: string;
}
interface TrayBoundsMessage extends Message {
    message: 'trayBounds';
    value: {
        position: [number, number];
        size: [number, number];
    };
}
interface TrayHoverMessage extends Message {
    message: 'trayHover';
    value: {
        id: '0' | '1' | '2' | 'Out';
    };
}
declare type OracleMessage = TrayHoverMessage | TrayBoundsMessage;
declare type Narrow<T, K> = T extends {
    message: K;
} ? T : never;
export declare type OracleMessageHandler = (<K extends OracleMessage['message']>(message: K, value: Narrow<OracleMessage, K>) => void);
export declare class Oracle {
    options: OracleOptions;
    private process;
    private server;
    private socket;
    private resolveSocketConnected;
    private socketConnected;
    constructor(options: OracleOptions);
    start: () => Promise<void>;
    stop: () => Promise<void>;
    send: () => void;
    private runScreenProcess;
    private setupServer;
}
export {};
//# sourceMappingURL=Oracle.d.ts.map