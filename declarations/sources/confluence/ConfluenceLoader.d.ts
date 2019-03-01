import { Logger } from '@mcro/logger';
import { ConfluenceContent, ConfluenceUser } from './ConfluenceTypes';
import { AppBit } from '@mcro/models';
export declare class ConfluenceLoader {
    private app;
    private log;
    private loader;
    constructor(app: AppBit, log?: Logger);
    test(): Promise<void>;
    loadContents(type: 'page' | 'blogpost', cursor: number, loadedCount: number, handler: (content: ConfluenceContent, cursor?: number, loadedCount?: number, isLast?: boolean) => Promise<boolean> | boolean): Promise<void>;
    private loadComments;
    loadUsers(): Promise<ConfluenceUser[]>;
    private loadGroups;
    private loadGroupMembers;
}
//# sourceMappingURL=ConfluenceLoader.d.ts.map