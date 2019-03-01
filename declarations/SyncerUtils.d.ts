import { EntityManager } from 'typeorm';
import { AppBit, Bit } from '@mcro/models';
import { Logger } from '@mcro/logger';
import { MediatorClient } from '@mcro/mediator';
export interface BitSyncerOptions {
    apiBits: Bit[];
    dbBits: Bit[];
    completeBitsData?: (bits: Bit[]) => void | Promise<void>;
}
export declare class SyncerUtils {
    private app;
    private manager;
    private log;
    private isAborted;
    private mediator;
    constructor(app: AppBit, log: Logger, manager: EntityManager, isAborted: () => Promise<boolean>, mediator: MediatorClient);
    syncPeople(apiPeople: Bit[], dbPeople: Bit[]): Promise<Bit[]>;
    loadDatabaseBits(options?: {
        ids?: number[];
        locationId?: string;
        oldestMessageId?: string;
    }): Promise<Bit[]>;
    loadDatabasePeople(options?: {
        ids?: number[];
    }): Promise<Bit[]>;
    stripHtml(value: string): any;
    sanitizeHtml(value: string): any;
    syncBits(options: BitSyncerOptions): Promise<void>;
    loadTextTopWords(text: string, max: number): Promise<string[]>;
}
//# sourceMappingURL=SyncerUtils.d.ts.map