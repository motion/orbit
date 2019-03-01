export declare type GithubPaginatedResult<T> = {
    totalCount: number;
    pageInfo: {
        endCursor: string;
        hasNextPage: boolean;
    };
    nodes: T[];
};
export declare type GithubRateLimitResult = {
    rateLimit: {
        limit: number;
        cost: number;
        remaining: number;
        resetAt: string;
    };
};
export interface GithubRepository {
    id: string;
    name: string;
    nameWithOwner: string;
    url: string;
    pushedAt: string;
    issues: {
        nodes: {
            updatedAt: string;
        }[];
        totalCount: number;
    };
    pullRequests: {
        nodes: {
            updatedAt: string;
        }[];
        totalCount: number;
    };
}
export declare type GithubUserRepositoriesQueryResult = {
    viewer: {
        repositories: {
            edges: {
                cursor: string;
                node: GithubRepository;
            }[];
            pageInfo: {
                hasNextPage: boolean;
            };
            totalCount: number;
        };
    };
} & GithubRateLimitResult;
export declare type GithubRepositoryQueryResult = {
    repository: GithubRepository;
};
export declare type GithubOrganizationsQueryResult = {
    viewer: {
        organizations: {
            edges: {
                cursor: string;
                node: GithubOrganization;
            }[];
            pageInfo: {
                hasNextPage: boolean;
            };
            totalCount: number;
        };
    };
} & GithubRateLimitResult;
export declare type GithubIssueQueryResult = {
    repository: {
        id: string;
        name: string;
        issues: GithubPaginatedResult<GithubIssue>;
    };
} & GithubRateLimitResult;
export declare type GithubOrganization = {
    id: string;
    name: string;
};
export declare type GithubIssue = {
    id: string;
    title: string;
    number: number;
    body: string;
    bodyText: string;
    createdAt: string;
    updatedAt: string;
    closed: boolean;
    author: GithubPerson;
    assignees: {
        edges: {
            node: GithubPerson;
        }[];
    };
    participants: {
        edges: {
            node: GithubPerson;
        }[];
    };
    labels: {
        edges: {
            node: {
                name: string;
                description: string;
                color: string;
                url: string;
            };
        }[];
    };
    url: string;
    repository: {
        id: string;
        name: string;
        url: string;
        owner: {
            login: string;
        };
    };
    comments: {
        totalCount: number;
    };
};
export declare type GithubComment = {
    author: GithubPerson;
    createdAt: string;
    body: string;
};
export declare type GithubCommentsResponse = {
    repository: {
        id: string;
        name: string;
        issueOrPullRequest: {
            id: string;
            comments: GithubPaginatedResult<GithubComment>;
        };
    };
} & GithubRateLimitResult;
export declare type GithubPullRequestQueryResult = {
    repository: {
        id: string;
        name: string;
        pullRequests: GithubPaginatedResult<GithubPullRequest>;
    };
} & GithubRateLimitResult;
export declare type GithubCommit = {
    email: string;
    name: string;
    avatarUrl: string;
    user: GithubPerson | null;
};
export declare type GithubPullRequest = {
    id: string;
    title: string;
    number: number;
    body: string;
    bodyText: string;
    createdAt: string;
    updatedAt: string;
    closed: boolean;
    author: GithubPerson;
    url: string;
    repository: {
        id: string;
        name: string;
        url: string;
        owner: {
            login: string;
        };
    };
    assignees: {
        edges: {
            node: GithubPerson;
        }[];
    };
    comments: {
        totalCount: number;
    };
    commits: {
        edges: {
            node: {
                commit: GithubCommit;
            };
        }[];
    };
    labels: {
        edges: {
            node: {
                name: string;
                description: string;
                color: string;
                url: string;
            };
        }[];
    };
    reviews: {
        edges: {
            node: {
                author: GithubPerson;
            };
        }[];
    };
    participants: {
        edges: {
            node: GithubPerson;
        }[];
    };
};
export declare type GithubPeopleQueryResult = {
    organization: {
        members: {
            totalCount: number;
            pageInfo: {
                hasNextPage: boolean;
            };
            edges: {
                cursor: string;
                node: GithubPerson;
            }[];
        };
    };
} & GithubRateLimitResult;
export declare type GithubPerson = {
    id: string;
    login: string;
    location: string;
    avatarUrl: string;
    bio: string;
    email: string;
    name: string;
};
//# sourceMappingURL=GithubTypes.d.ts.map