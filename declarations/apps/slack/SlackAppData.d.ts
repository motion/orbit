export interface SlackAppData {
    data: {
        channels: any[];
    };
    values: {
        whitelist: string[];
        oauth?: {
            refreshToken: string;
            secret: string;
            clientId: string;
        };
        channels?: Array<string>;
        lastAttachmentSync?: {
            [key: string]: string;
        };
        lastMessageSync?: {
            [key: string]: string;
        };
        team: {
            id: string;
            name: string;
            domain: string;
            icon: string;
        };
    };
}
//# sourceMappingURL=SlackAppData.d.ts.map