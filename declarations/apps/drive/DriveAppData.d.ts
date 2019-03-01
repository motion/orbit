export interface DriveLastSyncInfo {
    lastSyncedDate?: number;
    lastCursor?: string;
    lastCursorSyncedDate?: number;
}
export interface DriveAppValues {
    oauth: {
        refreshToken: string;
        secret: string;
        clientId: string;
    };
    lastSync: DriveLastSyncInfo;
}
export interface DriveAppData {
    data: {};
    values: DriveAppValues;
}
//# sourceMappingURL=DriveAppData.d.ts.map