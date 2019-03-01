export interface JiraLastSyncInfo {
    lastSyncedDate?: number;
    lastCursor?: number;
    lastCursorSyncedDate?: number;
    lastCursorLoadedCount?: number;
}
export interface JiraAppValues {
    credentials: {
        domain: string;
        username: string;
        password: string;
    };
    lastSync: JiraLastSyncInfo;
}
export interface JiraAppData {
    data: {};
    values: JiraAppValues;
}
//# sourceMappingURL=JiraAppData.d.ts.map