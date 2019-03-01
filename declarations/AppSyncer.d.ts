import { Logger } from '@mcro/logger';
import { AppBit } from '@mcro/models';
import { EntityManager } from 'typeorm';
import { SyncerUtils } from './SyncerUtils';
export interface SyncerOptions {
    name?: string;
    appIdentifier?: string;
    runner: SyncerRunner;
    interval: number;
}
export declare type CreateSyncerOptions = {
    app: AppBit;
    log: Logger;
    manager: EntityManager;
    isAborted: () => Promise<void>;
    utils: SyncerUtils;
};
export declare type SyncerRunner = (options: CreateSyncerOptions) => any;
export declare const createSyncer: (runner: SyncerRunner) => SyncerRunner;
//# sourceMappingURL=AppSyncer.d.ts.map