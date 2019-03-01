import { CurrentComponent } from '@mcro/automagical';
export { always, cancel, configureAutomagical, decorate, ensure, IS_STORE, react, ReactionRejectionError, useCurrentComponent, useReaction, } from '@mcro/automagical';
export { configureUseStore } from './configure';
export { createUseStores, UseStoresOptions } from './createUseStores';
export { debugUseStore } from './debugUseStore';
export declare const deep: <X>(x: X) => X;
export declare const shallow: <X>(x: X) => X;
declare type UseStoreOptions = {
    debug?: boolean;
    conditionalUse?: boolean;
    react?: boolean;
};
export declare function disposeStore(store: any, component?: CurrentComponent): void;
export declare function useHook<A extends ((...args: any[]) => any)>(cb: A): ReturnType<A>;
export declare function useStore<A>(Store: {
    new (): A;
} | A, props?: A extends {
    props: infer R;
} ? R : undefined, options?: UseStoreOptions): A;
export declare function useStoreSimple<A>(Store: {
    new (): A;
} | A, props?: A extends {
    props: infer R;
} ? R : undefined, options?: UseStoreOptions): A;
export declare function useStoreDebug(): void;
export declare function useForceUpdate(): () => void;
//# sourceMappingURL=useStore.d.ts.map