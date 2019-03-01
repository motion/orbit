export interface ConfluenceLastSyncInfo {
    lastSyncedDate?: number;
    lastCursor?: number;
    lastCursorSyncedDate?: number;
    lastCursorLoadedCount?: number;
}
export interface ConfluenceAppData {
    values: {
        credentials: {
            domain: string;
            username: string;
            password: string;
        };
        pageLastSync: ConfluenceLastSyncInfo;
        blogLastSync: ConfluenceLastSyncInfo;
    };
    data: {};
}
//# sourceMappingURL=ConfluenceAppData.d.ts.map