declare type DevInfo = {
    debugUrl: string;
    url: string;
    port: string;
};
export default class DebugApps {
    isRendering?: Boolean;
    disposed?: Boolean;
    browser: any;
    options: any;
    sessions: any[];
    intervals: any[];
    constructor({ sessions, ...options }: {
        [x: string]: any;
        sessions?: any[];
    });
    readonly shouldRun: boolean;
    lastErr: any;
    start(): Promise<void>;
    dispose: () => Promise<void>;
    renderLoop: () => Promise<void>;
    getSessions: () => Promise<any>;
    lastRes: {};
    getUrlForJsonInfo: (jsonInfo: any, port: any) => any;
    getDevUrl: ({ port, id }: {
        port: any;
        id: any;
    }) => Promise<DevInfo[]>;
    pages: any[];
    getPages: () => Promise<any>;
    numTabs: (curSessions: any) => any;
    ensureEnoughTabs: (sessions: any) => Promise<void>;
    shouldUpdateTabs: (sessions: any) => Promise<boolean[]>;
    openUrlsInTabs: (sessions: any, pages: any, updateTabs: any) => Promise<any[]>;
    removeExtraTabs: (sessions: any) => Promise<void>;
    finishLoadingPage: (index: any, page: any, { url, port }: {
        url: any;
        port: any;
    }) => Promise<void>;
    render: () => Promise<void>;
    clearIntervals: () => void;
}
export {};
//# sourceMappingURL=debugBrowser.d.ts.map