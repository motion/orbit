import { MediatorServer } from '@mcro/mediator';
import { DatabaseManager } from './managers/DatabaseManager';
export declare class OrbitDesktopRoot {
    stores: any;
    databaseManager: DatabaseManager;
    mediatorServer: MediatorServer;
    private config;
    private screen;
    private authServer;
    private onboardManager;
    private disposed;
    private webServer;
    private cosal;
    private orbitDataManager;
    private oracleManager;
    private cosalManager;
    private generalSettingManager;
    private keyboardManager;
    private topicsManager;
    private operatingSystemManager;
    start: () => Promise<void>;
    restart: () => void;
    dispose: () => Promise<boolean>;
    private registerREPLGlobals;
    private registerMediatorServer;
}
//# sourceMappingURL=OrbitDesktopRoot.d.ts.map