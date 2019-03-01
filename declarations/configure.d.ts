/// <reference types="react" />
declare type UseStoreConfiguration = {
    onMount?: (store: any) => void;
    onUnmount?: (store: any) => void;
    context?: React.Context<any>;
    debugStoreState?: boolean;
};
export declare let config: UseStoreConfiguration;
export declare const configureUseStore: (opts: UseStoreConfiguration) => void;
export {};
//# sourceMappingURL=configure.d.ts.map