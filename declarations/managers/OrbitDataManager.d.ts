import { Space } from '@mcro/models';
export declare const dataDir: string;
export declare const dataPrivateDir: string;
export declare const dataSettingsDir: string;
export declare const dataSpacesDir: string;
export declare class OrbitDataManager {
    subscriptions: Set<ZenObservable.Subscription>;
    start(): Promise<void>;
    dispose(): void;
    observeDatabase(): Promise<void>;
    observeUserSettings(): void;
    observeSpaces(): void;
    observeSpace(space: Space): Set<ZenObservable.Subscription>;
}
//# sourceMappingURL=OrbitDataManager.d.ts.map