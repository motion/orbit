import Observable from 'zen-observable';
import { TransportRequestType, TransportRequestValues, TransportResponse } from '../common';
import { ClientTransport } from './ClientTransport';
export declare class WebSocketClientTransport implements ClientTransport {
    websocket: WebSocket;
    name: string;
    operationsCounter: number;
    subscriptions: {
        id: number;
        type: string;
        name: string;
        onSuccess: (response: TransportResponse) => any;
        onError: Function;
    }[];
    private onConnectedCallbacks;
    constructor(name: string, websocket: any);
    observe(type: TransportRequestType, values: TransportRequestValues): Observable<TransportResponse>;
    execute(type: TransportRequestType, values: TransportRequestValues): Promise<TransportResponse>;
    private handleData;
}
//# sourceMappingURL=WebSocketClientTransport.d.ts.map