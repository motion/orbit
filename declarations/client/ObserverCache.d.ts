/// <reference types="zen-observable" />
import { Model } from '../common';
export declare type ObserverCacheType = 'one' | 'many' | string;
export declare type ObserverCacheArgs = {
    model: Model<any>;
    type: ObserverCacheType;
    query: Object;
    defaultValue: any;
};
export declare type ObserverCacheEntry = {
    args: ObserverCacheArgs;
    subscriptions: Set<ZenObservable.SubscriptionObserver<any>>;
    rawValue: any;
    value: any;
    denormalizedValues: {};
    update: (value: any) => void;
    removeTimeout?: any;
    key: string;
    onDispose?: Function;
    isActive?: boolean;
};
export declare const ObserverCache: {
    entries: Map<string, ObserverCacheEntry>;
    getKey({ model, type, query }: ObserverCacheArgs): string;
    get(args: ObserverCacheArgs): ObserverCacheEntry;
    updateModels(model: Model<any, {}, {}>, values: any[]): void;
    delete(entry: ObserverCacheEntry): void;
};
//# sourceMappingURL=ObserverCache.d.ts.map