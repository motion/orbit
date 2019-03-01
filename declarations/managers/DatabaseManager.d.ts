import { Desktop } from '@mcro/stores';
export declare class DatabaseManager {
    searchIndexListener: ReturnType<typeof Desktop.onMessage>;
    start(): Promise<void>;
    dispose(): void;
    resetAllData(): Promise<void>;
    private createIndices;
    private createSearchIndices;
    removeSearchIndex: () => Promise<void>;
}
//# sourceMappingURL=DatabaseManager.d.ts.map