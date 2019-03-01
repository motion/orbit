import { SocketSender } from './ScreenBridge';
export declare class Screen {
    socketSend: SocketSender;
    private onClose?;
    private env;
    private socketPort;
    private options;
    private process;
    private screenBridge;
    private debugBuild;
    private onInfoCB;
    private onErrorCB;
    private onSpaceMoveCB;
    private onTrayStateCB;
    private binPath;
    private state;
    setState: (nextState: any) => Promise<void>;
    constructor({ debugBuild, socketPort, binPath, env, ocr, showTray, appWindow, onClose, }?: {
        debugBuild?: boolean;
        socketPort?: number;
        binPath?: any;
        env?: any;
        ocr?: boolean;
        showTray?: boolean;
        appWindow?: boolean;
        onClose?: any;
    });
    start: () => Promise<void>;
    stop: () => Promise<void>;
    restart: () => Promise<void>;
    defocus: () => Promise<void>;
    startWatchingWindows(): Promise<void>;
    stopWatchingWindows(): Promise<void>;
    getInfo: () => Promise<void>;
    onInfo: (cb: any) => void;
    onSpaceMove: (cb: any) => void;
    onError: (cb: any) => void;
    onTrayState: (cb: any) => void;
    actions: {
        [key: string]: Function;
    };
    private runScreenProcess;
}
//# sourceMappingURL=Screen.d.ts.map