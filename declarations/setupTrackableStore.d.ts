declare type TrackableStoreOptions = {
    component: any;
    debug?: boolean;
};
export declare function setupTrackableStore(store: any, rerender: Function, opts?: TrackableStoreOptions): {
    store: Function;
    track(): void;
    untrack(): void;
    dispose(): void;
};
export declare function useTrackableStore<A>(plainStore: A, rerenderCb: Function, opts?: TrackableStoreOptions): A;
export {};
//# sourceMappingURL=setupTrackableStore.d.ts.map