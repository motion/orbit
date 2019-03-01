import { AppDefinition, AppViews } from '../types/AppDefinition';
import { AppStore } from './AppStore';
declare type LoadedApp = {
    id: string;
    identifier: string;
    views: AppViews;
    provideStores?: any;
    appStore?: AppStore;
    version: number;
};
declare type AppsWithDefinitions = {
    [key: string]: LoadedApp & {
        definition: AppDefinition;
    };
};
export declare class AppsStore {
    stores: import(".").KitStores;
    _apps: {
        [key: string]: LoadedApp;
    };
    definitions: {
        [key: string]: AppDefinition;
    };
    readonly allIds: string[];
    apps: AppsWithDefinitions;
    setApp: (app: {
        identifier: string;
        id: string;
        views: AppViews;
        provideStores?: Object;
    }) => void;
    setAppStore: (id: string, appStore: AppStore) => void;
    setAppDefinition(id: string, definition: AppDefinition): void;
    getApp(identifier: string, id: string): LoadedApp & {
        definition: AppDefinition;
    };
    getAppByIdentifier(identifier: string): LoadedApp & {
        definition: AppDefinition;
    };
    getViewState(identifier: string): {
        hasMain: boolean;
        hasIndex: boolean;
    };
}
export {};
//# sourceMappingURL=AppsStore.d.ts.map