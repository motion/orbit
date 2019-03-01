import express from 'express';
import OAuth from './oauth';
export declare class AuthServer {
    private server;
    cache: {};
    app: express.Application;
    oauth: OAuth;
    isRunning(): boolean;
    start(): Promise<void>;
    stop(): Promise<void>;
    private setupExpressApp;
    private cors;
    private setupPassportRoutes;
    private setupAuthRefreshRoutes;
    private setupAuthReplyRoutes;
}
//# sourceMappingURL=AuthServer.d.ts.map