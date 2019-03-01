import { Cosal } from '@mcro/cosal';
import { BitEntity } from '@mcro/models';
export declare class CosalManager {
    cosal: Cosal;
    scanTopicsInt: any;
    dbPath: string;
    constructor({ dbPath }: {
        dbPath: string;
    });
    start(): Promise<void>;
    dispose(): void;
    reset(): Promise<void>;
    search: (query: string, { max }: {
        max?: number;
    }) => Promise<BitEntity[]>;
    private getLastScan;
    updateSearchIndexWithNewBits: () => Promise<void>;
}
//# sourceMappingURL=CosalManager.d.ts.map