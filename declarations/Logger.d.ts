declare type LoggerOpts = {
    trace?: boolean;
};
export declare class Logger {
    private opts;
    private namespace;
    private timers;
    constructor(namespace: string, opts?: LoggerOpts);
    verbose(...messages: any[]): void;
    info(...messages: any[]): void;
    warning(...messages: any[]): void;
    error(...messages: any[]): void;
    timer(label: string, ...messages: any[]): void;
    vtimer(label: string, ...messages: any[]): void;
    clean(): void;
    readonly trace: Logger;
    private log;
}
export {};
//# sourceMappingURL=Logger.d.ts.map