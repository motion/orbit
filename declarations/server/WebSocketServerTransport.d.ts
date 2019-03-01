import { ServerTransport, TransportRequest, TransportResponse } from '../index';
export declare class WebSocketServerTransport implements ServerTransport {
    private websocket;
    private clients;
    private onCallbacks;
    constructor(options: {
        port: number;
    });
    onMessage(callback: (data: TransportRequest) => void): void;
    send(data: TransportResponse): void;
}
//# sourceMappingURL=WebSocketServerTransport.d.ts.map