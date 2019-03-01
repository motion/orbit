declare type MobxEvent = {
    name: string;
    type: 'reaction' | 'transaction' | 'compute' | 'action';
    spyReportStart: boolean;
    time?: number;
};
export declare const enableLogging: (options?: {
    action: boolean;
    reaction: boolean;
    transaction: boolean;
    compute: boolean;
    predicate: (_event: MobxEvent) => boolean;
}) => import("mobx").Lambda;
export {};
//# sourceMappingURL=mobxLogger.d.ts.map