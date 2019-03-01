import { Setting } from '@mcro/models';
export declare class SettingStore {
    setting: Setting;
    settingModel: Setting;
    updateSettingFromModel: void;
    readonly values: {
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
    };
    update: (values: Partial<{
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
    }>) => Promise<void>;
}
//# sourceMappingURL=SettingStore.d.ts.map