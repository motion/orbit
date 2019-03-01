export declare type TransportRequestType = 'unsubscribe' | 'command' | 'save' | 'remove' | 'loadOne' | 'loadMany' | 'loadManyAndCount' | 'loadCount' | 'observeOne' | 'observeMany' | 'observeManyAndCount' | 'observeCount' | 'data';
export declare type TransportRequestValues = {
    command?: string;
    model?: string;
    args?: {
        [key: string]: any;
    };
    resolvers?: {
        [key: string]: any;
    };
    value?: any;
};
export declare type TransportRequest = {
    id: string;
    type: TransportRequestType;
} & TransportRequestValues;
export declare type TransportResponse = {
    id: string;
    result: any;
    notFound?: boolean;
};
//# sourceMappingURL=TransportData.d.ts.map