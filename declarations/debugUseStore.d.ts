import { CurrentComponent } from '@mcro/automagical';
declare type UseStoreDebugEvent = {
    type: 'observe';
    key: string;
    oldValue: any;
    newValue: any;
    store: any;
    component: CurrentComponent;
} | {
    type: 'render';
    store: any;
    component: CurrentComponent;
    reactiveKeys: Set<string>;
} | {
    type: 'prop';
    key: string;
    oldValue: any;
    newValue: any;
    store: any;
} | {
    type: 'unmount';
    store: any;
    component: CurrentComponent;
} | {
    type: 'mount';
    store: any;
    component: CurrentComponent;
} | {
    type: 'state';
    value: Object;
};
export declare function debugUseStore(cb: (event: UseStoreDebugEvent) => any): () => boolean;
export declare function debugEmit(event: UseStoreDebugEvent, options?: {
    debug?: boolean;
}): void;
export {};
//# sourceMappingURL=debugUseStore.d.ts.map