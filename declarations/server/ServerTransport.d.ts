import { TransportRequest, TransportResponse } from '../common';
export interface ServerTransport {
    onMessage(callback: (data: TransportRequest) => void): void;
    send(data: TransportResponse): any;
}
//# sourceMappingURL=ServerTransport.d.ts.map