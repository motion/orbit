export declare const GET_STORE: unique symbol;
declare type ProxyWorm<A extends Function> = {
    state: ProxyWormState;
    store: A;
    track(debug?: boolean): () => Set<string>;
};
declare type ProxyWormState = {
    ids: Set<number>;
    loops: WeakMap<any, any>;
    keys: Map<number, Set<string>>;
    add: (s: string) => void;
    activeId: number;
    debug: boolean;
};
export declare function mobxProxyWorm<A extends Function>(obj: A, parentPath?: string, parentState?: ProxyWormState): ProxyWorm<A>;
export {};
//# sourceMappingURL=mobxProxyWorm.d.ts.map