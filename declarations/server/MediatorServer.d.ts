import { Command, Model } from '../common';
import { ServerTransport } from './ServerTransport';
import { ResolveInterface } from './ResolveInterface';
import { MediatorClient } from '..';
export interface MediatorServerOptions {
    transport: ServerTransport;
    fallbackClient?: MediatorClient;
    resolvers: ResolveInterface<any, any, any>[];
    commands: Command<any, any>[];
    models: Model<any, any>[];
}
export declare class MediatorServer {
    options: MediatorServerOptions;
    private subscriptions;
    dataIds: string[];
    constructor(options: MediatorServerOptions);
    bootstrap(): void;
    private handleMessage;
}
//# sourceMappingURL=MediatorServer.d.ts.map