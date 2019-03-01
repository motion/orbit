/// <reference types="lodash" />
import { Screen } from '@mcro/screen';
import { Cosal } from '@mcro/cosal';
export declare class OCRManager {
    cosal: Cosal;
    hasResolvedOCR: boolean;
    clearOCRTm: any;
    isWatching: string;
    curAppID: string;
    curAppName: string;
    watchSettings: {
        name: string;
        settings: {};
    };
    started: boolean;
    screen: Screen;
    constructor({ cosal }: {
        cosal: Cosal;
    });
    start: () => Promise<boolean>;
    dispose(): Promise<void>;
    toggleOCR(): Promise<void>;
    pauseIfNoPermission(): boolean;
    setupScreenListeners(): void;
    restartScreen(): Promise<void>;
    setScreenChanged: () => void;
    clearOCRState: (() => void) & import("lodash").Cancelable;
}
//# sourceMappingURL=OCRManager.d.ts.map