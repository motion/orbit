import { BridgeOptions } from '@mcro/mobx-bridge';
export declare let App: AppStore;
export declare type AppState = {
    id: number;
    appConfig: any;
    viewType?: 'index' | 'main' | 'setup';
    torn: boolean;
    target?: {
        top: number;
        left: number;
        width: number;
        height: number;
    };
    peekOnLeft: boolean;
    viewConfig?: any;
    position: [number, number];
    size: [number, number];
};
export declare const defaultPeekState: AppState;
export declare type MenuState = {
    id: number;
    open: boolean;
    position: [number, number];
    size: [number, number];
};
export declare type AppStateEntry = {
    id: number;
    type: string;
    appId: number;
};
declare class AppStore {
    orbitState: AppStore['state']['orbitState'];
    authState: AppStore['state']['authState'];
    peeksState: AppStore['state']['peeksState'];
    setOrbitState: Function;
    setAuthState: Function;
    setState: (newState: any, ignoreSend?: any) => any;
    sendMessage: (Store: any, message: string, value?: string | Object) => Promise<void>;
    onMessage: (a: any, b?: any) => () => void;
    bridge: import("../../../packages/mobx-bridge/_/Bridge").BridgeManager;
    source: string;
    state: {
        userSettings: {
            hasOnboarded?: boolean;
            autoUpdate?: boolean;
            autoLaunch?: boolean;
            theme?: "dark" | "light" | "automatic";
            vibrancy?: "none" | "some" | "more";
            openShortcut?: string;
            recentSearches?: string[];
        };
        allApps: AppStateEntry[];
        orbitState: {
            blurred: boolean;
            pinned: boolean;
            docked: boolean;
            orbitOnLeft: boolean;
            position: number[];
            size: number[];
            inputFocused: boolean;
            shortcutInputFocused: boolean;
        };
        trayState: {
            menuState: {
                0: MenuState;
                1: MenuState;
                2: MenuState;
                3: MenuState;
            };
        };
        peeksState: AppState[];
        authState: {
            openId: any;
            closeId: any;
        };
        highlightWords: {};
        hoveredWord: any;
        hoveredLine: any;
        contextMessage: string;
        showSpaceSwitcher: number;
    };
    readonly isDark: boolean;
    readonly vibrancy: "dark" | "light" | "none" | "ultra-dark";
    readonly peekState: AppState;
    readonly isShowingPeek: boolean;
    readonly isShowingMenu: boolean;
    getAppState(id: number): AppState;
    readonly openMenu: MenuState;
    start: (options?: BridgeOptions) => Promise<void>;
}
export {};
//# sourceMappingURL=App.d.ts.map