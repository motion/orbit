import { Logger } from '@mcro/logger';
import { GithubComment, GithubIssue, GithubOrganization, GithubPerson, GithubRepository } from './GithubTypes';
import { AppBit } from '@mcro/models/_';
export interface GithubLoaderIssueOrPullRequestStreamOptions {
    organization: string;
    repository: string;
    cursor: string;
    loadedCount: number;
    handler: (issue: GithubIssue, cursor?: string, loadedCount?: number, isLast?: boolean) => Promise<boolean> | boolean;
}
export declare class GithubLoader {
    private app;
    private log;
    private loader;
    private totalCost;
    private remainingCost;
    constructor(app: AppBit, log?: Logger);
    loadOrganizations(): Promise<GithubOrganization[]>;
    loadUserRepositories(): Promise<GithubRepository[]>;
    loadRepositories(names: string[]): Promise<GithubRepository[]>;
    loadIssues(options?: GithubLoaderIssueOrPullRequestStreamOptions): Promise<void>;
    loadPullRequests(options?: GithubLoaderIssueOrPullRequestStreamOptions): Promise<void>;
    loadComments(organization: string, repository: string, issueOrPrNumber: number, cursor?: string, loadedCount?: number): Promise<GithubComment[]>;
    loadPeople(organization: string): Promise<GithubPerson[]>;
    private loadOrganizationsByCursor;
    private loadRepositoriesByCursor;
    private loadPeopleByCursor;
    private load;
}
//# sourceMappingURL=GithubLoader.d.ts.map