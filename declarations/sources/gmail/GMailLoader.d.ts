import { Logger } from '@mcro/logger';
import { ServiceLoaderAppSaveCallback } from '../../loader/ServiceLoaderTypes';
import { GMailHistoryLoadResult, GMailThread, GMailUserProfile } from './GMailTypes';
import { AppBit } from '@mcro/models';
export declare class GMailLoader {
    private app;
    private log;
    private loader;
    constructor(app: AppBit, log?: Logger, saveCallback?: ServiceLoaderAppSaveCallback);
    loadProfile(): Promise<GMailUserProfile>;
    loadHistory(startHistoryId: string, pageToken?: string): Promise<GMailHistoryLoadResult>;
    loadThreads(options: {
        count: number;
        queryFilter?: string;
        filteredIds?: string[];
        pageToken?: string;
        loadedCount?: number;
        handler: (thread: GMailThread, cursor?: string, loadedCount?: number, isLast?: boolean) => Promise<boolean> | boolean;
    }): Promise<void>;
    loadMessages(threads: GMailThread[]): Promise<void>;
}
//# sourceMappingURL=GMailLoader.d.ts.map