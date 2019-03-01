export declare type GMailUserProfile = {
    emailAddress: string;
    messagesTotal: number;
    threadsTotal: number;
    historyId: number;
};
export declare type GMailThread = {
    id: string;
    historyId: string;
    messages: GMailMessage[];
};
export declare type GMailMessage = {
    id: string;
    threadId: string;
    labelIds: string[];
    snippet: string;
    historyId: string;
    internalDate: string;
    payload: {
        headers: {
            name: string;
            value: string;
        }[];
        parts: {
            mimeType: string;
            body: {
                size: number;
                data: string;
            };
        }[];
        body: {
            size: number;
            data: string;
        };
        mimeType: string;
    };
};
export declare type GMailThreadResult = {
    threads: GMailThread[];
    nextPageToken: string;
    resultSizeEstimate: number;
};
export declare type GMailHistory = {
    historyId: string;
    nextPageToken: string;
    history: {
        messages: {
            id: string;
            threadId: string;
        }[];
        messagesAdded: GMailHistoryMessageAction[];
        messageDeleted: GMailHistoryMessageAction[];
        labelsAdded: GMailHistoryMessageAction[];
        labelsRemoved: GMailHistoryMessageAction[];
    }[];
};
export declare type GMailHistoryMessageAction = {
    message: {
        id: string;
        threadId: string;
    };
    labelIds?: string[];
};
export declare type GMailHistoryLoadResult = {
    historyId: string;
    addedThreadIds: string[];
    removedThreadIds: string[];
};
//# sourceMappingURL=GMailTypes.d.ts.map