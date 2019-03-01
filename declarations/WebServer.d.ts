import express from 'express';
export declare class WebServer {
    cache: {};
    login: any;
    app: express.Application;
    constructor();
    start(): Promise<void>;
    private cors;
    private setupOrbitApp;
}
//# sourceMappingURL=WebServer.d.ts.map