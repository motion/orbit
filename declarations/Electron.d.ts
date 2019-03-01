import { BridgeOptions } from '@mcro/mobx-bridge';
export declare let Electron: ElectronStore;
export declare type PinKeyType = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z' | 'left' | 'right' | 'down';
declare class ElectronStore {
    bridge: import("../../../packages/mobx-bridge/_/Bridge").BridgeManager;
    setState: (newState: any, ignoreSend?: any) => any;
    sendMessage: (Store: any, message: string, value?: string | Object) => Promise<void>;
    onMessage: (a: any, b?: any) => () => void;
    source: string;
    lastAction: any;
    isTorn: boolean;
    state: {
        pinKey: {
            name: PinKeyType;
            at: number;
        };
        realTime: boolean;
        focusedAppId: string;
        screenSize: number[];
        settingsPosition: any[];
        updateState: {
            downloading: boolean;
            percent: number;
        };
        showDevTools: {
            app: boolean;
            0: boolean;
            1: boolean;
            2: boolean;
        };
    };
    start: (options?: BridgeOptions) => Promise<void>;
    setIsTorn(): void;
}
export {};
//# sourceMappingURL=Electron.d.ts.map