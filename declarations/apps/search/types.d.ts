import { AppBit } from '@mcro/models';
export declare type SearchAppFilter = {
    type: 'date';
    value: {
        startDate?: string;
        endDate?: string;
    };
} | {
    type: 'app';
    value: 'string';
} | {
    type: 'content';
    value: 'person' | 'document' | 'email' | 'chat' | 'task' | 'wiki';
} | {
    type: 'extras';
    value: 'showApps';
};
export declare type SearchAppData = {
    enforcedFilters?: SearchAppFilter[];
    defaultSort?: 'recent' | 'relevant';
};
export declare type SearchApp = AppBit & {
    type: 'search';
    data: SearchAppData;
};
//# sourceMappingURL=types.d.ts.map