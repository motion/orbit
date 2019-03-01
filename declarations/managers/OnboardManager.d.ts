import { SettingEntity } from '@mcro/models';
export declare class OnboardManager {
    generalSetting: SettingEntity;
    history: any[];
    foundSources: any;
    start(): Promise<void>;
    scanHistory(): Promise<void>;
    getTopUrlsLike: (db: any, pattern: any) => Promise<any>;
    scanChrome(dbPath: string): Promise<void>;
}
//# sourceMappingURL=OnboardManager.d.ts.map