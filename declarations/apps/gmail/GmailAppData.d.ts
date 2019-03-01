export interface GmailAppValuesLastSync {
    historyId?: string;
    lastCursor?: string;
    lastCursorHistoryId?: string;
    lastCursorLoadedCount?: number;
    usedQueryFilter?: string;
    usedMax?: number;
    usedDaysLimit?: number;
}
export interface GmailAppValues {
    max?: number;
    daysLimit?: number;
    filter?: string;
    whitelist?: {
        [email: string]: boolean;
    };
    foundEmails?: string[];
    oauth: {
        refreshToken: string;
        secret: string;
        clientId: string;
    };
    lastSync: GmailAppValuesLastSync;
}
export interface GmailAppData {
    data: {};
    values: GmailAppValues;
}
//# sourceMappingURL=GmailAppData.d.ts.map