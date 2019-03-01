import { SettingEntity, Setting } from '@mcro/models';
export declare function getSetting(): Promise<SettingEntity>;
export declare function getSettingValue<A extends keyof Setting['values']>(key?: A): Promise<{
    hasOnboarded?: boolean;
    autoUpdate?: boolean;
    autoLaunch?: boolean;
    darkTheme?: boolean;
    realtimeSearch?: boolean;
    openShortcut?: string;
    cosalIndexUpdatedTo?: number;
    topicsIndexUpdatedTo?: number;
    topTopics?: string[];
    recentSearches?: string[];
    pinnedBits?: string[];
    pinnedUrls?: string[];
}[A]>;
export declare function updateSetting(values: Partial<Setting['values']>): Promise<void>;
export declare function ensureSetting<A extends keyof Setting['values']>(key: A, value: Setting['values'][A]): Promise<void>;
//# sourceMappingURL=settingModelHelpers.d.ts.map