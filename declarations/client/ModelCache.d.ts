/// <reference types="zen-observable" />
import { Model } from '../common';
export declare type ModelCacheEntry = {
    model: Model<any>;
    value: any;
    id: number;
    subscriptionObservers: ZenObservable.SubscriptionObserver<any>[];
};
export declare const ModelCache: {
    entries: ModelCacheEntry[];
    add(model: Model<any, {}, {}>, id: number, value: any): ModelCacheEntry;
    remove(model: Model<any, {}, {}>, id: number): void;
    findEntryByQuery(model: Model<any, {}, {}>, id: number): ModelCacheEntry;
};
//# sourceMappingURL=ModelCache.d.ts.map