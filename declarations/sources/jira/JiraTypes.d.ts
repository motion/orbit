export declare type JiraUser = {
    accountId: string;
    self: string;
    key: string;
    name: string;
    emailAddress: string;
    displayName: string;
    avatarUrls: {
        '48x48': string;
    };
};
export declare type JiraIssueCollection = {
    total: number;
    issues: JiraIssue[];
};
export declare type JiraCommentCollection = {
    total: number;
    comments: JiraComment[];
};
export declare type JiraComment = {
    body: string;
    author: JiraUser;
};
export declare type JiraIssue = {
    id: string;
    self: string;
    key: string;
    fields: {
        summary: string;
        description: string;
        created: string;
        updated: string;
        project: {
            id: string;
            name: string;
            key: string;
        };
        comment: {
            total: number;
        };
        creator: JiraUser;
        assignee: JiraUser;
        reporter: JiraUser;
    };
    renderedFields: {
        description: string;
    };
    comments: JiraComment[];
};
//# sourceMappingURL=JiraTypes.d.ts.map