import { Logger } from '@mcro/logger';
import { JiraIssue, JiraUser } from './JiraTypes';
import { AppBit } from '@mcro/models';
export declare class JiraLoader {
    private app;
    private log;
    private loader;
    constructor(app: AppBit, log?: Logger);
    test(): Promise<void>;
    loadUsers(startAt?: number): Promise<JiraUser[]>;
    loadIssues(cursor: number, loadedCount: number, handler: (issue: JiraIssue, cursor?: number, loadedCount?: number, isLast?: boolean) => Promise<boolean> | boolean): Promise<void>;
    private loadComments;
}
//# sourceMappingURL=JiraLoader.d.ts.map