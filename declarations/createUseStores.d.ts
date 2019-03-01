/// <reference types="react" />
export declare type UseStoresOptions<A> = {
    optional?: (keyof A)[];
    debug?: boolean;
};
export declare function createUseStores<A extends Object>(StoreContext: React.Context<A>): (options?: UseStoresOptions<A>) => A;
//# sourceMappingURL=createUseStores.d.ts.map