export declare type AppConfig = {
    identifier?: string;
    id?: string;
    subId?: string;
    title?: string;
    data?: any;
    icon?: string;
    iconLight?: string;
    subType?: string;
    viewType?: 'main' | 'index' | 'setup' | 'settings';
    viewConfig?: {
        showTitleBar?: boolean;
        viewPane?: string;
        dimensions?: [number, number];
        contentSize?: number;
        initialState?: {
            [key: string]: any;
        };
    };
};
//# sourceMappingURL=AppConfig.d.ts.map