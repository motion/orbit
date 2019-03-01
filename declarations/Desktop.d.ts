import { BridgeOptions } from '@mcro/mobx-bridge';
export declare let Desktop: DesktopStore;
export declare type DesktopStateOCRItem = [number, number, number, number, string, number, string];
export declare type AppFocusState = {
    [key: number]: {
        focused: number | false;
        exited: boolean;
    } | null;
};
export declare type OSThemes = 'dark' | 'light';
declare class DesktopStore {
    hoverState: DesktopStore['state']['hoverState'];
    appState: DesktopStore['state']['appState'];
    ocrState: DesktopStore['state']['ocrState'];
    searchState: DesktopStore['state']['searchState'];
    keyboardState: DesktopStore['state']['keyboardState'];
    mouseState: DesktopStore['state']['mouseState'];
    setKeyboardState: DesktopStore['setState'];
    setAppState: DesktopStore['setState'];
    setOcrState: DesktopStore['setState'];
    setSearchState: DesktopStore['setState'];
    setMouseState: DesktopStore['setState'];
    setPaused: DesktopStore['setState'];
    setLastScreenChange: DesktopStore['setState'];
    bridge: import("../../../packages/mobx-bridge/_/Bridge").BridgeManager;
    setState: (newState: any, ignoreSend?: any) => any;
    sendMessage: (Store: any, message: string, value?: string | Object) => Promise<void>;
    onMessage: (a: any, b?: any) => () => void;
    source: string;
    state: {
        appState: {
            id: string;
            name: string;
            title: string;
            offset: number[];
            bounds: number[];
        };
        hoverState: {
            orbitHovered: boolean;
            menuHovered: boolean;
            appHovered: {
                0: boolean;
            };
        };
        ocrState: {
            salientWords: string[];
            wordsString: string;
            words: [number, number, number, number, string, number, string][];
            lines: [number, number, number, number, string, number, string][];
            shouldClear: any[];
            clearWords: any;
            restoreWords: any;
            paused: boolean;
        };
        errorState: {
            title: string;
            message: string;
            type: "null" | "warning" | "error";
        };
        searchState: {
            indexStatus: string;
            searchResults: any[];
            pluginResults: any[];
        };
        keyboardState: {
            isHoldingOption: boolean;
            escapeDown: number;
        };
        mouseState: {
            mouseDown: number;
        };
        onboardState: {
            foundSources: {};
        };
        operatingSystem: {
            theme: OSThemes;
            trayBounds: {
                size: number[];
                position: number[];
            };
            accessibilityPermission: boolean;
            macVersion: any;
            supportsTransparency: boolean;
        };
        appFocusState: AppFocusState;
        focusedOnOrbit: boolean;
        lastScreenChange: number;
        lastAppChange: number;
        movedToNewSpace: number;
    };
    readonly linesBoundingBox: {
        left: number;
        top: number;
        width: number;
        height: number;
    };
    readonly activeOCRWords: [number, number, number, number, string, number, string][];
    start: (options?: BridgeOptions) => Promise<void>;
    dispose: () => void;
}
export {};
//# sourceMappingURL=Desktop.d.ts.map