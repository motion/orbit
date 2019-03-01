import { ServiceLoaderLoadOptions } from '../../loader/ServiceLoaderTypes';
import { JiraCommentCollection, JiraIssueCollection, JiraUser } from './JiraTypes';
export declare class JiraQueries {
    static test(): ServiceLoaderLoadOptions<JiraUser[]>;
    static users(startAt: number, maxResults: number): ServiceLoaderLoadOptions<JiraUser[]>;
    static issues(startAt: number, maxResults: number): ServiceLoaderLoadOptions<JiraIssueCollection>;
    static comments(issueId: string, startAt: number, maxResults: number): ServiceLoaderLoadOptions<JiraCommentCollection>;
}
//# sourceMappingURL=JiraQueries.d.ts.map