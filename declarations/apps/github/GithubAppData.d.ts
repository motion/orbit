export interface GithubAppValuesLastSyncRepositoryInfo {
    lastSyncedDate?: number;
    lastCursor?: string;
    lastCursorSyncedDate?: number;
    lastCursorLoadedCount?: number;
}
export interface GithubAppValues {
    whitelist?: string[];
    externalRepositories: string[];
    lastSyncIssues: {
        [repository: string]: GithubAppValuesLastSyncRepositoryInfo;
    };
    lastSyncPullRequests: {
        [repository: string]: GithubAppValuesLastSyncRepositoryInfo;
    };
    oauth: {
        refreshToken: string;
        secret: string;
        clientId: string;
    };
}
export interface GithubAppData {
    values: GithubAppValues;
    data: {
        repositories: any[];
    };
}
//# sourceMappingURL=GithubAppData.d.ts.map