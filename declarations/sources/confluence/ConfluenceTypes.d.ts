export declare type ConfluenceCollection<T> = {
    results: T[];
    start: number;
    limit: number;
    size: number;
};
export declare type ConfluenceGroup = {
    name: string;
};
export declare type ConfluenceUser = {
    accountId: string;
    displayName: string;
    profilePicture: {
        path: string;
        height: number;
        width: number;
    };
    username: string;
    details: {
        personal: {
            email: string;
        };
    };
    userKey: string;
    latest: boolean;
};
export declare type ConfluenceContent = {
    type: 'page';
    childTypes: {
        attachment: {
            value: boolean;
        };
        comment: {
            value: boolean;
        };
        page: {
            value: boolean;
        };
    };
    body: {
        styled_view: {
            value: string;
        };
    };
    history: {
        contributors: {
            publishers: {
                userAccountIds: string[];
            };
        };
        createdDate: string;
        createdBy: ConfluenceUser;
        lastUpdated: {
            by: ConfluenceUser;
            when: string;
        };
    };
    space: {
        id: string;
        name: string;
        _links: {
            base: string;
            webui: string;
        };
    };
    extensions: Object;
    id: string;
    status: string;
    title: string;
    _links: {
        base: string;
        webui: string;
    };
    comments: ConfluenceComment[];
};
export declare type ConfluenceComment = {
    title: string;
    history: {
        createdBy: ConfluenceUser;
    };
};
//# sourceMappingURL=ConfluenceTypes.d.ts.map