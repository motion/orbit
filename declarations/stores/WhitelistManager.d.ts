/// <reference types="lodash" />
export declare class WhitelistManager<T extends {
    data?: {
        values?: {
            whitelist?: string[];
        };
    };
}> {
    props: {
        app: T;
        getAll: () => string[];
    };
    values: T['data']['values'];
    syncValuesFromProp: void;
    readonly isWhitelisting: boolean;
    getIsWhitelisting(): boolean;
    persistSetting: void;
    updateValues(cb: any): void;
    getValue(key: string): any;
    toggleActive: () => void;
    whilistStatusGetter: ((id: string) => () => boolean) & import("lodash").MemoizedFunction;
    updateWhitelistValueSetter: ((id: string) => () => void) & import("lodash").MemoizedFunction;
}
//# sourceMappingURL=WhitelistManager.d.ts.map